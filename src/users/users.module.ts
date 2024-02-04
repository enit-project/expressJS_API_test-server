import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SecureTestController, UsersController } from './users.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsersController, SecureTestController],
  providers: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
