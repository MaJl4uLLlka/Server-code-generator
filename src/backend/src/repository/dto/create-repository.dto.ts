import {
  IsDefined,
  IsString,
  ValidateNested,
  IsOptional,
  IsInt,
  Min,
  IsISSN,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConfigDto {
  @IsOptional()
  @IsString()
  apiPrefix: string;

  @IsDefined()
  @IsInt()
  @Min(1024)
  port: number;

  @IsDefined()
  @IsString()
  dbConnectionUri: string;
}

export class CreateRepositoryDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  type: 'JSON_RPC' | 'REST_API';

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateConfigDto)
  config!: CreateConfigDto;
}
