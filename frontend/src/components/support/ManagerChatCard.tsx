import { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import {
  emptyCreateMessageRequest,
  emptySupportRequest,
  VITE_BACKEND_URL,
  type CreateMessageRequest,
  type MessageResponce,
  type SupportRequest,
} from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/support/SupportContext";

const ManagerChatCard = () => {
  const { userId } = useParams();

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
    if (!user._id) navigate("/");
    setMessage((prev) => ({ ...prev, author: user._id }));

    fetchChat().finally(() => setLoading(false));
  }, [user]);

  const fetchChat = async () => {
    if (!userId) return;

    try {
      const url = new URL(`${VITE_BACKEND_URL}/api/manager/support-requests`);
      url.searchParams.append("user", userId);
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

  useEffect(() => {
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
    const unsubscribeMarkMessagesAsRead = subscribeToEvent(
      "markMessagesAsRead",
      (data: SupportRequest) => {
        if (activeSupportRequest._id === data._id) {
          setActiveSupportRequest(data);
          setLoading(false);
        }
      }
    );

    if (
      activeSupportRequest._id.length > 0 &&
      activeSupportRequest.user.length > 0
    ) {
      socket?.emit("joinClientToRoom", {
        userId: user._id,
        roomId: activeSupportRequest._id,
      });
    }

    return () => {
      unsubscribeNewMessage();
      unsubscribeMarkMessagesAsRead();
    };
  }, [activeSupportRequest, socket, userId]);

  const handleSubmit = () => {
    sendCreateNewMessage();
  };

  const sendCreateNewMessage = async () => {
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

  const closeSupportRequest = async () => {};

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="support-card">
      <h1 className="container-main-title">Поддержка</h1>
      <ChatCard
        activeSupportRequest={activeSupportRequest}
        message={message}
        handleSubmit={handleSubmit}
        setMessage={setMessage}
        closeSupportRequest={closeSupportRequest}
      />
    </div>
  );
};

export default ManagerChatCard;
