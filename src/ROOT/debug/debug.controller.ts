import { Controller, Get } from '@nestjs/common';
import { ApiService } from './debug.service';

@Controller('debug')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Get()
  getDescription(): string {
    return this.apiService.getDescription();
  }
}
