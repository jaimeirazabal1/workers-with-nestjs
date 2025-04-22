import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectQueue('tasks') private tasksQueue: Queue,
  ) {}

  async create(name: string, description?: string): Promise<Task> {
    const task = this.taskRepository.create({
      name,
      description,
      status: TaskStatus.PENDING,
    });
    
    await this.taskRepository.save(task);
    
    // Enviar la tarea a la cola de Bull para procesamiento en segundo plano
    await this.tasksQueue.add('process', { taskId: task.id }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
    
    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    return this.taskRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, status: TaskStatus, result?: string): Promise<Task> {
    await this.taskRepository.update(id, { status, result });
    return this.findOne(id);
  }
} 