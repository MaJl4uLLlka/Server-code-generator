import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateRepositoryNameDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class ShareRepositoryDto {
  @IsDefined()
  @IsString()
  nick: string;
}

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  entityTemplate: string;

  @IsOptional()
  @IsString()
  serviceTemplate: string;

  @IsOptional()
  @IsString()
  controllerTemplate: string;
}
