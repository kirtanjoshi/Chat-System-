/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginDto {
    
    @IsEmail()
       @IsNotEmpty()
    readonly email: string;
    
    @IsString()
        @IsNotEmpty()
  readonly password: string;

}