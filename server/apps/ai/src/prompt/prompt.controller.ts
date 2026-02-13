import { Controller, Get, UseGuards } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { AuthGuard } from '@libs/shared/auth/auth.guard';

@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  findAll() {
    return this.promptService.findAll();
  }
}
