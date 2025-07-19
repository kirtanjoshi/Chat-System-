/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/signin.dto';
import { ResetPassword } from 'src/auth/entity/reset-password.entity';
import { ResetPasswordDto } from './dto/restPassword';
import { ForgotPasswordDto } from './dto/forgetPassword';
import { User } from 'src/auth/entity/auth.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService)
    { }


    @Post('/register')
    signUp(@Body() signUpDto : SignupDto) :Promise<{ message: string }> {
        return this.authService.register(signUpDto);
        
  }
  
  @Get("/users")
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ message: string }>{
        return this.authService.login(loginDto)
    }
    
    @Post('forget-password')
    async forgetPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
      return this.authService.forgetPassword(forgotPasswordDto);
    }
  
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.resetPassword(resetPasswordDto);
    }

} 