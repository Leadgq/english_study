import { PartialType } from '@nestjs/mapped-types';
import { UserRegisterDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(UserRegisterDto) {}
