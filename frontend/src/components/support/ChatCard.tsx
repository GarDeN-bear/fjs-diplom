import { type FormEvent } from "react";
import MessageCard from "./MessageCard";
import {
  type CreateMessageRequest,
  type SupportRequest,
} from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";

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

  const showChatView = () => {
    return (
      <div className="message-list">
        {activeSupportRequest.messages.map((message, index) => (
          <MessageCard
            key={index}
            isYour={message.author === user._id}
            isRead={false}
            messageData={message.text}
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
