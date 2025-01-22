import { Module } from '@nestjs/common';
import { TaskAssignmentsService } from './task-assignments.service';
import { TaskAssignmentsController } from './task-assignments.controller';

@Module({
  providers: [TaskAssignmentsService],
  controllers: [TaskAssignmentsController]
})
export class TaskAssignmentsModule {}
