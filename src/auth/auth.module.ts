/* eslint-disable prettier/prettier,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { MailService } from './dto/mail.service';
import {ResetPasswordEntity} from "./entities/resetPassword.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ResetPasswordEntity]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      inject: [ConfigService], // To excess CongigService
      useFactory: async (config: ConfigService) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE') || '3d', // Default to 3 days if not set
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
