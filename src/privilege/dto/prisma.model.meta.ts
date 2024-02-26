import { User, UserRelated, RelatedPrivilege } from '@prisma/client';
import { Role, REST, PrivilegeStatus } from '@prisma/client';


/**
 * meta object of the prisma models.
 * all of the models must be once occour in this object.
 */
export const modelMETA: {
  user: User;
  userRelated: UserRelated;
  relatedPrivilege: RelatedPrivilege;
} = {
  user: {
    id: 0,
    name: '',
    email: '',
    role: Role.PARENT,
    firebaseAuthUID: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  userRelated: {
    id: 0,
    ownerId: 0,
    giverId: 0,
  },
  relatedPrivilege: {
    id: 0,
    userRelatedId: 0,
    table: '',
    action: REST.CREATE,
    status: PrivilegeStatus.APPROVED,
  },
};

