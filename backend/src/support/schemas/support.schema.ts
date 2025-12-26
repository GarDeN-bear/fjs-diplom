import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import {
  MessageDocument,
  MessageSchema,
} from '../messages/schemas/message.schema';
import { User } from 'src/users/schemas/user.schema';

export type SupportDocument = Support &
  Document & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Support {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: [MessageSchema], default: [], required: true })
  messages: MessageDocument[];

  @Prop({ required: false })
  isActive: boolean;
}

export const SupportSchema = SchemaFactory.createForClass(Support);
