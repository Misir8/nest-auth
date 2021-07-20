import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsMobilePhone()
  readonly phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
