import { IsOptional, IsString } from 'class-validator';

export class UpdateRepositoryNameDto {
  @IsOptional()
  @IsString()
  name: string;
}
