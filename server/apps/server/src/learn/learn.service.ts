import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@en/common/user';
import { PrismaService, ResponseService } from '@libs/shared';

@Injectable()
export class LearnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly responseService: ResponseService,
  ) {}

  async saveWorldMaster(worldIds: string[], userId: RefreshToken['userId']) {
    const worldMaster = worldIds.map((id) => ({
      wordId: id,
      userId,
      isMaster: true,
    }));
    await this.prisma.wordBookRecord.createMany({
      data: worldMaster,
    });
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wordNumber: {
          increment: worldIds.length,
        },
      },
    });
    return this.responseService.success({
      wordNumber: worldIds.length,
    });
  }

  async getWorldList(id: string, userId: RefreshToken['userId']) {
    const courseRecord = await this.prisma.courseRecord.findFirst({
      where: {
        courseId: id,
        userId,
        isPurchased: true,
      },
      include: {
        course: true,
      },
    });
    if (!courseRecord) {
      return this.responseService.error(null, '非法的请求');
    }
    const courseType = courseRecord.course.value;
    const world = await this.prisma.wordBook.findMany({
      where: {
        [courseType]: true,
        wordBookRecords: {
          none: {
            userId,
          },
        },
      },
      skip: 0,
      take: 10,
      orderBy: {
        frq: 'desc',
      },
    });
    return this.responseService.success(world);
  }
}
