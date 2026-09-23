import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto.js';

export class UpdateBoardDto extends PartialType(
  OmitType(CreateBoardDto, ['workspaceId']),
) {}
