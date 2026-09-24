import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { InviteUserDto } from './dto/invite-user.dto.js';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async invite(tenantId: string, dto: InviteUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) throw new ConflictException('Email already in use');

    const rawPassword = dto.password ?? crypto.randomBytes(8).toString('hex');

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role,
        tenantId,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tempPassword: dto.password ? undefined : rawPassword,
    };
  }

  findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async updateRole(
    tenantId: string,
    actingUserId: string,
    targetUserId: string,
    dto: UpdateUserRoleDto,
  ) {
    if (actingUserId === targetUserId)
      throw new ForbiddenException("you can't change your own role");

    const targetUser = await this.prisma.user.findUnique({
      where: { tenantId, id: targetUserId },
    });

    if (!targetUser) throw new NotFoundException('User not found');

    if (targetUser.role === 'OWNER')
      throw new ForbiddenException("You can't change the owner role");

    return await this.prisma.user.update({
      where: { tenantId, id: targetUserId },
      data: { role: dto.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }

  async remove(tenantId: string, actingUserId: string, targetUserId: string) {
    if (actingUserId === targetUserId)
      throw new ForbiddenException("You can't remove yourself");

    const targetUser = await this.prisma.user.findUnique({
      where: { tenantId, id: targetUserId },
    });

    if (!targetUser) throw new NotFoundException('User not found');

    if (targetUser.role === 'OWNER')
      throw new ForbiddenException("you can't remove the owner");

    return await this.prisma.user.delete({
      where: { id: targetUserId, tenantId },
    });
  }
}
