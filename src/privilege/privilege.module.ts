import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrivilegeService } from './privilege.service';

@Module({
  providers: [PrismaService],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
