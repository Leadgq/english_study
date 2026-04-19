import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from '@libs/shared';
import { PromptModule } from './prompt/prompt.module';
import { DigestModule } from './digest/digest.module';

@Module({
  // SharedModule 须先于 DigestModule，确保 BullModule.forRoot 已注册后再 registerQueue
  imports: [SharedModule, ChatModule, PromptModule, DigestModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
