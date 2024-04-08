import { PartialType } from '@nestjs/mapped-types';
import { CreateStickerDto } from './create-sticker.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBoradDto extends PartialType(CreateStickerDto) { } // PartialType will makes all field optional.

export class UpdateStickerBody {
  updateStickerDto: UpdateBoradDto;
  StickerId: number;
}
