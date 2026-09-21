import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWorkSpaceDto } from './dto/create-workspace.dto.js';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto.js';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  // Creaate
  public async create(dto: CreateWorkSpaceDto, tenantId: string) {
    return await this.prisma.workspace.create({
      data: {
        name: dto.name,
        tenantId,
      },
    });
  }

  // Update
  public async update(
    tenantId: string,
    workspaceId: string,
    dto: UpdateWorkspaceDto,
  ) {
    await this.findOne(tenantId, workspaceId);

    await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: dto,
    });
  }

  // Remove
  public async remove(tenantId: string, workspaceId: string) {
    await this.findOne(tenantId, workspaceId);

    return this.prisma.workspace.delete({ where: { id: workspaceId } });
  }

  // Find one
  public async findOne(tenantId: string, workspaceId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { tenantId, id: workspaceId },
    });

    if (!workspace) throw new NotFoundException('Workspace not found');

    return workspace;
  }

  // FindAll
  public async findAll(tenantId: string) {
    return await this.prisma.workspace.findMany({ where: { tenantId } });
  }
}
