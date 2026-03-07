import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import type { CreatePayDto } from "@en/common/pay"
import { PayService } from './pay.service';
import { AuthGuard } from "@libs/shared/auth/auth.guard"
import type { Request } from "express"
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPayDto: CreatePayDto, @Req() req: Request) {
    return this.payService.create(createPayDto);
  }
}
