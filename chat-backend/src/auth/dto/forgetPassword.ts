/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email for password reset' })
  email: string;
}
  