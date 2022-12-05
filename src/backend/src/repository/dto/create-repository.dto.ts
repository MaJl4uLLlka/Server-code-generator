import { IsDefined, IsString, IsEnum } from 'class-validator';
import { RepositoryType } from '../repository.service';

export class CreateRepositoryDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsEnum(RepositoryType)
  type: RepositoryType;
}
