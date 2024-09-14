import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Chat } from './chat.entity';
import { currentDate } from '../../utils/Utils';

@Schema()
export class ChatMessage {
  constructor(chatId: Types.ObjectId, userId: Types.ObjectId, textContent: string, attachments?: string[]) {
    //this._id = new Types.ObjectId();
    this.chatId = chatId;
    this.userId = userId;
    this.textContent = textContent;
    if (attachments) this.attachments = attachments;
  }
  // @Prop({ type: Types.ObjectId, required: true, default: new Types.ObjectId() })
  // _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ type: SchemaTypes.ObjectId, ref: Chat.name, required: true })
  chatId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  textContent: string;

  @Prop({ type: Boolean, required: true, default: false })
  isRead: boolean = false;

  @Prop({ type: [String], required: false, default: [] })
  attachments?: string[] = [];

  @Prop({ default: Date.now })
  createdAt: Date = currentDate();
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
