import { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import {
  emptyCreateMessageRequest,
  emptySupportRequest,
  type CreateMessageRequest,
  type MessageResponce,
  type SupportRequest,
} from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/support/SupportContext";
import {
  getSupportRequestsRequest,
  sendCreateNewMessageRequest,
  type GetSupportRequestsData,
  type SendCreateNewMessageRequestData,
} from "../api/support";

const ManagerChatCard = () => {
  const { userId } = useParams();

  const [activeSupportRequest, setActiveSupportRequest] =
    useState<SupportRequest>(emptySupportRequest);
  const [message, setMessage] = useState<CreateMessageRequest>(
    emptyCreateMessageRequest,
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

    const data: GetSupportRequestsData = {
      userId: user._id,
      role: "manager",
    };

    const resultData: SupportRequest[] | undefined =
      await getSupportRequestsRequest(data);

    const activeRequest: SupportRequest | undefined = resultData?.find(
      (req) => req.isActive,
    );

    setActiveSupportRequest(activeRequest || emptySupportRequest);
    setMessage((prev) => ({
      ...prev,
      supportRequest: activeRequest?._id || "",
    }));
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
      },
    );
    const unsubscribeMarkMessagesAsRead = subscribeToEvent(
      "markMessagesAsRead",
      (data: SupportRequest) => {
        if (activeSupportRequest._id === data._id) {
          setActiveSupportRequest(data);
          setLoading(false);
        }
      },
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
    const data: SendCreateNewMessageRequestData = {
      activeSupportRequestId: activeSupportRequest._id,
      message: message,
    };

    await sendCreateNewMessageRequest(data);
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
