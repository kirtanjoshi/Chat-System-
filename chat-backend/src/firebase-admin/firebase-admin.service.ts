/* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import * as admin from 'firebase-admin';
// import serviceAccount from './config/firebase-service-account.json'; // use require for JSON

// @Injectable()
// export class FirebaseAdminService {
//   private firebaseApp: admin.app.App;

//   constructor() {
//     this.firebaseApp = admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//     });
//   }

//   async verifyIdToken(idToken: string) {
//     return await admin.auth().verifyIdToken(idToken);
//   }
// }


import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import  serviceAccount from './config/firebase-service-account.json'; // adjust path as needed

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
