/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { getLinkPreview } from 'link-preview-js';

@Injectable()
export class LinkPreviewService {
  async generatePreview(url: string): Promise<any> {
    try {
      const data = await getLinkPreview(url);
      return data;
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to generate link preview');
    }
  }
}