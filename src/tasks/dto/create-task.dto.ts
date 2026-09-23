import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsString()
  @IsOptional()
  assigneeId?: string;
}
