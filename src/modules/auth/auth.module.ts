import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { config } from 'src/core/config/config';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: config.JWT_KEY,
      signOptions: { expiresIn: config.TOKEN_EXPIRATION },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
