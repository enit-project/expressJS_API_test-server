import { Module } from '@nestjs/common';
import { BoardsService } from './stickers.service';
import { BoardsController } from './stickers.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [PrismaModule],
})
export class BoardsModule { }
