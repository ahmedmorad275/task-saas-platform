import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UsersService } from './users.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator.js';
import { InviteUserDto } from './dto/invite-user.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('invite')
  @Roles(Role.OWNER, Role.ADMIN)
  invite(@CurrentUser() user: CurrentUserPayload, @Body() dto: InviteUserDto) {
    return this.usersService.invite(user.tenantId, dto);
  }

  @Patch(':id/role')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(
      user.tenantId,
      user.userId,
      targetUserId,
      dto,
    );
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findAll(user.tenantId);
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') targetUserId: string,
  ) {
    return this.usersService.remove(user.tenantId, user.userId, targetUserId);
  }
}
