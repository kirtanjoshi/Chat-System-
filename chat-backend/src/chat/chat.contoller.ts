/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { storage } from "./cloudinay/cloudinary.storage";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('chat')
export class ChatController {
    

    @Post("upload-image")

    @UseInterceptors(FileInterceptor('image', {storage}))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                return { error: 'No file uploaded' };
              }
              return {
                url: file.path,
              };
        }
        catch(e) {
            console.log(e)
        }
    }
}