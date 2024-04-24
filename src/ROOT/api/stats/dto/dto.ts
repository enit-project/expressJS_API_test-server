import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString } from "class-validator";
import { isInt32Array } from "util/types";

export class StatByDayDto {
  @ApiProperty()
  @IsString()
  firebaseUID: string;
  @ApiProperty()
  @IsInt()
  year: number;
  @ApiProperty()
  @IsInt()
  month: number;
  @ApiProperty()
  @IsArray()
  targetBoardIdList: number[];
}

export class StatByWeekDto {
  @ApiProperty()
  @IsString()
  firebaseUID: string;
  @ApiProperty()
  @IsInt()
  year: number;
  @ApiProperty()
  @IsArray()
  targetBoardIdList: number[];
}
