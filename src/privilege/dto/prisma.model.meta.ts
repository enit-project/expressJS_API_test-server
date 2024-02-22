import { User, UserRelated, RelatedPrivilege } from '@prisma/client';
import { Role, REST, PrivilegeStatus } from '@prisma/client';

/**
 * meta object of the prisma models.
 * all of the models must be once occour in this object.
 */
export const modelMETA: {
  User: User;
  UserRelated: UserRelated;
  RelatedPrivilege: RelatedPrivilege;
} = {
  User: {
    id: 0,
    name: '',
    email: '',
    role: Role.PARENT,
    firebaseAuthUID: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  UserRelated: {
    id: 0,
    ownerId: 0,
    giverId: 0,
  },
  RelatedPrivilege: {
    id: 0,
    userRelatedId: 0,
    table: '',
    field: '',
    action: REST.CREATE,
    status: PrivilegeStatus.APPROVED,
  },
};
