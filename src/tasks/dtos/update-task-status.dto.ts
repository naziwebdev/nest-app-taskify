import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { TasStatusEnum } from '../enums/taskStatusEnum';

export class UpdateTaskStatusDto {
  @IsEnum(TasStatusEnum)
  @IsString()
  @IsNotEmpty()
  status:TasStatusEnum;
}
