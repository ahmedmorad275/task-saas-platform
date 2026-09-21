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
import { WorkspacesService } from './workspaces.service.js';
import { CreateWorkSpaceDto } from './dto/create-workspace.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto.js';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateWorkSpaceDto,
  ) {
    return this.workspacesService.create(dto, user.tenantId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(user.tenantId, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.workspacesService.remove(user.tenantId, id);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.workspacesService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.workspacesService.findOne(user.tenantId, id);
  }
}
