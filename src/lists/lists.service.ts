import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateListDto } from './dto/create-list.dto.js';
import { UpdateListDto } from './dto/update-list.dto.js';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create
  public async create(tenantId: string, dto: CreateListDto) {
    const board = await this.prisma.board.findFirst({
      where: { id: dto.boardId, workspace: { tenantId } },
    });

    if (!board) throw new NotFoundException('Board not found');

    return await this.prisma.list.create({
      data: {
        name: dto.name,
        order: dto.order,
        boardId: dto.boardId,
      },
    });
  }

  // Update
  public async update(tenantId: string, id: string, dto: UpdateListDto) {
    await this.getOne(tenantId, id);

    return await this.prisma.list.update({
      where: { id },
      data: dto,
    });
  }

  // Delete
  public async remove(tenantId: string, id: string) {
    await this.getOne(tenantId, id);

    return await this.prisma.list.delete({
      where: { id },
    });
  }

  // GetOne
  public async getOne(tenantId: string, id: string) {
    const list = await this.prisma.list.findFirst({
      where: {
        id,
        board: { workspace: { tenantId } },
      },
    });

    if (!list) throw new NotFoundException('List not found');

    return list;
  }

  // GetAll
  public async getAll(tenantId: string, boardId: string) {
    return await this.prisma.list.findMany({
      where: {
        boardId,
        board: { workspace: { tenantId } },
      },
      orderBy: { order: 'asc' },
    });
  }
}
