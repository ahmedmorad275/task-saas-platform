import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateBoardDto) {
    return this.boardsService.create(user.tenantId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.update(user.tenantId, id, dto);
  }

  @Delete('id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.boardsService.remove(user.tenantId, id);
  }

  @Get()
  getAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query('workspaceId') worksapceId: string,
  ) {
    return this.boardsService.getAll(user.tenantId, worksapceId);
  }

  @Get(':id')
  getOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.boardsService.getOne(user.tenantId, id);
  }
}
