import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {PrismaModule} from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
@Module({
  imports:[PrismaModule, MailModule],
  providers: [UsersService],
  exports:[UsersService],
})
export class UsersModule {}
