/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class FirebaseAdminController {
  constructor(private readonly firebaseAdminService: FirebaseAdminService,
      private authService: AuthService  ) {

  }

  @Post("google")
  async googleLogin(@Body('idToken') idToken: string) {
    const decoded = await this.firebaseAdminService.verifyIdToken(idToken);
    const { email, name, picture } = decoded;
    
    return this.authService.googleAuthOrCreate(email! , name, picture);
  }
}
