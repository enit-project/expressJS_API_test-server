import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';

import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { StatsModule } from './stats/stats.module';
import { StickersModule } from './stickers/stickers.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [UsersModule, BoardsModule, StatsModule, StickersModule],
})
export class ApiModule { }
