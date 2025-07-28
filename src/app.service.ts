import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('Database connection already established.');
    } else {
      try {
        await this.dataSource.initialize();
        console.log('Database connected successfully!');
      } catch (error) {
        console.error('Database connection failed!', error);
      }
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
