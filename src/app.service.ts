import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome! this is nest.js + RESTful api test server!';
  }
}
