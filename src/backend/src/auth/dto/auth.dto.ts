import { IsEmail, IsDefined, IsString } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
