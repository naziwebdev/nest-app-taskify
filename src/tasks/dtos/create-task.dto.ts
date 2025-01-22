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
