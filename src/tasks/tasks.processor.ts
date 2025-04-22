import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TasksService } from './tasks.service';
import { TaskStatus } from './entities/task.entity';

@Processor('tasks')
export class TaskProcessor {
  private readonly logger = new Logger(TaskProcessor.name);

  constructor(private readonly tasksService: TasksService) {}

  @Process('process')
  async processTask(job: Job<{ taskId: number }>): Promise<string> {
    const { taskId } = job.data;
    
    // Actualizar el estado de la tarea a "procesando"
    await this.tasksService.update(taskId, TaskStatus.PROCESSING);
    
    try {
      // Simulamos una tarea pesada que toma tiempo
      this.logger.log(`Procesando tarea ${taskId}...`);
      
      // Esperar un tiempo aleatorio entre 5 y 15 segundos
      const processingTime = Math.floor(Math.random() * 10000) + 5000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generar un resultado
      const result = `Tarea completada después de ${processingTime/1000} segundos`;
      
      // Actualizar la tarea con el resultado
      await this.tasksService.update(taskId, TaskStatus.COMPLETED, result);
      
      return result;
    } catch (error) {
      this.logger.error(`Error al procesar tarea ${taskId}: ${error.message}`);
      await this.tasksService.update(taskId, TaskStatus.FAILED, error.message);
      throw error;
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Procesando trabajo ${job.id} de tipo ${job.name} con datos: ${JSON.stringify(job.data)}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.log(
      `Trabajo ${job.id} completado con resultado: ${result}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Trabajo ${job.id} falló con error: ${error.message}`,
    );
  }
} 