interface MessageCardPrompt {
  isYour: boolean;
  isRead: boolean;
  messageData: string;
}

const MessageCard = ({ isYour, isRead, messageData }: MessageCardPrompt) => {
  return (
    <div
      className={
        "message-card " + (isYour ? "message-card-right" : "message-card-left")
      }
    >
      <p>{messageData + (isYour ? `\n${isRead ? "✓✓" : "✓"}` : "")}</p>
    </div>
  );
};

export default MessageCard;
