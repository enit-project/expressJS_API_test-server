import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.debug.dto';

export class UpdateUserDto extends PickType(CreateUserDto, ['name'] as const) { } // PartialType will makes all field optional.
