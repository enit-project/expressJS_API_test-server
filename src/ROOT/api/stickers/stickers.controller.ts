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
import { StickersService } from './stickers.service';
import { CreateStickerBody } from './dto/create-sticker.dto';
import { UpdateStickerBody } from './dto/update-sticker.dto';
import { StickerID } from './dto/temporary.dto';

@Controller('api/stickers')
export class StickersController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly stickersService: StickersService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sticker-create')
  stickerCreate(
    @Body() createstickerBody: CreateStickerBody,
    @Req() request: Request,
  ) {
    return this.stickersService.stickerCreate(createstickerBody);
  }

  @Post('sticker-toggle')
  stickerToggle(@Body() stickerId: StickerID, @Req() request: Request) {
    return this.stickersService.stickerToggle(stickerId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('sticker-patch')
  stickerUpdate(
    @Req() request: Request,
    @Body() updatestickerBody: UpdateStickerBody,
  ) {
    const state = this.stickersService.stickerUpdate(updatestickerBody);
    return state.then((res) => res);
  }
}
