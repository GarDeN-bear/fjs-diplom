import { useRef, type FormEvent } from "react";
import MessageCard from "./MessageCard";
import {
  type CreateMessageRequest,
  type Message,
  type SupportRequest,
} from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import {
  type MarkMessagesAsReadRequestData,
  markMessagesAsReadRequest,
} from "../api/support";

interface ChatCardPrompt {
  activeSupportRequest: SupportRequest;
  message: CreateMessageRequest;
  handleSubmit: () => void;
  setMessage: (message: CreateMessageRequest) => void;
  closeSupportRequest?: () => void;
}

const ChatCard = ({
  activeSupportRequest,
  message,
  handleSubmit,
  setMessage,
  closeSupportRequest,
}: ChatCardPrompt) => {
  const { user } = useAuth();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const checkIfMessageIsVisible = (messageId: string): boolean => {
    if (!messagesContainerRef.current) return false;

    const messageElement = document.getElementById(messageId);
    if (!messageElement) return false;

    const container = messagesContainerRef.current;
    const messageRect = messageElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return (
      messageRect.top >= containerRect.top &&
      messageRect.bottom <= containerRect.bottom
    );
  };

  const handleScroll = async () => {
    await markMessagesAsRead();
  };

  const markMessagesAsRead = async () => {
    if (!activeSupportRequest._id || !user._id) return;

    let createdBefore: Date = new Date();
    let hasUnreadMessages = false;
    activeSupportRequest.messages.forEach((msg: Message) => {
      if (
        !msg.readAt &&
        msg.author !== user._id &&
        checkIfMessageIsVisible(msg._id)
      ) {
        createdBefore = new Date(msg.sentAt);
        hasUnreadMessages = true;
        return;
      }
    });

    if (!hasUnreadMessages) return;

    const data: MarkMessagesAsReadRequestData = {
      activeSupportRequestId: activeSupportRequest._id,
      userId: user._id,
      createdBefore: createdBefore.toISOString(),
    };

    await markMessagesAsReadRequest(data);
  };

  const showChatView = () => {
    return (
      <div
        className="message-list"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {activeSupportRequest.messages.map((message, index) => (
          <MessageCard
            key={index}
            isYour={message.author === user._id}
            isRead={message.readAt !== undefined}
            messageData={message.text}
            messageId={message._id}
          />
        ))}
      </div>
    );
  };

  const showChatCardForm = () => {
    return (
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="common-form"
      >
        <div className="form-group">
          <input
            type="text"
            id="message"
            value={message.text}
            onChange={(e) => {
              setMessage({ ...message, text: e.target.value });
            }}
            placeholder="Введите сообщение"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Отправить
          </button>
          {closeSupportRequest && (
            <button className="btn btn-secondary" onClick={closeSupportRequest}>
              Закрыть чат
            </button>
          )}
        </div>
      </form>
    );
  };

  return (
    <>
      {showChatView()}
      {showChatCardForm()}
    </>
  );
};

export default ChatCard;
