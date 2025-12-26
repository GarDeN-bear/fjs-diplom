import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ISupportRequestService } from './interfaces/support.interface';
import { Support, SupportDocument } from './schemas/support.schema';
import { GetChatListParamsDto, SendMessageDto } from './dto/support.dto';
import { Message, MessageDocument } from './messages/schemas/message.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportService implements ISupportRequestService {
  constructor(
    @InjectModel(Support.name)
    private supportModel: Model<SupportDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  findSupportRequests(
    params: GetChatListParamsDto,
  ): Promise<SupportDocument[]> {
    const { user, isActive } = params;

    const query: any = {};

    if (user && Types.ObjectId.isValid(user)) {
      query.user = new Types.ObjectId(user);
    }

    query.isActive = isActive;
    return this.supportModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
    const newMessage: MessageDocument = await this.messageModel.create({
      author: data.author,
      text: data.text,
    });

    const support = await this.supportModel
      .findByIdAndUpdate(data.supportRequest, {
        $push: { messages: newMessage },
        $set: { hasNewMessages: true },
      })
      .exec();

    if (!support) {
      throw new Error('Support request not found');
    }

    const roomId: string = support._id.toString();

    this.eventEmitter.emit('sendMessage', {
      roomId: roomId,
      message: newMessage,
    });

    return newMessage;
  }

  async getMessages(supportRequest: string): Promise<MessageDocument[]> {
    const support: SupportDocument | null = await this.supportModel
      .findById(supportRequest)
      .select('messages')
      .exec();

    if (!support) {
      throw new Error('Support request not found');
    }

    return support.messages;
  }

  subscribe(
    handler: (
      supportRequest: SupportDocument,
      message: MessageDocument,
    ) => void,
  ): () => void {
    const listener = (data: {
      supportRequest: SupportDocument;
      message: MessageDocument;
    }) => {
      handler(data.supportRequest, data.message);
    };

    this.eventEmitter.on('newMessage', listener);

    return () => {
      this.eventEmitter.off('newMessage', listener);
    };
  }
}
