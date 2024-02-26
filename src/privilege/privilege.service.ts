import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { modelMETA } from './dto/prisma.model.meta';
import { PrivilegeStatus } from '@prisma/client';

import {
  CreateUserRelatedDto,
  CreateRelatedPrivilegeDto,
} from './dto/create.dto';

@Injectable()
export class PrivilegeService {
  private readonly prisma: PrismaService;

  /**
   * ask for the privilege and set it to "PENDING" state
   */
  async requestTo(
    userRelatedDto: CreateUserRelatedDto,
    relatedPrivilegeDto: CreateRelatedPrivilegeDto,
  ): Promise<[boolean, string]> {
    // skip the validation of ownerUserId, giverUserId is valid id.
    // validate if tableName is really exists
    if (!Object.keys(modelMETA).includes(relatedPrivilegeDto.table)) {
      return [false, 'no exists tableName on DB'];
    }

    // validate if request privilege is not already in the DB.
    try {
      await this.prisma.userRelated
        .findMany({
          where: {
            ownerId: userRelatedDto.ownerId,
            giverId: userRelatedDto.giverId,
          },
        })
        .then((recordList) => {
          // validate the, combination of ownerId and giverId must be unique.
          if (recordList.length > 1) {
            return [
              false,
              'combination of ownerId and giverId must be unique.',
            ];
          }
          const id = recordList[0].id;

          // this must be throw exception. if not, this means that same privilege is already exists in the DB.
          this.prisma.relatedPrivilege.findFirstOrThrow({
            where: {
              userRelatedId: id,
              table: relatedPrivilegeDto.table,
              action: relatedPrivilegeDto.action,
            },
          });
        });
      return [false, 'same previlage already exists.'];
    } catch {
      const futureList = [
        this.prisma.userRelated.create({
          data: userRelatedDto,
        }),
        this.prisma.relatedPrivilege.create({
          data: relatedPrivilegeDto,
        }),
      ];

      await Promise.all(futureList);
      return [true, ''];
    }
  }

  /**
   * find all of the request that previlege giver should be check and reject or approve
   * @param giverId giver's id
   * @returns the {userRelated table pkey : relatedPrivilege table pkey} object
   */
  async requestWhere(giverId: number): Promise<[boolean, object]> {
    // find the ownerId onto the DB + validate
    try {
      const userRelatedIdToRelatedPrivilegeIdJSON = {};
      await this.prisma.userRelated
        .findMany({
          where: { giverId: giverId },
        })
        .then((recordList) => {
          for (const userRelatedrecord of recordList) {
            const userRelatedId = userRelatedrecord.id;
            this.prisma.relatedPrivilege
              .findMany({
                where: { id: userRelatedId },
              })
              .then((relatedPrivilegeRecordList) => {
                const relatedPrivilegeIdList = [];
                for (const relatedPrivilegerecord of relatedPrivilegeRecordList) {
                  relatedPrivilegeIdList.push(relatedPrivilegerecord.id);
                }
                userRelatedIdToRelatedPrivilegeIdJSON[giverId] =
                  relatedPrivilegeIdList;
              });
          }
        });
      return [true, userRelatedIdToRelatedPrivilegeIdJSON];
    } catch (err) {
      return [false, err];
    }
  }

  /**
   * reject or approve selected previliege.
   * @param userRelatedId
   * @param relatedPrivilegeId
   */
  private async requestWhat(
    relatedPrivilegeId: number,
    status: PrivilegeStatus,
  ): Promise<[boolean, string]> {
    try {
      await this.prisma.relatedPrivilege
        .findFirstOrThrow({ where: { id: relatedPrivilegeId } })
        .then(() => {
          this.prisma.relatedPrivilege.update({
            where: { id: relatedPrivilegeId },
            data: { status: status },
          });
        });
      return [true, ''];
    } catch {
      return [false, 'no relatedPrivilegeId found.'];
    }
  }

  async requestApprove(relatedPrivilegeId: number) {
    return this.requestWhat(relatedPrivilegeId, PrivilegeStatus.APPROVED);
  }

  async requestIfAuthorOnly(relatedPrivilegeId: number) {
    return this.requestWhat(relatedPrivilegeId, PrivilegeStatus.IFAUTHOR);
  }

  async requestReject(relatedPrivilegeId: number) {
    return this.requestWhat(relatedPrivilegeId, PrivilegeStatus.REJECTED);
  }
  /**
   * check if owner has privilege of the giver on specific table - column.
   * @param ownerId pkey of owner
   * @param giverId pkey of giver
   * @param table table name
   * @param column column name
   * @returns null if no privilege found. PrivilegeStatus if found.
   */
  async requestCheck(
    ownerId: number,
    giverId: number,
    table: string,
  ): Promise<PrivilegeStatus | undefined> {
    try {
      const status = await this.prisma.userRelated
        .findFirstOrThrow({
          where: { ownerId: ownerId, giverId: giverId },
        })
        .then((userRelatedRecord) => {
          return this.prisma.relatedPrivilege
            .findMany({
              where: { userRelatedId: userRelatedRecord.id },
            })
            .then((relatedPrivilegeRecordList) => {
              for (const record of relatedPrivilegeRecordList) {
                if (record.table == table) {
                  return record.status;
                }
              }
            });
        });
      return status;
    } catch (err) {
      return null;
    }
  }

  /**
   * delete the owner's previlege completelly from DB.
   * @param ownerId
   * @param giverId
   * @param table
   * @returns
   */
  async requestRevert(
    ownerId: number,
    giverId: number,
    table: string,
  ): Promise<[boolean, string]> {
    try {
      const status = await this.prisma.userRelated
        .findFirstOrThrow({
          where: { ownerId: ownerId, giverId: giverId },
        })
        .then((userRelatedRecord) => {
          return this.prisma.relatedPrivilege
            .findMany({
              where: { userRelatedId: userRelatedRecord.id },
            })
            .then((relatedPrivilegeRecordList) => {
              for (const record of relatedPrivilegeRecordList) {
                if (record.table == table) {
                  return [userRelatedRecord.id, record.id];
                }
              }
            });
        });
      await this.prisma.userRelated.delete({ where: { id: status[0] } });
      await this.prisma.relatedPrivilege.delete({ where: { id: status[1] } });
      return [true, ''];
    } catch (err) {
      return [false, 'no privilege found.'];
    }
  }
}
