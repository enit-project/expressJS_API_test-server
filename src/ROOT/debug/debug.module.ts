import { Module } from '@nestjs/common';
import { ApiService } from './debug.service';
import { ApiController } from './debug.controller';

import { UsersDebugModule } from './users/users.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [UsersDebugModule],
})
export class DebugModule { }
