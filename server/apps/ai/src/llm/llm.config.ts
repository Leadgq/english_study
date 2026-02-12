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

// 初始化DeepSeek推理模型
export const createDeepSeekReasoner = () => {
  const configService = new ConfigService();
  const apiKey = configService.get('DEEPSEEK_API_KEY');
  const model = configService.get('DEEPSEEK_REASONER_API_MODEL');
  return new ChatDeepSeek({
    apiKey,
    model,
    temperature: 1.3,
    maxTokens: 18000,
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

export const createBoChaSearch = async (query: string, count: number = 10) => {
  const configService = new ConfigService();
  const boChaUrl = configService.get('BOCHA_SEARCH_URL')!;
  const result = await fetch(boChaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${configService.get('BOCHA_API_KEY')}`,
    },
    body: JSON.stringify({
      query,
      count,
      summary: true, // 是否返回长文本摘要
      freshness: 'noLimit', // 是否返回结果 freshness 字段
    }),
  });
  const { data } = await result.json();
  const values = data.webPages.value;
  const prompt = values.map((item) => (
    `
    标题: ${item.name}
    链接: ${item.url}
    摘要: ${item?.summary?.replace(/\n/g, '') ?? ''}
    网站名称: ${item.siteName}
    网站logo: ${item.siteIcon}
    发布时间: ${item.dateLastCrawled}
    `
  )).join('\n');
  return prompt;
};
