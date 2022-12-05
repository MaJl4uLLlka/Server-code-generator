import { IsDefined, IsString } from 'class-validator';

export class TemplateDto {
  @IsDefined()
  @IsString()
  value: string;
}
