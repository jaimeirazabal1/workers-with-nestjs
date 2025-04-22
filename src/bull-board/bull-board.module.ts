import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
})
export class BullBoardConfigModule {} 