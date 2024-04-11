// API controller section.
// apply the security rule for the user level.
// call the functionality logics (which are for the calculation of datas)
// pass the response object with the Http state

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Req,
  Logger,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ShowUserDTO } from './dto/show-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('authorization')
@Controller('api/users')
export class UsersController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) { }

  @Post('join')
  join(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    return this.usersService.join(createUserDto, request['user'].uid);
  }

  @Delete('withdraw')
  withdraw(@Req() request: Request) {
    return this.usersService.withdraw(request['user'].uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('myinfo-get')
  myInfoGet(@Req() request: Request) {
    const state = this.usersService.myInfoGet(request['user'].uid);
    return state.then((res) => new ShowUserDTO(res));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('myinfo-patch')
  myInfoPatch(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const state = this.usersService.myInfoPatch(
      updateUserDto,
      request['user'].uid,
    );
    return state.then((res) => new ShowUserDTO(res));
  }
}
