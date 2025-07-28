/* eslint-disable prettier/prettier,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return */


import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import  serviceAccount from './config/firebase-service-account.json';

@Injectable()
export class FirebaseAdminService {
  private firebaseApp: admin.app.App;

  constructor() {
    // ✅ Only initialize if not already done
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
    } else {
      this.firebaseApp = admin.app(); // reuse existing app
    }
  }

  async verifyIdToken(idToken: string) {
    return await this.firebaseApp.auth().verifyIdToken(idToken);
  }
}
