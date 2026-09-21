import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkSpaceDto } from './create-workspace.dto.js';

export class UpdateWorkspaceDto extends PartialType(CreateWorkSpaceDto) {}
