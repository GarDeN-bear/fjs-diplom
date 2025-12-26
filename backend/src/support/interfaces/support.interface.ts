import {
  CreateSupportRequestDto,
  GetChatListParamsDto,
  MarkMessagesAsReadDto,
  SendMessageDto,
} from '../dto/support.dto';
import { MessageDocument } from '../messages/schemas/message.schema';
import { SupportDocument } from '../schemas/support.schema';

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParamsDto): Promise<SupportDocument[]>;
  sendMessage(data: SendMessageDto): Promise<MessageDocument>;
  getMessages(supportRequest: string): Promise<MessageDocument[]>;
  subscribe(
    handler: (
      supportRequest: SupportDocument,
      message: MessageDocument,
    ) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportDocument>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: string): Promise<MessageDocument[]>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: string): Promise<MessageDocument[]>;
  closeRequest(supportRequest: string): Promise<void>;
}
