import { Controller, Get} from '@nestjs/common';
import { CourseService } from './course.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@libs/shared/auth/auth.guard';
import type {Request} from "express"
import { Req } from '@nestjs/common';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('list')
  findAll() {
    return this.courseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('my')
  findMy(@Req() req: Request) {
    const userId = req.user.userId;
    return this.courseService.findMy(userId);
  }
}