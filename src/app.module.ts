import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardConfigModule } from './bull-board/bull-board.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TasksModule,
    BullBoardConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
