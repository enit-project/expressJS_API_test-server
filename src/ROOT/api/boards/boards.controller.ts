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
import { CreateBoardBody } from './dto/create-board.dto';
import { UpdateBoardBody } from './dto/update-board.dto';
import { YMD } from './dto/create-board.dto';
import { BoardID, YMD_uid } from './dto/temporary.dto';

@Controller('api/users')
export class BoardsController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly boardsService: BoardsService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('board-create')
  boardCreate(
    @Body() createBoardBody: CreateBoardBody,
    @Req() request: Request,
  ) {
    return this.boardsService.boardCreate(createBoardBody, request['user'].uid);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('board-all-get')
  boardAllGet(@Body() ymd_uid: YMD_uid, @Req() request: Request) {
    const state = this.boardsService.boardAllGet(
      ymd_uid.ownerFirebaseAuthUID,
      ymd_uid.ymd,
    );
    return state;
  }

  @Delete('board-delete')
  boardDelete(@Body() boardId: BoardID, @Req() request: Request) {
    return this.boardsService.boardDelete(boardId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('board-patch')
  boardUpdate(
    @Req() request: Request,
    @Body() updateBoardBody: UpdateBoardBody,
  ) {
    const state = this.boardsService.boardUpdate(updateBoardBody);
    return state.then((res) => new ShowBoardDto(res));
  }
}
