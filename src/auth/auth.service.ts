import { Injectable } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { Model } from 'mongoose';
import ApiError from 'src/exceptions/errors/api-error';
import { InjectModel } from '@nestjs/mongoose';
import { UserClass } from 'src/user/schemas/user.schema';
import { User } from 'src/user/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { UserFromClient } from 'src/user/interfaces/user-from-client.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private UserModel: Model<UserClass>,
    private TokenService: TokenService,
  ) {}

  async registration(user: UserFromClient | User) {
    const candidate = await this.UserModel.findOne({ email: user.email });

    if (candidate)
      throw ApiError.BadRequest(
        `Пользователь с почтой ${user.email} уже существует`,
      );

    if (user.password.length < 8)
      throw ApiError.BadRequest('Слишком короткий пароль');

    const password = await bcrypt.hash(user.password, 3);
    const created_user = (
      await this.UserModel.create(Object.assign(user, { password }))
    ).toObject();

    const tokens = this.TokenService.generateTokens({
      _id: created_user._id,
      password: created_user.password,
    });
    await this.TokenService.saveToken(tokens.refreshToken);

    return {
      ...tokens,
      user: created_user,
    };
  }

  async login(email: string, password: string) {
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }

    if (user.password.length < 8)
      throw ApiError.BadRequest('Слишком короткий пароль');

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль');
    }

    const tokens = this.TokenService.generateTokens({
      _id: user._id,
      password: user.password,
    });
    await this.TokenService.saveToken(tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async loginAdmin(email: string, password: string) {
    if (email !== process.env.ADMIN_EMAIL) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }

    const isPassValid = password === process.env.ADMIN_PASS;
    if (!isPassValid) {
      throw ApiError.BadRequest('Неверный пароль');
    }

    let user = await this.UserModel.findOne({ email });
    if (!user) {
      const hashed = await bcrypt.hash(password, 3);
      user = await this.UserModel.create({
        email,
        password: hashed,
        is_admin: true,
      });
    }

    if (!user.password || user.password.length < 8) {
      throw ApiError.BadRequest('Некорректное состояние пароля в базе');
    }

    const tokens = this.TokenService.generateTokens({
      _id: user._id,
      password: user.password,
    });

    await this.TokenService.saveToken(tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  async refresh(refreshToken: string, accessToken: string) {
    let userData: any;
    let user: any;

    userData = this.TokenService.validateAccessToken(accessToken);

    if (userData != null) {
      user = await this.UserModel.findById(userData._id);

      return {
        refreshToken: refreshToken,
        accessToken: accessToken,
        user: user,
      };
    }

    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    userData = this.TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    user = (await this.UserModel.findById(userData._id)).toObject();

    if (userData.password !== user.password) {
      throw ApiError.AccessDenied('Аутентификация провалена. Пароль изменен');
    }

    const newAccessToken = this.TokenService.generateAccessToken({
      _id: user._id,
      password: user.password,
    });

    return {
      refreshToken: refreshToken,
      accessToken: newAccessToken,
      user: user,
    };
  }

  async logout(refreshToken: string) {
    return await this.TokenService.removeToken(refreshToken);
  }

  async update(newUser: UserFromClient, userId: string) {
    return await this.UserModel.findByIdAndUpdate(userId, newUser, {
      new: true,
      runValidators: true,
    });
  }
}
