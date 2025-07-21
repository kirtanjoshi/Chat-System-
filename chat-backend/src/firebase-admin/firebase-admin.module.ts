import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { FirebaseAdminController } from './firebase-admin.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FirebaseAdminController],
  providers: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
