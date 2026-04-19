import { Module } from '@nestjs/common';
import { DigestService } from './digest.service';
import { BullModule } from '@nestjs/bullmq';
import { digestQueue } from './digest.que';
@Module({
  imports: [
    BullModule.registerQueue({ name: digestQueue.name }),
  ],
  providers: [DigestService]
})
export class DigestModule { }
