import { Injectable } from '@nestjs/common';
import type { CreatePayDto } from '@en/common/pay';
import type { TokenPayload } from '@en/common/user';
import * as nanoid from 'nanoid';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import {
  PrismaService,
  PayService as SharedPayService,
  ResponseService,
} from '@libs/shared';
import type { Request } from 'express';
import { TradeStatus } from '@libs/shared/generated/prisma/enums';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class PayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly responseService: ResponseService,
    private readonly sharedPayService: SharedPayService,
    private readonly socketGateway: SocketGateway,
  ) {}

  private createOutTradeNo() {
    const prefix = 'EN';
    return `${prefix}${nanoid.nanoid(12)}`;
  }

  async create(createPayDto: CreatePayDto, user: TokenPayload) {
    const courseRecord = await this.prisma.courseRecord.findFirst({
      where: {
        userId: user.userId,
        courseId: createPayDto.courseId,
      },
    });
    if (courseRecord) {
      return this.responseService.error(null, '课程已购买');
    }
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. create order
      const outTradeNo = this.createOutTradeNo();
      await tx.paymentRecord.create({
        data: {
          userId: user.userId,
          outTradeNo,
          amount: createPayDto.total_amount,
          subject: createPayDto.subject,
          body: createPayDto.body,
        },
      });
      // 2. create sdk
      const alipaySdk = this.sharedPayService.getAlipaySdk();
      const dateTime = dayjs().add(1, 'minute');
      const payUrl = alipaySdk.pageExecute('alipay.trade.page.pay', 'GET', {
        bizContent: {
          out_trade_no: outTradeNo,
          total_amount: createPayDto.total_amount,
          subject: createPayDto.subject,
          product_code: 'FAST_INSTANT_TRADE_PAY',
          time_expire: dateTime.format('YYYY-MM-DD HH:mm:ss'),
          body: JSON.stringify({
            courseId: createPayDto.courseId,
            userId: user.userId,
          }),
        },
        notify_url: `${this.configService.get<string>('ALIPAY_NOTIFY_URL')!}/api/v1/pay/notify`,
      });
      return {
        payUrl,
        // 时间戳
        timeExpire: dateTime.toDate().getTime(),
      };
    });
    return this.responseService.success(result);
  }

  async notify(req: Request) {
    const userInfo = JSON.parse(req.body.body) as {
      userId: string;
      courseId: string;
    };
    await this.prisma.$transaction(async (tx) => {
      // 更新支付记录
      const { trade_no, out_trade_no, gmt_payment } = req.body;
      const paymentRecord = await tx.paymentRecord.update({
        where: {
          //out_trade_no 这是自定义的
          outTradeNo: out_trade_no,
        },
        data: {
          // 支付宝的交易号
          tradeNo: trade_no,
          sendPayTime: dayjs(gmt_payment).toDate(),
          tradeStatus: TradeStatus.TRADE_SUCCESS,
        },
      });
      // 创建一条我的课程记录
      await tx.courseRecord.create({
        data: {
          userId: userInfo.userId,
          courseId: userInfo.courseId,
          isPurchased: true,
          paymentRecordId: paymentRecord.id,
        },
      });
      // 发送支付成功事件
      this.socketGateway.emitPaymentSuccess(userInfo.userId);
    });
    return true;
  }
}
