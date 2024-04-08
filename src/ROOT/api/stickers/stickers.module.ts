import { Module } from '@nestjs/common';
import { StickersService } from './stickers.service';
import { StickersController } from './stickers.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StickersController],
  providers: [StickersService],
  imports: [PrismaModule],
})
export class StickersModule { }
