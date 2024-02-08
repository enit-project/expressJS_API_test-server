import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  getDescription(): string {
    return 'production api section';
  }
}
