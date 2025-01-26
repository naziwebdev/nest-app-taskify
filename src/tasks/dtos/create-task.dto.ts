import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDate,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayMaxSize,
  IsInt,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Transform string to Date
  deadline: Date;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsInt({ each: true })
  usersId: number[];
}
