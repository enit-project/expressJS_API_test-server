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
import { BoardsService } from './boards.service';
import { ShowBoardDto } from './dto/show-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoradDto } from './dto/update-board.dto';

@Controller('api/users')
export class BoardsController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly boardsService: BoardsService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('board-create')
  boardCreate(
    @Body() createBoardDto: CreateBoardDto,
    authorFirebaseAuthUID: string,
    @Req() request: Request,
  ) {
    return this.boardsService.boardCreate(
      createBoardDto,
      authorFirebaseAuthUID,
      request['user'].uid,
    );
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('board-all-get')
  boardAllGet(
    currentYear: number,
    currentMonth: number,
    currentDate: number,
    @Req() request: Request,
  ) {
    const state = this.boardsService.boardAllGet(
      request['user'].uid,
      currentYear,
      currentMonth,
      currentDate,
    );
    return state;
  }

  @Delete('board-delete')
  boardDelete(boardId: number, @Req() request: Request) {
    return this.boardsService.boardDelete(boardId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('board-patch')
  boardUpdate(
    boardId: number,
    @Req() request: Request,
    @Body() updateBoardDto: UpdateBoradDto,
  ) {
    const state = this.boardsService.boardUpdate(boardId, updateBoardDto);
    return state.then((res) => new ShowBoardDto(res));
  }
}
