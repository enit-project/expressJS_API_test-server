import { DAY, Role } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ShowBoardDto {
  @Expose()
  get statusCode(): number {
    return 200;
  }

  title: string;
  description: string;
  cycle: DAY[];
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  id: number;

  @Exclude()
  ownerId: number;

  @Exclude()
  authorId: number;

  @Exclude()
  isIgnored: boolean;

  constructor(partial: Partial<ShowBoardDto>) {
    Object.assign(this, partial);
  }
}
