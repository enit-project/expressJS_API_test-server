// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.debug.dto';
import { UpdateUserDto } from './dto/update-user.debug.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersDebugService {
  constructor(private prisma: PrismaService) { }
  create(createUserDto: CreateUserDto) {
    const userObject = {
      ...createUserDto,
      firebaseAuthUID: 'firebaseAuthUID_example_hahaha',
    };

    const state = this.prisma.user.create({ data: userObject });
    state.catch((e) => console.log(e));
    return state;
  }

  findAll() {
    const state = this.prisma.user.findMany();
    state.catch((e) => console.log(e));
    return state;
  }

  findOneByUID(firebaseAuthUID: string) {
    const state = this.prisma.user.findUnique({
      where: { firebaseAuthUID: firebaseAuthUID },
    });
    state.catch((e) => console.log(e));
    return state;
  }

  updateByUID(firebaseAuthUID: string, updateUserDto: UpdateUserDto) {
    const state = this.prisma.user.update({
      where: { firebaseAuthUID: firebaseAuthUID },
      data: updateUserDto,
    });
    state.catch((e) => console.log(e));
    return state;
  }

  deleteByUID(firebaseAuthUID: string) {
    const state = this.prisma.user.delete({
      where: { firebaseAuthUID: firebaseAuthUID },
    });
    state.catch((e) => console.log(e));
    return state;
  }
}

// @Injectable()
// export class SecureTestService {

// }
