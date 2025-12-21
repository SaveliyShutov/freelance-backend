import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';
import { Token } from './interfaces/token.interface';
import { TokenClass } from './schemas/token.schema';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(@InjectModel('Token') private TokenModel: Model<TokenClass>) {}

  validateResetToken(token: string, secret: string): any | null {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      this.logger.warn(
        `validateResetToken: verification failed. Token: ${this._shortenTokenForLog(
          token,
        )}. Error: ${err?.name} — ${err?.message}`,
      );
      return null;
    }
  }

  createResetToken(payload: any, secret: string): string | null {
    try {
      return jwt.sign(payload, secret, { expiresIn: '7d' });
    } catch (err) {
      this.logger.error(
        `createResetToken: signing failed. Error: ${err?.name} — ${err?.message}`,
        err?.stack,
      );
      return null;
    }
  }

  generateTokens(payload: any): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    try {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '7d',
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '30d',
      });
      return { accessToken, refreshToken };
    } catch (err) {
      this.logger.error(
        `generateTokens: token generation failed. Error: ${err?.name} — ${err?.message}`,
        err?.stack,
      );
      return { accessToken: null, refreshToken: null };
    }
  }

  generateAccessToken(payload: any): string | null {
    try {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '7d',
      });
      return accessToken;
    } catch (err) {
      this.logger.error(
        `generateAccessToken: signing failed. Error: ${err?.name} — ${err?.message}`,
        err?.stack,
      );
      return null;
    }
  }

  validateAccessToken(token: string): User | null {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET) as User;
    } catch (err) {
      this.logger.warn(
        `validateAccessToken: verification failed. Token: ${this._shortenTokenForLog(
          token,
        )}. Error: ${err?.name} — ${err?.message}`,
      );
      return null;
    }
  }

  validateRefreshToken(token: string): User | null {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as User;
    } catch (err) {
      this.logger.warn(
        `validateRefreshToken: verification failed. Token: ${this._shortenTokenForLog(
          token,
        )}. Error: ${err?.name} — ${err?.message}`,
      );
      return null;
    }
  }

  async saveToken(refreshToken: string): Promise<Token> {
    try {
      return await this.TokenModel.create({ refreshToken });
    } catch (err) {
      this.logger.error(
        `saveToken: failed to save refresh token. Token: ${this._shortenTokenForLog(
          refreshToken,
        )}. Error: ${err?.name} — ${err?.message}`,
        err?.stack,
      );
      throw err;
    }
  }

  async removeToken(refreshToken: string) {
    try {
      return await this.TokenModel.deleteOne({ refreshToken });
    } catch (err) {
      this.logger.error(
        `removeToken: failed to remove refresh token. Token: ${this._shortenTokenForLog(
          refreshToken,
        )}. Error: ${err?.name} — ${err?.message}`,
        err?.stack,
      );
      throw err;
    }
  }

  async findToken(refreshToken: string) {
    try {
      return await this.TokenModel.findOne({ refreshToken });
    } catch (err) {
      this.logger.error(
        `findToken: DB lookup failed for token: ${this._shortenTokenForLog(
          refreshToken,
        )}. Error: ${err?.name} — ${err?.message}`,
        err?.stack,
      );
      throw err;
    }
  }

  private _shortenTokenForLog(token: string | null | undefined): string {
    if (!token) return 'null';
    const t = token.toString();
    if (t.length <= 24) return t;
    return `${t.slice(0, 8)}...${t.slice(-8)}`;
  }
}
