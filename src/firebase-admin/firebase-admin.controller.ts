/* eslint-disable @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('firebase-auth')
export class FirebaseAdminController {
  constructor(private readonly firebaseAdminService: FirebaseAdminService,
              private authService: AuthService  ) {

  }

  @Post("/googles")
  async googleLogin(@Body('idToken') idToken: string) {
    const decoded = await this.firebaseAdminService.verifyIdToken(idToken);
    const { email, name, picture } = decoded;

    return this.authService.googleAuthOrCreate(email! , name, picture);
  }
}
