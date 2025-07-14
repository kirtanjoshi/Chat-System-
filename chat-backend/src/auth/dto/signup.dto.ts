/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsString } from "class-validator";
import { Role } from "../emun/custom.enum";


export class SignupDto {
    
    @IsEmail()
       @IsNotEmpty()
    readonly email: string;
    
    @IsString()
        @IsNotEmpty()
  readonly password: string;
  @IsArray()
  @IsIn(Object.values(Role), { each: true })
  role: Role[];

}