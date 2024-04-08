// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStickerBody } from './dto/create-sticker.dto';
import { success_200 } from 'src/constant/status.code';
import { UpdateStickerBody } from './dto/update-sticker.dto';
import { StickerID } from './dto/temporary.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StickersService {
  constructor(private prisma: PrismaService) { }

  async stickerCreate(
    createStickerBody: CreateStickerBody,
    // authorFirebaseAuthUID: string,
  ) {
    // const authorId = await this.prisma.user
    //   .findUnique({
    //     where: { firebaseAuthUID: authorFirebaseAuthUID },
    //   })
    //   .then((res) => {
    //     return res.id;
    //   });

    const boardId = await this.prisma.board
      .findUnique({
        where: { id: createStickerBody.boardID },
      })
      .then((res) => {
        return res.id;
      });

    const userObject = {
      ...createStickerBody.createStickerDto,
      boardId: boardId,
      // authorId: authorId,
    };

    const state = this.prisma.sticker.create({ data: userObject });
    state.catch((e) => console.log(e));

    console.log('StickerCreate');
    console.log(state);
    return success_200;
  }

  stickerUpdate(updateStickerBody: UpdateStickerBody) {
    //TODO: do the validation of the owner and author
    const state = this.prisma.sticker.update({
      where: { id: updateStickerBody.StickerId },
      data: updateStickerBody.updateStickerDto,
    });

    state.catch((e) => console.log(e));

    console.log(state);
    return state;
  }
  async stickerToggle(stickerId: StickerID) {
    //TODO: do the validation of the owner and author
    const current_finished = await this.prisma.sticker
      .findFirst({
        where: { id: stickerId.stickerID },
      })
      .then((obj) => obj.isFinished);

    if (current_finished == true) {
      const state = this.prisma.sticker.update({
        where: { id: stickerId.stickerID },
        data: { isFinished: false },
      });
      state.catch((e) => console.log(e));
      console.log(state);
    } else {
      const state = this.prisma.sticker.update({
        where: { id: stickerId.stickerID },
        data: { isFinished: true },
      });
      state.catch((e) => console.log(e));
      console.log(state);
    }

    return success_200;
  }
}
