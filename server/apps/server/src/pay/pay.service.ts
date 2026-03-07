import { Injectable } from '@nestjs/common';
import { CreatePayDto } from './dto/create-pay.dto';
import { UpdatePayDto } from './dto/update-pay.dto';

@Injectable()
export class PayService {
  create(createPayDto: CreatePayDto) {
    return 'This action adds a new pay';
  }
}
