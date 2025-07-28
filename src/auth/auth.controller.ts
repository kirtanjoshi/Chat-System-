/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/signin.dto';

import { ResetPasswordDto } from './dto/resetPassword';
import { ForgotPasswordDto } from './dto/forgetPassword.dto';
import { User } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService)
  { }




  @Post('/register')
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  signUp(@Body() signUpDto : SignupDto) :Promise<{ message: string }> {
    return this.authService.register(signUpDto);

  }

  @Get("/users")
  @ApiResponse({ status: 200, description: 'List of all users.' })
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Post('/login')
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  login(@Body() loginDto: LoginDto): Promise<{ message: string }>{
    return this.authService.login(loginDto)
  }

  @Post('forget-password')
  @ApiResponse({ status: 200, description: 'Password reset link sent.' })
  async forgetPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgetPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

}