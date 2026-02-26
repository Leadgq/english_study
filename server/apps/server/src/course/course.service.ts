import { Injectable } from '@nestjs/common';
import { ResponseService, PrismaService } from '@libs/shared';

@Injectable()
export class CourseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly responseService: ResponseService,
  ) {}
  async findAll() {
    const courseList = await this.prismaService.course.findMany();
    const list = courseList.map((item) => {
      return {
        ...item,
        price: Number(item.price).toFixed(2),
      };
    });
    return this.responseService.success(list);
  }
}
