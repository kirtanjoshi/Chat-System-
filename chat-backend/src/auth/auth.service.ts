/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// auth.service.ts
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/auth.typeorm';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/signin.dto';
import { ResetPasswordDto } from './dto/restPassword';
import { ResetPassword } from 'src/typeorm/reset-password.entity';
import { ForgotPasswordDto } from './dto/forgetPassword';
import { MailService } from './dto/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(ResetPassword)
        private readonly resetRepo:  Repository<ResetPassword>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    async register(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, password } = signupDto;
    
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }
    
            const existingUser = await this.userRepo.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = this.userRepo.create({
                email,
                password: hashedPassword,
            });
    
            await this.userRepo.save(newUser);
    
            return {
                message: 'User registered successfully',
            };
        } catch (e) {
            return {
                message: e.message,
            };
        }
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepo.find();
    }
    

    async login(loginDto: LoginDto): Promise<{
        status: number;
        message: string;
        token: string;
        user: {
            id: number;
            email: string;
    
        };
    }> {
        const { email, password } = loginDto;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const token = this.jwtService.sign({ id: user.id, email: user.email });

        return {
            status: 200,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
      
            },
        };
    }



    async forgetPassword(forgetPassword: ForgotPasswordDto): Promise<{ message: string }> {
        const { email } = forgetPassword;
        const user = await this.userRepo.findOne({ where: { email } });
    
        if (!user) {
          throw new Error('User not found');
        }

        console.log(user)
    
        // Generate and store reset token (simple version)
        const resetToken = Math.random().toString(36).substring(2, 15);
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
       
        const resetEntry = this.resetRepo.create({
            userId: user.id,
            resetToken,
            resetTokenExpiry
        })
        await this.resetRepo.save(resetEntry);
         // ✅ Send email
        await this.mailService. sendResetPasswordEmail(user.email, resetToken);
    
        // console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
        return { message: 'Password reset link sent to your email (console for now)' };
      }
    
    
    
    
    async resetPassword(restDto : ResetPasswordDto): Promise<{ message: string }> {
          
        const resetEntry = await this.resetRepo.findOne({ where: { resetToken: restDto.token } });
        console.log("RestEntry", resetEntry)

        if (!resetEntry || resetEntry.resetTokenExpiry < new Date()) {
          throw new BadRequestException('Invalid or expired token');
        }

        const user = await this.userRepo.findOne({ where: { id: resetEntry.userId } });

         

        if (!user) throw new NotFoundException('User not found');
        console.log("User id" , user)

        user.password = await bcrypt.hash(restDto.newPassword, 10);

        await this.userRepo.save(user);
        

        return { message: 'Password reset successful' };
      }
}   

    


