import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type MessageDocument = Message & Document & { _id: ObjectId };

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId | User;

  @Prop({ required: true, default: Date.now })
  sentAt: Date;

  @Prop({ required: true })
  text: string;

  @Prop({ required: false })
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
