// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { CreateBoardBody, YMD } from './dto/create-board.dto';
import { ShowBoardDto } from './dto/show-board.dto';
import { UpdateBoardBody } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { success_200 } from 'src/constant/status.code';
import { BoardID } from './dto/temporary.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) { }

  async boardCreate(
    createBoardBody: CreateBoardBody,
    ownerFirebaseAuthUID: string,
  ) {
    const authorId = await this.prisma.user
      .findUnique({
        where: { firebaseAuthUID: createBoardBody.authorFirebaseAuthUID },
      })
      .then((res) => {
        return res.id;
      });

    const ownerId = await this.prisma.user
      .findUnique({
        where: { firebaseAuthUID: ownerFirebaseAuthUID },
      })
      .then((res) => {
        return res.id;
      });

    const userObject = {
      ...createBoardBody.createBoardDto,
      ownerId: ownerId,
      authorId: authorId,
    };

    const state = this.prisma.board.create({ data: userObject });
    state.catch((e) => console.log(e));

    console.log('boardCreate');
    console.log(state);
    return success_200;
  }

  async boardAllGet(firebaseAuthUID: string, ymd: YMD) {
    const currentUserId = await this.prisma.user
      .findUnique({
        where: { firebaseAuthUID: firebaseAuthUID },
      })
      .then((user) => {
        return user.id;
      });

    const state = this.prisma.board
      .findMany({
        where: { ownerId: currentUserId, isIgnored: false },
      })
      .then((boardList) => {
        return boardList.map((board) => {
          const boardId = board.id;
          // TODO :
          // do the children sticker injection part
          const children = [
            { fake: 'fake sticker 1' },
            { fake: 'fake sticker 2' },
            { fake: 'fake sticker 3' },
          ];

          const showBoardDto = new ShowBoardDto(board);
          const res = {
            ...showBoardDto,
            children: children,
          };

          return res;
        });
      });

    state.catch((e) => console.log(e));

    console.log('board-all-get');
    console.log(state);
    return state;
  }

  boardDelete(boardId: BoardID) {
    //TODO: do the validation of the owner and author

    const state = this.prisma.board.delete({
      where: { id: boardId.boardID },
    });

    state.catch((e) => console.log(e));

    console.log('withdraw');
    console.log(state);
    return success_200;
  }

  boardUpdate(updateBoardBody: UpdateBoardBody) {
    //TODO: do the validation of the owner and author
    const state = this.prisma.board.update({
      where: { id: updateBoardBody.boardId },
      data: updateBoardBody.updateBoardDto,
    });

    state.catch((e) => console.log(e));

    console.log('myinfo-get');
    console.log(state);
    return state;
  }
}
