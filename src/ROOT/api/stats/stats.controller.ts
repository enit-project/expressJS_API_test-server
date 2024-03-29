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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('myinfo-get')
  myInfoGet(
    year: number,
    month: number,
    targetBoardIdList: number[],
    @Req() request: Request,
  ) {
    const state = this.StatsService.statByDay(
      request['user'].uid,
      year,
      month,
      targetBoardIdList,
    );
    return state;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('myinfo-patch')
  myInfoPatch(
    year: number,
    targetBoardIdList: number[],
    @Req() request: Request,
  ) {
    const state = this.StatsService.statByWeek(
      request['user'].uid,
      year,
      targetBoardIdList,
    );
    return state;
  }
}
