// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable } from '@nestjs/common';
import { CreateBoardBody, YMD } from './dto/create-board.dto';
import { ShowBoardDto } from './dto/show-board.dto';
import { UpdateBoardBody } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { reject_with_msg, success_200 } from 'src/constant/status.code';
import { BoardID } from './dto/temporary.dto';
import { DAY } from '@prisma/client';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) { }

  async boardCreate(
    createBoardBody: CreateBoardBody,
    authorFirebaseAuthUID: string,
  ) {
    const author = await this.prisma.user.findUnique({
      where: { firebaseAuthUID: authorFirebaseAuthUID },
    });
    if (author == null) {
      return reject_with_msg('inappropriate author : no author user found');
    }
    const authorId = author.id;

    const owner = await this.prisma.user.findUnique({
      where: { firebaseAuthUID: createBoardBody.ownerFirebaseAuthUID },
    });
    if (owner == null) {
      return reject_with_msg('inappropriate owner : no owner user found');
    }
    const ownerId = owner.id;

    const boardObject = {
      ...createBoardBody.createBoardDto,
      ownerId: ownerId,
      authorId: authorId,
    };

    const state = this.prisma.board.create({ data: boardObject });
    state.catch((e) => console.log(e));

    console.log('boardCreate');
    console.log(state);
    return success_200;
  }

  async boardAllGet(firebaseAuthUID: string, ymd: YMD) {
    const dateTime = new Date(
      ymd.currentYear,
      ymd.currentMonth - 1,
      ymd.currentDate,
    );

    const day =
      DAY[['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dateTime.getDay()]];

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
        const adjustedBoardList = boardList
          .filter((board) => {
            if (board.cycle.includes(day)) {
              return true;
            } else {
              return false;
            }
          })
          .map((board) => {
            const boardId = board.id;
            // TODO :
            // do the children sticker injection part
            const children = this.prisma.sticker.findMany({
              where: { boardId: boardId },
            });

            const showBoardDto = new ShowBoardDto(board);

            return children.then((childrenPart) => {
              const res = {
                ...showBoardDto,
                children: childrenPart,
              };
              console.log(res);
              return res;
            });
          });

        return Promise.all(adjustedBoardList);
      });

    state.catch((e) => console.log(e));

    console.log('board-all-get');
    console.log(state);
    return state;
  }

  boardDelete(boardId: BoardID) {
    //TODO: do the validation of the owner and author

    const state = this.prisma.board.update({
      where: { id: boardId.boardID },
      data: { isIgnored: true },
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
