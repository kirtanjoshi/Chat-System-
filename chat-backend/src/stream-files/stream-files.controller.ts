/* eslint-disable prettier/prettier */
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('stream-files')
export class StreamFilesController {
  @Get('download')
  downloadFile(@Res() res: Response) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'assets',
      'review of kirtan by chirag.mkv',
    );

    // ✅ Check file existence
    if (!fs.existsSync(filePath)) {
        res.status(404).send('File not found');
        console.log('File path:', filePath);

      return;
    }

    // ✅ Set appropriate headers
    res.setHeader('Content-Type', 'video/x-matroska');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="review of kirtan by chirag.mkv"',
    );

    // ✅ Create a readable stream and pipe it to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // ✅ Handle errors in stream
    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).send('Failed to stream file');
    });
  }
}
