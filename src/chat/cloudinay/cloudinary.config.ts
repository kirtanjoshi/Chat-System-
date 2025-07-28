/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import {v2 as cloudinary} from 'cloudinary';


export function configureCloudinary() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  cloudinary.config({
    cloud_name: 'dxbgtcbwp',
    api_key: '572663955529638',
    api_secret: 'BMHEyvxYyOi8mwq9GqYY4s-Be0o',
  });
  console.log("Cloudinary",process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.CLOUDINARY_API_KEY);
  console.log(process.env.CLOUDINARY_API_SECRET);
  console.log(process.env.JWT_SECRET);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return cloudinary;
}




