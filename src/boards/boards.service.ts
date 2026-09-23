import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create
  public async create(tenantId: string, dto: CreateBoardDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: dto.workspaceId, tenantId },
    });

    if (!workspace) throw new NotFoundException('Workspace not found');

    return await this.prisma.board.create({
      data: {
        name: dto.name,
        workspaceId: dto.workspaceId,
      },
    });
  }

  // Update
  public async update(tenantId: string, id: string, dto: UpdateBoardDto) {
    await this.getOne(tenantId, id);

    return await this.prisma.board.update({
      where: { id },
      data: dto,
    });
  }

  // Delete
  public async remove(tenantId: string, id: string) {
    await this.getOne(tenantId, id);

    return await this.prisma.board.delete({ where: { id } });
  }

  // GetOne
  public async getOne(tenantId: string, id: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id,
        workspace: { tenantId },
      },
    });

    if (!board) throw new NotFoundException('Board not found');

    return board;
  }

  // GetAll
  public async getAll(tenantId: string, workspaceId: string) {
    return await this.prisma.board.findMany({
      where: {
        workspaceId,
        workspace: { tenantId },
      },
    });
  }
}
