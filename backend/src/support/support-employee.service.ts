import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ISupportRequestEmployeeService } from './interfaces/support.interface';
import { Support, SupportDocument } from './schemas/support.schema';
import { MarkMessagesAsReadDto } from './dto/support.dto';
import { MessageDocument } from './messages/schemas/message.schema';

@Injectable()
export class SupportEmployeeService implements ISupportRequestEmployeeService {
  constructor(
    @InjectModel(Support.name)
    private supportModel: Model<SupportDocument>,
  ) {}

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
        msg.sentAt < params.createdBefore &&
        msg.author.toString() === params.user
      ) {
        msg.readAt = new Date();
      }
    });

    await support.save();
  }

  async getUnreadCount(supportRequest: string): Promise<MessageDocument[]> {
    const support = await this.supportModel.findById(supportRequest).exec();

    if (!support) {
      throw new Error('Support request not found');
    }

    return support.messages.filter((msg: MessageDocument) => !msg.readAt);
  }

  async closeRequest(supportRequest: string): Promise<void> {
    const support = await this.supportModel.findById(supportRequest).exec();

    if (!support) {
      throw new Error('Support request not found');
    }

    support.isActive = false;

    await support.save();
  }
}
