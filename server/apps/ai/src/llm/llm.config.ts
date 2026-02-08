import { ChatDeepSeek } from '@langchain/deepseek';
import { ConfigService } from '@nestjs/config';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

// 初始化DeepSeek模型
export const createDeepSeek = () => {
  const configService = new ConfigService();
  const apiKey = configService.get('DEEPSEEK_API_KEY');
  const model = configService.get('DEEPSEEK_API_MODEL');
  return new ChatDeepSeek({
    apiKey,
    model,
    temperature: 1.3,
    maxTokens: 4399,
    streaming: true, // 开启流式输出
  });
};

// 初始话checkpoint
export const createCheckpoint = async () => {
  const configService = new ConfigService();
  const dbUrl = configService.get('AI_DATABASE_URL');
  const checkpointer = PostgresSaver.fromConnString(dbUrl);
  await checkpointer.setup();
  return checkpointer;
};
