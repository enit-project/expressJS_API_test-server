import { Module } from '@nestjs/common';
import { UsersDebugService } from './users.service';
import { UsersDebugController } from './users.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsersDebugController],
  providers: [UsersDebugService],
  imports: [PrismaModule],
})
export class UsersDebugModule { }
