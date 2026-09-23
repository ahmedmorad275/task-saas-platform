import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateListDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsString()
  @IsNotEmpty()
  boardId: string;
}
