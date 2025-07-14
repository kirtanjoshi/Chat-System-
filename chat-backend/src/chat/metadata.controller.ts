/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prettier/prettier */
import { Controller, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import ogs = require('open-graph-scraper');

import { Response } from 'express';

@Controller('metadata')
export class MetadataController {
  @Get()
  async getMetadata(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      throw new HttpException('URL query parameter is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const options = { url };
      const { error, result } = await ogs(options);

      if (error) {
        throw new HttpException('Failed to fetch metadata', HttpStatus.BAD_REQUEST);
      }

    
     const metadata = {
  title: result.ogTitle || '',
  description: result.ogDescription || '',
  image: result.ogImage?.[0]?.url || '',
  url: result.ogUrl || url,
};


      res.json(metadata);
    } catch (e) {
      throw new HttpException('Error fetching metadata', e);
    }
  }
}
