import { Injectable } from '@nestjs/common';
import { REST } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { modelMETA } from './prisma.model.meta';
import { table } from 'console';

@Injectable()
export class PrivilegeService {
  private readonly prisma: PrismaService;

  // region of privilege request

  /**
   * ask for the privilege and set it to "PENDING" state
   * @param ownerUserId : who would access the privilege
   * @param giverUserId : who would give the privilege
   * @param tableName : giver's information table name
   * @param fieldName : giver's information table field(column)
   * @param action : CRUD action kinds
   */
  requestTo(
    ownerUserId: number,
    giverUserId: number,
    tableName: string,
    fieldName: string,
    action: REST,
  ): [boolean, string] {
    // skip the validation of ownerUserId, giverUserId is valid id.
    // validate if tableName and fieldName is really exists
    if (!Object.keys(modelMETA).includes(tableName)) {
      return [false, 'no exists tableName on DB'];
    }
    if (!Object.keys(modelMETA[tableName]).includes(fieldName)) {
      return [false, 'no exists fieldName on DB'];
    }

    // validate if request privilege is not already in the DB.
    try {
      this.prisma.userRelated
        .findMany({ where: { ownerId: ownerUserId } })
        .then((recordList) => {
          for (const record of recordList) {
            const id = record.id;
            return this.prisma.relatedPrivilege.findFirstOrThrow({
              where: { table: tableName, field: fieldName, action: action },
            });
          }
        });
    } catch {
      return [false, 'previlage already ']
    }
  }

  // end of region
}
