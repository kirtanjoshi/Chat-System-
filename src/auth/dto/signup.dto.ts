
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { Role } from "../enum/custom.enum";

export class SignupDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email for registration' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: [Role.USER], description: 'User roles', isArray: true, enum: Role })
  @IsArray()
  @IsIn(Object.values(Role), { each: true })
  role: Role[];
}