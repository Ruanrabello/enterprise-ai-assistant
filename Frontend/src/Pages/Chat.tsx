import ChatWindow from "../Components/Chat/ChatWindow";
import { useParams } from "react-router-dom";

function Chat() {

  const { id } = useParams();

  return (
    <div className="h-full min-h-0">

      <ChatWindow conversaId={id} />

    </div>
  );
}

export default Chat;
