/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */


/* eslint-disable prettier/prettier */
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {configureCloudinary} from './cloudinary.config';
const cloudinary = configureCloudinary();

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // pass actual instance here
  params: async (req, file) => {
    return {
      folder: 'chat_images', // ✅ this is now valid
      // format: 'auto',
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});
