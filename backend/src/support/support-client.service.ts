import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ISupportRequestClientService } from './interfaces/support.interface';
import { Support, SupportDocument } from './schemas/support.schema';
import { Message, MessageDocument } from './messages/schemas/message.schema';
import {
  CreateSupportRequestDto,
  MarkMessagesAsReadDto,
} from './dto/support.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportClientService implements ISupportRequestClientService {
  constructor(
    @InjectModel(Support.name)
    private supportModel: Model<SupportDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportDocument> {
    const support = await this.supportModel.create({
      user: new Types.ObjectId(data.user),
      isActive: true,
    });

    const newMessage: MessageDocument = await this.messageModel.create({
      author: data.user,
      text: data.text,
    });

    const updatedSupport = await this.supportModel
      .findByIdAndUpdate(
        support._id,
        {
          $push: { messages: newMessage },
        },
        { new: true },
      )
      .exec();

    if (!updatedSupport) {
      throw new Error('Support request not found');
    }

    const roomId: string = support._id.toString();

    this.eventEmitter.emit('joinRoom', {
      userId: data.user,
      roomId: roomId,
    });

    this.eventEmitter.emit('sendSupportRequest', support);

    this.eventEmitter.emit('sendMessage', {
      roomId: roomId,
      message: newMessage,
    });

    return updatedSupport;
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const support = await this.supportModel
      .findById(params.supportRequest)
      .exec();

    if (!support) {
      throw new Error('Support request not found');
    }

    support.messages.forEach((msg: MessageDocument) => {
      if (
        !msg.readAt &&
        msg.sentAt <= params.createdBefore &&
        msg.author.toString() !== params.user
      ) {
        msg.readAt = new Date();
      }
    });

    this.eventEmitter.emit('sendMarkMessagesAsRead', support);

    await support.save();
  }

  async getUnreadCount(supportRequest: string): Promise<MessageDocument[]> {
    const support = await this.supportModel.findById(supportRequest).exec();

    if (!support) {
      throw new Error('Support request not found');
    }

    return support.messages.filter((msg: MessageDocument) => !msg.readAt);
  }
}
