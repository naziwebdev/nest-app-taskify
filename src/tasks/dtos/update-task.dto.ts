import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  MinLength,
  MaxLength,
  IsNumber,
  IsArray,
} from 'class-validator';

import { TasStatusEnum } from '../enums/taskStatusEnum';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsDate()
  @IsOptional()
  deadline: Date;

  @IsEnum(TasStatusEnum)
  @IsString()
  @IsOptional()
  status: TasStatusEnum;

  @IsNumber()
  @IsOptional()
  projectId: number;

  @IsArray()
  @IsOptional()
  usersId: number[];
}
