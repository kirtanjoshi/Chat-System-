/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-123', description: 'Password reset token' })
  token: string;

  @ApiProperty({ example: 'newPassword123', description: 'New password to set' })
  newPassword: string;
}
