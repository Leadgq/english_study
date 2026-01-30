import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule],
})
export class UserModule {}
