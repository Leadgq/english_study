import { Injectable, OnModuleInit } from '@nestjs/common';
import { EmailService } from '@libs/shared';
import { PrismaService } from '@libs/shared';
import dayjs from 'dayjs';
import { createAgent } from "langchain"
import { createDeepSeek } from '../llm/llm.config';
import { tool } from '@langchain/core/tools';
import makrked from 'marked'
@Injectable()
export class DigestService implements OnModuleInit {
    constructor(
        private readonly emailService: EmailService,
        private readonly prismaService: PrismaService
    ) { }

    private queryTool() {
        return tool(async ({ userId }: { userId: string }) => {
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: userId,
                },
                select: {
                    email: true, //邮箱
                    name: true, //用户名
                    wordNumber: true, //单词数量
                    //查询今天的单词记录
                    wordBookRecords: {
                        where: {
                            createdAt: {
                                //今天00:00:00 - 明天00:00:00
                                gte: dayjs().startOf('day').toDate(),
                                lte: dayjs().add(1, 'day').startOf('day').toDate()
                            }
                        },
                        select: {
                            //找到那个表
                            word: {
                                select: {
                                    //找到那个单词
                                    word: true,
                                }
                            }
                        }
                    }
                }
            })
            return user
        }, {
            name: 'queryTool', 
            description: '根据用户id查询用户学习的单词记录', 
            schema: {
                type: 'object',
                properties: {
                    userId: { type: 'string', description: '用户id' },
                },
                required: ['userId']
            }
        })
    }

    async onModuleInit() {
        const users = await this.prismaService.user.findMany({
            where: {
                isTimingTask: true,
                timingTaskTime: {
                    not: ''
                },
                email: {
                    not: null
                },
                wordBookRecords: {
                    some: {
                        // 创建时间是今天的00:00:00到明天的00:00:00
                        createdAt: {
                            gte: dayjs().startOf('day').toDate(),
                            lte: dayjs().add(1, 'day').startOf('day').toDate(),
                        }
                    }
                }
            },
            select: {
                id: true
            }
        });
        for (const user of users) {
            const agent = createAgent({
                model: createDeepSeek(),
                systemPrompt: "你是一个单词助手,根据用户信息和单词信息,生成单词记忆报告",
                tools: [
                    this.queryTool(),
                ]
            })

            const result = await agent.invoke({
                messages: [{ role: 'user', content: `查询用户信息,并且根据用户id关联单词记录表，查询出用户今天的单词记录,用户id: ${user.id}，过滤掉敏感信息` }]
            })
            const content = result.messages.at(-1)?.content
            if(content){
                const html = makrked.parse(content as string) 
                console.log(html);
            }
        }
    }
}
