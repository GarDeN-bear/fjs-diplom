import { useEffect, useState } from "react";
import ChatCard from "./ChatCard";
import {
  emptyCreateMessageRequest,
  emptySupportRequest,
  type CreateMessageRequest,
  type Message,
  type MessageResponce,
  type SupportRequest,
} from "../../utils/utils";
import { useAuth } from "../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/support/SupportContext";
import {
  getSupportRequestsRequest,
  getUnreadCountRequest,
  sendCreateNewMessageRequest,
  sendCreateNewSupportRequest,
  type GetSupportRequestsData,
  type GetUnreadCountRequestData,
  type SendCreateNewMessageRequestData,
  type SendCreateNewSupportRequestData,
} from "../api/support";

const ClientSupportCard = () => {
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
    const data: GetSupportRequestsData = {
      userId: user._id,
      role: "client",
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
    const unsubscribeNewSupportRequest = subscribeToEvent(
      "newSupportRequest",
      (data: SupportRequest) => {
        if (data.user === user._id) {
          setActiveSupportRequest(data);
          setLoading(false);
        }
      },
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
        userId: activeSupportRequest.user,
        roomId: activeSupportRequest._id,
      });
    }

    return () => {
      unsubscribeNewSupportRequest();
      unsubscribeNewMessage();
      unsubscribeMarkMessagesAsRead();
    };
  }, [activeSupportRequest, socket]);

  const handleSubmit = () => {
    activeSupportRequest.isActive
      ? sendCreateNewMessage()
      : sendCreateNewSupport();
  };

  const sendCreateNewSupport = async () => {
    const data: SendCreateNewSupportRequestData = {
      message: message,
      role: "client",
    };

    const resultData: SupportRequest | undefined =
      await sendCreateNewSupportRequest(data);

    setMessage((prev) => ({
      ...prev,
      supportRequest: resultData?._id || "",
    }));
  };

  const sendCreateNewMessage = async () => {
    const data: SendCreateNewMessageRequestData = {
      activeSupportRequestId: activeSupportRequest._id,
      message: message,
    };

    await sendCreateNewMessageRequest(data);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="support-card">
      <h1 className="container-main-title">Поддержка</h1>
      <ChatCard
        activeSupportRequest={activeSupportRequest}
        message={message}
        handleSubmit={handleSubmit}
        setMessage={setMessage}
      />
    </div>
  );
};

export default ClientSupportCard;
