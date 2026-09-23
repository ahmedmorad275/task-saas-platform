import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Create
  public async create(tenantId: string, dto: CreateTaskDto) {
    const list = await this.prisma.list.findFirst({
      where: {
        id: dto.listId,
        board: { workspace: { tenantId } },
      },
    });

    if (!list) throw new NotFoundException('List not found');

    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findFirst({
        where: { id: dto.assigneeId, tenantId },
      });

      if (!assignee)
        throw new BadRequestException('Assignee not found in this tenant');
    }

    return await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        order: dto.order,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        listId: dto.listId,
        assigneeId: dto.assigneeId,
      },
    });
  }

  // Update
  public async update(tenantId: string, id: string, dto: UpdateTaskDto) {
    await this.getOne(tenantId, id);

    if (dto.assigneeId) {
      const assignee = await this.prisma.user.findFirst({
        where: { id: dto.assigneeId, tenantId },
      });

      if (!assignee)
        throw new BadRequestException('Assignee not found in this tenant');
    }

    return await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  // Delete
  public async remove(tenantId: string, id: string) {
    await this.getOne(tenantId, id);

    return await this.prisma.task.delete({ where: { id } });
  }

  // GetOne
  public async getOne(tenantId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        list: { board: { workspace: { tenantId } } },
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  // GetAll
  public async getAll(tenantId: string, listId: string) {
    return await this.prisma.task.findMany({
      where: {
        listId,
        list: { board: { workspace: { tenantId } } },
      },
      orderBy: { order: 'asc' },
    });
  }
}
