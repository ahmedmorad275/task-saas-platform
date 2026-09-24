import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsIn([Role.ADMIN, Role.MEMBER])
  role: 'ADMIN' | 'MEMBER';

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  password?: string;
}
