import { IsIn } from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class UpdateUserRoleDto {
  @IsIn([Role.ADMIN, Role.MEMBER])
  role: 'ADMIN' | 'MEMBER';
}
