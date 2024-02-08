// API controller section.
// apply the security rule for the user level.
// call the functionality logics (which are for the calculation of datas)
// pass the response object with the Http state

import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/users')
export class UsersController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) { }

  @Post('join')
  join(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    return this.usersService.join(createUserDto, request['user'].uid);
  }
}
