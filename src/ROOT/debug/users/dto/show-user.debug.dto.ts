import { Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ShowUserDTO {
  @Expose()
  get statusCode(): number {
    return 200;
  }

  @Expose()
  get debug(): boolean {
    return true;
  }

  name: string;
  email: string;
  role: Role;

  @Exclude()
  id: number;

  @Exclude()
  firebaseAuthUID: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<ShowUserDTO>) {
    Object.assign(this, partial);
  }
}
