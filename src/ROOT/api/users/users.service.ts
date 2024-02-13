// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { success_200 } from 'src/constant/status.code';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  join(createUserDto: CreateUserDto, firebaseAuthUID: string) {
    const userObject = {
      ...createUserDto,
      firebaseAuthUID: firebaseAuthUID,
    };

    const state = this.prisma.user.create({ data: userObject });
    state.catch((e) => console.log(e));

    console.log('join');
    console.log(state);
    return success_200;
  }

  withdraw(firebaseAuthUID: string) {
    const state = this.prisma.user.delete({
      where: { firebaseAuthUID: firebaseAuthUID },
    });

    state.catch((e) => console.log(e));

    console.log('withdraw');
    console.log(state);
    return success_200;
  }

  myInfoGet(firebaseAuthUID: string) {
    const state = this.prisma.user.findUnique({
      where: { firebaseAuthUID: firebaseAuthUID },
    });

    state.catch((e) => console.log(e));

    console.log('myinfo-get');
    console.log(state);
    return state;
  }

  myInfoPatch(updateUserDto: UpdateUserDto, firebaseAuthUID: string) {
    const state = this.prisma.user.update({
      where: { firebaseAuthUID: firebaseAuthUID },
      data: updateUserDto,
    });

    state.catch((e) => console.log(e));

    console.log('myinfo-get');
    console.log(state);
    return state;
  }
}
