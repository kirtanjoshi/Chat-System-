/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { LinkPreviewService } from './link-preview.service';

@Controller('link-preview')
export class LinkPreviewController {
    constructor (private readonly linkPreviewService: LinkPreviewService) {}

    @Get()

    async getPreview(@Query("url") url:string) {
        return this.linkPreviewService.generatePreview(url)
    }
}
