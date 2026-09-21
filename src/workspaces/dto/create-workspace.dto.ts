import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
