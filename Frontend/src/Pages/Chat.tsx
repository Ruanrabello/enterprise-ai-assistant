import { useParams } from "react-router-dom";
import ChatWindow from "../Components/Chat/ChatWindow";

function Chat() {
  const { id } = useParams();

  return (
    <div className="h-full min-h-0">
      <ChatWindow conversaId={id ?? undefined} />
    </div>
  );
}

export default Chat;
