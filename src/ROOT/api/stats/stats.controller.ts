// API controller section.
// apply the security rule for the user level.
// call the functionality logics (which are for the calculation of datas)
// pass the response object with the Http state

import { Controller, Post, Req, Logger, Body } from '@nestjs/common';
import { Request } from 'express';
import { StatsService } from './stats.service';

import { StatByWeekDto, StatByDayDto } from './dto/dto';

@Controller('api/stats')
export class StatsController {
  private readonly logger = new Logger('StatsController');
  constructor(private readonly statsService: StatsService) { }

  @Post('stat-by-week')
  statByWeek(@Body() statByWeekDto: StatByWeekDto, @Req() request: Request) {
    const state = this.statsService.statByWeek(
      statByWeekDto.firebaseUID,
      statByWeekDto.year,
      statByWeekDto.targetBoardIdList,
    );
    return state;
  }

  @Post('stat-by-day')
  statByDay(@Body() statByDayDto: StatByDayDto, @Req() request: Request) {
    const state = this.statsService.statByDay(
      statByDayDto.firebaseUID,
      statByDayDto.year,
      statByDayDto.month,
      statByDayDto.targetBoardIdList,
    );
    return state;
  }
}
