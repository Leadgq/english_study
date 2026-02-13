import { chatMode } from './../prompt/prompt.model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDeepSeek,
  createCheckpoint,
  createBoChaSearch,
  createDeepSeekReasoner,
} from '../llm/llm.config';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import type { ChatDto, ChatRoleType } from '@en/common/chat';
import type { AIMessageChunk } from 'langchain';
import { createAgent } from 'langchain';
import { ResponseService } from '@libs/shared';
@Injectable()
export class ChatService implements OnModuleInit {
  private checkpointer: PostgresSaver;
  constructor(private readonly responseService: ResponseService) {}

  async onModuleInit() {
    // 初始话
    this.checkpointer = await createCheckpoint();
  }

  async streamCompletion(createChatDto: ChatDto) {
    let prompt = chatMode.find(
      (item) => item.role === createChatDto.role,
    )?.prompt;
    if (!prompt) {
      throw new Error(`Prompt for role ${createChatDto.role} not found`);
    }
    if (createChatDto.webSearch) {
      const webSearchPrompt = await createBoChaSearch(createChatDto.content);
      prompt += `请根据以下搜索结果回答问题：${webSearchPrompt}(并且返回你参考的网站名称)，用户问题：${createChatDto.content}`;
    }
    let model = createDeepSeek(); //普通模型
    if (createChatDto.deepThink) {
      model = createDeepSeekReasoner(); //深度思考模型
    }
    const agent = createAgent({
      model,
      systemPrompt: prompt,
      checkpointer: this.checkpointer,
    });
    const threadId = `${createChatDto.userId}-${createChatDto.role}`;
    const stream = agent.stream(
      {
        messages: [{ role: 'human', content: createChatDto.content }],
      },
      {
        configurable: {
          thread_id: threadId,
        },
        streamMode: 'messages',
      },
    );
    return stream; // 这是个迭代器，需要在controller中处理
  }

  async getHistory(userId: string, role: ChatRoleType) {
    const messages = await this.checkpointer.get({
      configurable: { thread_id: `${userId}-${role}` },
    });
    const list = messages?.channel_values?.messages as AIMessageChunk[];
    if (!list) return this.responseService.success([]);
    return this.responseService.success(
      list.map((item) => ({
        content: item.content,
        role: item.type,
        reasoning: item.additional_kwargs?.reasoning_content,
      })),
    );
  }
}
