import { Module } from '@nestjs/common';

import { SupportService } from './support.service';
import { SupportClientService } from './support-client.service';
import { SupportEmployeeService } from './support-employee.service';
import { SupportController } from './support.controller';
import { ChatGateway } from './websocket/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Support, SupportSchema } from './schemas/support.schema';
import { Message, MessageSchema } from './messages/schemas/message.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([{ name: Support.name, schema: SupportSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    ChatGateway,
    SupportService,
    SupportClientService,
    SupportEmployeeService,
  ],
  controllers: [SupportController],
})
export class SupportModule {}
