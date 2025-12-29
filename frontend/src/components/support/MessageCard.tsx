interface MessageCardPrompt {
  isYour: boolean;
  isRead: boolean;
  messageData: string;
  messageId: string;
}

const MessageCard = ({
  isYour,
  isRead,
  messageData,
  messageId,
}: MessageCardPrompt) => {
  return (
    <div
      id={messageId}
      className={
        "message-card " + (isYour ? "message-card-right" : "message-card-left")
      }
    >
      <p>{messageData + (isYour ? `\n${isRead ? "✓✓" : "✓"}` : "")}</p>
    </div>
  );
};

export default MessageCard;
