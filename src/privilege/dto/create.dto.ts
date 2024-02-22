import { REST } from '@prisma/client';

export class CreateUserRelatedDto {
  ownerId: number;
  giverId: number;
}

export class CreateRelatedPrivilegeDto {
  userRelatedId: 0;
  table: '';
  field: '';
  action: REST;
  // status: PrivilegeStatus;
}
