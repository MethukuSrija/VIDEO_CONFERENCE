import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import VideoGrid from "./VideoGrid";
import MeetingControls from "./MeetingControls";
import { useMeeting } from "../../context/MeetingContext";
import ChatPanel from "../chat/ChatPanel";
import ParticipantsPanel from "../participants/ParticipantsPanel";
import Whiteboard from "../whiteboard/Whiteboard";
import AIBot from "../ai/AIBot";
import FileUpload from "../files/FileUpload";
import URLShare from "../panels/URLShare";
import notify from "../common/Toast";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

export default function MeetingRoom({ token, roomId, onLeave }) {
  const { activePanel } = useMeeting();

  return (
    <LiveKitRoom
      token={token}
      serverUrl={LIVEKIT_URL}
      video
      audio
      connect
      onDisconnected={() => {
        notify.info("Disconnected");
        onLeave();
      }}
      onError={(err) => notify.error(`Error: ${err.message}`)}
      style={{ height: "100vh" }}
    >
      <RoomAudioRenderer />
      <div className="h-full flex flex-col bg-slate-950">
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 relative">
            <VideoGrid />
          </div>
          {activePanel && (
            <div className="w-80 bg-slate-900 border-l border-slate-700">
              {activePanel === "chat" && <ChatPanel />}
              {activePanel === "participants" && <ParticipantsPanel />}
              {activePanel === "whiteboard" && (
                <Whiteboard onClose={() => {}} />
              )}
              {activePanel === "ai" && <AIBot />}
              {activePanel === "files" && <FileUpload />}
              {activePanel === "url" && <URLShare />}
            </div>
          )}
        </div>
        <MeetingControls />
      </div>
    </LiveKitRoom>
  );
}
