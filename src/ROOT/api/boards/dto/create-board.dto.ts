/* eslint-disable @typescript-eslint/ban-types */
import { DAY } from '@prisma/client';
import { IsArray, IsDate, IsEmail, IsEnum, isInt } from 'class-validator';
import { registerDecorator } from 'class-validator';

// to make more custom dto validator decorators :
// https://github.com/typestack/class-validator#custom-validation-classes
export function IsKorEngSpace() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsKorEngSpace',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            /^[a-z0-9A-Zㄱ-ㅎㅏ-ㅣ가-힣 ]+$/.test(value)
          );
        },
      },
    });
  };
}

export class CreateBoardDto {
  @IsKorEngSpace()
  title: string;

  @IsKorEngSpace()
  description: string;

  @IsArray()
  cycle: DAY[];

  @IsDate()
  start_time: Date;

  @IsDate()
  end_time: Date;

}
