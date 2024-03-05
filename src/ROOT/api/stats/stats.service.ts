// API service section.
// filter the invalid input from user.
// execute the Prisma SQL querry.
// pass the data (or the work state) for the controller section.

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { success_200 } from 'src/constant/status.code';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) { }

  async statByDay(
    firebaseUID: string,
    year: number,
    month: number,
    targetBoardIdList: number[],
  ) {
    // validation of params
    // validate if user exists, then get the user pkey.
    const userId = await this.prisma.user
      .findFirstOrThrow({
        where: { firebaseAuthUID: firebaseUID },
      })
      .then((record) => {
        return record.id;
      });

    // validate if all of the board is owned by user.
    const userOwnedBoardList = await this.prisma.board
      .findMany({
        where: { ownerId: userId },
      })
      .then((recordList) => {
        const toNumberList = [];
        for (const record of recordList) {
          toNumberList.push(record.id);
        }
        return toNumberList;
      });

    for (const targetBoardId of targetBoardIdList) {
      let isMatchingExists = false;
      for (const userBoardId of userOwnedBoardList) {
        if (targetBoardId == userBoardId) {
          isMatchingExists = true;
        }
      }
      if (isMatchingExists == false) {
        throw new NotFoundException();
      }
    }

    // calculate the occourence by day, from given range of month
    const dateStart = new Date(year, month, 1).getDate();
    const dateEnd = new Date(year, month + 1, 0).getDate();

    const occourenceList = [];
    for (let date = dateStart; date <= dateEnd; date++) {
      const occourenceByBoardFuture: Promise<number>[] = [];
      for (const targetBoardId of targetBoardIdList) {
        const futureLength = this.prisma.sticker
          .findMany({
            where: {
              boardId: targetBoardId,
              createdAtMonth: month,
              createdAtYear: year,
              createdAtDate: date,
            },
          })
          .then((recordList) => {
            return recordList.length;
          });
        occourenceByBoardFuture.push(futureLength);
      }

      const byDayStickerSum = await Promise.all(occourenceByBoardFuture).then(
        (resultList) => {
          let sum: number = 0;
          for (const num of resultList) {
            sum += num;
          }
          return sum;
        },
      );

      occourenceList.push(byDayStickerSum);
    }

    return occourenceList;
  }

  async statByWeek(
    firebaseUID: string,
    year: number,
    targetBoardIdList: number[],
  ) {
    // validation of params
    // validate if user exists, then get the user pkey.
    const userId = await this.prisma.user
      .findFirstOrThrow({
        where: { firebaseAuthUID: firebaseUID },
      })
      .then((record) => {
        return record.id;
      });

    // validate if all of the board is owned by user.
    const userOwnedBoardList = await this.prisma.board
      .findMany({
        where: { ownerId: userId },
      })
      .then((recordList) => {
        const toNumberList = [];
        for (const record of recordList) {
          toNumberList.push(record.id);
        }
        return toNumberList;
      });

    for (const targetBoardId of targetBoardIdList) {
      let isMatchingExists = false;
      for (const userBoardId of userOwnedBoardList) {
        if (targetBoardId == userBoardId) {
          isMatchingExists = true;
        }
      }
      if (isMatchingExists == false) {
        throw new NotFoundException();
      }
    }

    // calculate the occourence by week, from given range of year.
    // starting date included week will calculated,
    // but ending date included week will not.
    const dateTimeStart = new Date(year, 1, 1);
    const dateStart = dateTimeStart.getDate();
    const dateStartDay = dateTimeStart.getDay();
    if (dateStartDay != 0) {
      dateTimeStart.setDate(dateStart - dateStartDay);
    }
    const dateTimeEnd = new Date(year + 1, 1, 0);
    dateTimeEnd.setDate(dateTimeEnd.getDate() - dateTimeEnd.getDay());

    const dateTimeCurrent = new Date(dateTimeStart);
    const occourenceList = [];
    const weekByList: number[] = [];
    while (dateTimeCurrent < dateTimeEnd) {
      if (weekByList.length >= 7) {
        let sum = 0;
        for (const num of weekByList) {
          sum += num;
        }
        occourenceList.push(sum);
        weekByList.length = 0;
      }

      const date = dateTimeCurrent.getDate();
      const month = dateTimeCurrent.getMonth();
      const year = dateTimeCurrent.getFullYear();

      const occourenceByBoardFuture: Promise<number>[] = [];
      for (const targetBoardId of targetBoardIdList) {
        const futureLength = this.prisma.sticker
          .findMany({
            where: {
              boardId: targetBoardId,
              createdAtMonth: month,
              createdAtDate: date,
              createdAtYear: year,
            },
          })
          .then((recordList) => {
            return recordList.length;
          });
        occourenceByBoardFuture.push(futureLength);
      }

      const byDayStickerSum = await Promise.all(occourenceByBoardFuture).then(
        (resultList) => {
          let sum: number = 0;
          for (const num of resultList) {
            sum += num;
          }
          return sum;
        },
      );
      weekByList.push(byDayStickerSum);
    }
    return occourenceList;
  }
}
