/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import ogs = require('open-graph-scraper');

@Controller('metadata')
export class MetadataController {
  @Get()
  async getMetadata(@Query('url') url: string) {
    if (!url) {
      throw new HttpException('URL query parameter is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const options = { url };
      const { error, result } = await ogs(options);

      if (error) {
        throw new HttpException('Failed to fetch metadata', HttpStatus.BAD_REQUEST);
      }

      return {
        title: result.ogTitle || '',
        description: result.ogDescription || '',
        image: result.ogImage?.[0]?.url || '',
        url: result.ogUrl || url,
      };
    } catch (e) {
      throw new HttpException('Error fetching metadata', e);
    }
  }
}
