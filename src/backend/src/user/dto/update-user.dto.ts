import { IsDefined, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsDefined()
  @IsString()
  nick: string;
}
