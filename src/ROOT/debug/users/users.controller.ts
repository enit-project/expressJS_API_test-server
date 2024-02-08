// API controller section.
// apply the security rule for the user level.
// call the functionality logics (which are for the calculation of datas)
// pass the response object with the Http state

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersDebugService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('debug/users')
export class UsersDebugController {
  private readonly logger = new Logger('debug/users');
  constructor(private readonly usersDebugService: UsersDebugService) { }
  @Post('create_noAuth')
  createNoAuth(@Body() createUserDto: CreateUserDto) {
    this.logger.error('this.logger.error testment');
    return this.usersDebugService.create(createUserDto);
  }
  @Get()
  findAll() {
    return this.usersDebugService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersDebugService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersDebugService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersDebugService.remove(+id);
  }
}

// @Controller('unsecure')
// export class UnsecureTestController {
//   @Get('helloWorld')
//   getTest() {
//     return 'hello, world!';
//   }
// }

// @Controller('secure')
// export class SecureTestController {
//   @Get('helloWorld')
//   getSecureTest() {
//     return 'hello, world!';
//   }
// }
