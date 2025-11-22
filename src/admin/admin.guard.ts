import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import ApiError from 'src/exceptions/errors/api-error';
import { TokenService } from 'src/token/token.service';
import * as cookie from 'cookie';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    @InjectModel('User') private UserModel: Model<UserClass>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookies = cookie.parse(request.headers.cookie || '');
    const accessToken = cookies.token;

    if (!accessToken) throw ApiError.UnauthorizedError();

    const userData = this.tokenService.validateAccessToken(accessToken);

    if (!userData?._id) throw ApiError.UnauthorizedError();

    const user = await this.UserModel.findById(userData._id);
    if (!user) throw ApiError.UnauthorizedError();

    if (!user.is_admin)
      throw ApiError.ForbiddenError('Доступ разрешён только администраторам');

    request.user = user;

    return true;
  }
}
