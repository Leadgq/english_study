import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { ChatDto } from '@en/common/chat';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createChatDto: ChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream'); // 流式传输的MIME类型
    res.setHeader('Cache-Control', 'no-cache'); // 禁用缓存
    res.setHeader('Connection', 'keep-alive'); // 保持连接
    const stream = await this.chatService.streamCompletion(createChatDto);
    for await (const chunk of stream) {
      const [msg] = chunk;
      res.write(
        `data: ${JSON.stringify({ content: msg.content, role: 'ai' })}\n\n`,
      );
    }
    res.end();
  }

  @Get('history')
  findAll() {
    return this.chatService.findAll();
  }
}
