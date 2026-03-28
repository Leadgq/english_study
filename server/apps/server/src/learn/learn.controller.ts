import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { LearnService } from './learn.service';
import { AuthGuard } from "@libs/shared/auth/auth.guard"
import  type { Request } from  "express"
import { RefreshToken } from '@en/common/user';

@Controller('learn')
export class LearnController {
  constructor(private readonly learnService: LearnService) {}

  @UseGuards(AuthGuard)
  @Post("world/master")
  saveWorldMaster(@Body() { worldIds }: { worldIds: string[] }, @Req() req: Request) {
    const userId = req.user.userId as RefreshToken['userId'];
    return this.learnService.saveWorldMaster( worldIds, userId );
  }

  @UseGuards(AuthGuard)
  @Get("world/:id")
  getWorldList(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user.userId as RefreshToken['userId'];
    return this.learnService.getWorldList(id, userId);
  }
}
