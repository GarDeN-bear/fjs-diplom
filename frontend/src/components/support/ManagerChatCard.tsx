import { useEffect, useState, type FormEvent } from "react";
import MessageCard from "./MessageCard";
import {
  emptyCreateMessageRequest,
  emptySupportRequest,
  VITE_BACKEND_URL,
  type CreateMessageRequest,
  type CreateSupportRequest,
  type MessageResponce,
  type SupportRequest,
  type User,
} from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/support/SupportContext";

interface ManagerSupportCardPrompt {
  userData: User;
}

const ManagerChatCard = ({ userData }: ManagerSupportCardPrompt) => {
  const [activeSupportRequest, setActiveSupportRequest] =
    useState<SupportRequest>(emptySupportRequest);
  const [message, setMessage] = useState<CreateMessageRequest>(
    emptyCreateMessageRequest
  );

  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const { socket, subscribeToEvent } = useSocket();

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeNewSupportRequest = subscribeToEvent(
      "newSupportRequest",
      (data: SupportRequest) => {
        if (data.user === user._id) {
          setActiveSupportRequest(data);
          setLoading(false);
        }
      }
    );

    const unsubscribeNewMessage = subscribeToEvent(
      "newMessage",
      (data: MessageResponce) => {
        if (data.supportRequest === activeSupportRequest._id) {
          activeSupportRequest.messages.push(data.message);
          setActiveSupportRequest(activeSupportRequest);
          setLoading(false);
          setMessage((prev) => ({ ...prev, text: "" }));
        }
      }
    );

    if (
      activeSupportRequest._id.length > 0 &&
      activeSupportRequest.user.length > 0
    ) {
      socket?.emit("joinClientToRoom", {
        userId: activeSupportRequest.user,
        roomId: activeSupportRequest._id,
      });
    }

    return () => {
      unsubscribeNewSupportRequest();
      unsubscribeNewMessage();
    };
  }, [activeSupportRequest, socket]);

  useEffect(() => {
    if (!user._id) navigate("/");
    setMessage((prev) => ({ ...prev, author: user._id }));

    fetchChat().finally(() => setLoading(false));
  }, [user]);

  const fetchChat = async () => {
    try {
      const url = new URL(`${VITE_BACKEND_URL}/api/manager/support-requests`);
      url.searchParams.append("user", userData._id);
      url.searchParams.append("isActive", "true");
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка: ${error}`);
      }

      const data: SupportRequest[] = await response.json();

      const activeRequest: SupportRequest | undefined = data.find(
        (req) => req.isActive
      );

      setActiveSupportRequest(activeRequest || emptySupportRequest);
      setMessage((prev) => ({
        ...prev,
        supportRequest: activeRequest?._id || "",
      }));
    } catch (error) {
      console.log("Ошибка: ", error);
    }
  };

  const sendCreateNewSupportRequest = async () => {
    try {
      const createSupportRequest: CreateSupportRequest = {
        user: message.author,
        text: message.text,
      };

      const response = await fetch(
        `${VITE_BACKEND_URL}/api/client/support-requests/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createSupportRequest),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при создании запроса в поддержку: ${error}`);
      }
      const data: SupportRequest = await response.json();

      setMessage((prev) => ({
        ...prev,
        supportRequest: data._id,
      }));
    } catch (error) {
      throw new Error(`Ошибка при создании запроса в поддержку: ${error}`);
    }
  };

  const sendCreateNewMessage = async () => {
    console.log(message);
    try {
      const response = await fetch(
        `${VITE_BACKEND_URL}/api/common/support-requests/${activeSupportRequest._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Ошибка при отправке сообщения: ${error}`);
      }
    } catch (error) {
      throw new Error(`Ошибка при отправке сообщения: ${error}`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    activeSupportRequest.isActive
      ? sendCreateNewMessage()
      : sendCreateNewSupportRequest();
  };

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
      <form onSubmit={handleSubmit} className="common-form">
        <div className="form-group">
          <input
            type="text"
            id="message"
            value={message.text}
            onChange={(e) => {
              setMessage((prev) => ({ ...prev, text: e.target.value }));
            }}
            placeholder="Введите сообщение"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Отправить
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="chat-card">
      <h1 className="container-main-title">Поддержка</h1>

      {showChatView()}
      {showChatCardForm()}
    </div>
  );
};

export default ManagerChatCard;
