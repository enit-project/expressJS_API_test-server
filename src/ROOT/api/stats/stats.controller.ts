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
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  private readonly logger = new Logger('StatsController');
  constructor(private readonly StatsService: StatsService) { }

  @Post('join')
  join(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    return this.StatsService.join(createUserDto, request['user'].uid);
  }

  @Delete('withdraw')
  withdraw(@Req() request: Request) {
    return this.StatsService.withdraw(request['user'].uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('myinfo-get')
  myInfoGet(@Req() request: Request) {
    const state = this.StatsService.myInfoGet(request['user'].uid);
    return state.then((res) => new ShowUserDTO(res));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('myinfo-patch')
  myInfoPatch(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const state = this.StatsService.myInfoPatch(
      updateUserDto,
      request['user'].uid,
    );
    return state.then((res) => new ShowUserDTO(res));
  }
}
