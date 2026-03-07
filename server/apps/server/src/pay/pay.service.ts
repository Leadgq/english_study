import { Injectable } from '@nestjs/common';
import type { CreatePayDto } from "@en/common/pay"
import type { TokenPayload } from '@en/common/user';
import * as nanoid from "nanoid";
import dayjs from "dayjs";
import { ConfigService } from '@nestjs/config';
import { PrismaService, PayService as SharedPayService } from "@libs/shared"
import type { Request } from "express"
@Injectable()
export class PayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly sharedPayService: SharedPayService) {
  }

  private createOutTradeNo() {
    const prefix = 'EN'
    return `${prefix}${nanoid.nanoid(12)}`;
  }

  async create(createPayDto: CreatePayDto, user: TokenPayload) {
    await this.prisma.$transaction(async (tx) => {
      // 1. create order
      const outTradeNo = this.createOutTradeNo();
      await tx.paymentRecord.create({
        data: {
          userId: user.userId,
          outTradeNo,
          amount: createPayDto.total_amount,
          subject: createPayDto.subject,
          body: createPayDto.body,
        }
      })
      // 2. create sdk
      const alipaySdk = this.sharedPayService.getAlipaySdk();
      const dateTime = dayjs().add(1, "minute");
      const payUrl = alipaySdk.pageExecute("alipay.trade.page.pay", "GET", {
        bizContent: {
          out_trade_no: outTradeNo,
          total_amount: createPayDto.total_amount,
          subject: createPayDto.subject,
          product_code: "FAST_INSTANT_TRADE_PAY",
          time_expire: dateTime.format("YYYY-MM-DD HH:mm:ss"),
          body: JSON.stringify({
            courseId: createPayDto.courseId,
            userId: user.userId,
          }),
          notify_url: `${this.configService.get<string>('ALIPAY_NOTIFY_URL')!}/api/v1/pay/notify`,
        },
      });
      return {
        payUrl,
        // 时间戳
        timeExpire: dateTime.toDate().getTime(),
      }
    })
  }

  notify(req: Request) {
    return true;
  }
}
