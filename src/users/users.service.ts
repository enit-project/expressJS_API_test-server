// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const state = this.prisma.user.create({ data: createUserDto });
    state.catch((e) => console.log(e));

    // this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    const state = this.prisma.user.findMany();
    state.catch((e) => console.log(e));
    return state;

    // return this.prisma.user.findMany();
  }

  findOne(id: number) {
    const state = this.prisma.user.findUnique({ where: { id } });
    state.catch((e) => console.log(e));
    return state;

    // return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const state = this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    state.catch((e) => console.log(e));
    return state;

    // return this.prisma.user.update({
    //   where: { id },
    //   data: updateUserDto,
    // });
  }

  remove(id: number) {
    const state = this.prisma.user.delete({ where: { id } });
    state.catch((e) => console.log(e));
    return state;

    // return this.prisma.user.delete({ where: { id } });
  }
}

// @Injectable()
// export class SecureTestService {

// }