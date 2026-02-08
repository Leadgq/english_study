import { Injectable } from '@nestjs/common';
@Injectable()
export class PromptService {
  findAll() {
    return `This action returns all prompt`;
  }
}
