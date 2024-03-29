import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoradDto extends PartialType(CreateBoardDto) { } // PartialType will makes all field optional.
