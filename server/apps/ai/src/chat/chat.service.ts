import { chatMode } from './../prompt/prompt.model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createDeepSeek, createCheckpoint } from '../llm/llm.config';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import type { ChatDto, ChatRoleType } from '@en/common/chat';
import type { ReactAgent } from 'langchain';
import { createAgent } from 'langchain';

@Injectable()
export class ChatService implements OnModuleInit {
  private checkpointer: PostgresSaver;
  private agents: Map<ChatRoleType, ReactAgent> = new Map();
  async onModuleInit() {
    // 初始话
    this.checkpointer = await createCheckpoint();
    //初始化多个agent
    for (const mode of chatMode) {
      const agent = createAgent({
        model: createDeepSeek(),
        systemPrompt: mode.prompt,
        checkpointer: this.checkpointer,
      });
      this.agents.set(mode.role, agent);
    }
  }

  streamCompletion(createChatDto: ChatDto) {
    const agent = this.agents.get(createChatDto.role);
    if (!agent) {
      throw new Error(`Agent for role ${createChatDto.role} not found`);
    }
    const threadId = `${createChatDto.userId}-${createChatDto.role}`;
    const stream = agent.stream(
      {
        messages: [
          { role: "human", content: createChatDto.content },
        ],
      },
      {
        configurable: {
          thread_id: threadId,
        },
        streamMode: 'messages',
      },
    );
    return stream; // 这是个迭代器
  }

  findAll() {
    return `This action returns all chat`;
  }
}
