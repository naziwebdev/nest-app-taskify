import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Res,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UpdateTaskStatusDto } from './dtos/update-task-status.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Response } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateTaskDto, @Res() res: Response) {
    const task = await this.tasksService.create(body);
    return res.status(HttpStatus.CREATED).json({
      data: task,
      statusCode: HttpStatus.CREATED,
      message: 'task created successfully',
    });
  }

  @Get('/:project_id/tasks')
  @UseGuards(AuthGuard)
  async getAll(
    @Param('project_id') projectId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Res() res: Response,
  ) {}

  @Get('/:task_id')
  @UseGuards(AuthGuard)
  async getOne(@Param('task_id') id: string, @Res() res: Response) {}

  @Put('/:task_id')
  @UseGuards(AuthGuard)
  async update(
    @Param('task_id') id: string,
    @Body() body: UpdateTaskDto,
    @Res() res: Response,
  ) {}

  @Patch('/:task_id/status')
  @UseGuards(AuthGuard)
  async updateStatusTask(
    @Param('task_id') id: string,
    @Body() body: UpdateTaskStatusDto,
    @Res() res: Response,
  ) {}

  @Delete('/:task_id')
  @UseGuards(AuthGuard)
  async remove(@Param('task_id') id: string, @Res() res: Response) {}
}
