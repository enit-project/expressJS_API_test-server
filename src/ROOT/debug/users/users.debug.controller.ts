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
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersDebugService } from './users.debug.service';
import { CreateUserDto } from './dto/create-user.debug.dto';
import { UpdateUserDto } from './dto/update-user.debug.dto';
import { ShowUserDTO } from './dto/show-user.debug.dto';

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    const state = this.usersDebugService.findOneByUID(uid);
    return state.then((res) => new ShowUserDTO(res));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    const state = this.usersDebugService.updateByUID(uid, updateUserDto);
    return state.then((res) => new ShowUserDTO(res));
  }

  @Delete(':uid')
  deleteByUID(@Param('uid') uid: string) {
    console.log(uid);
    return this.usersDebugService.deleteByUID(uid);
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
