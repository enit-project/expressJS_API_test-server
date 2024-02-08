import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Get()
  getDescription(): string {
    return this.apiService.getDescription();
  }
}
