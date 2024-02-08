// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  join(createUserDto: CreateUserDto, firebaseAuthUID: string) {
    const userObject = {
      ...createUserDto,
      firebaseAuthUID: firebaseAuthUID,
    };

    const state = this.prisma.user.create({ data: userObject });
    state.then(() => console.log(userObject)).catch((e) => console.log(e));
  }
}
