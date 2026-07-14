import { useEffect, useState } from "react";
import { X, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { participantAPI } from "../../services/api";
import { useParams } from "react-router-dom";
import Avatar from "../common/Avatar";

export default function ParticipantsPanel() {
  const [participants, setParticipants] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    const load = () =>
      participantAPI
        .list(roomId)
        .then(setParticipants)
        .catch(() => {});
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [roomId]);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold">Participants ({participants.length})</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {participants.map((p) => (
          <div
            key={p.user_id}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg"
          >
            <Avatar name={p.name} src={p.picture} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-xs text-gray-400 truncate">{p.email}</p>
            </div>
            <div className="flex gap-1">
              {p.is_muted ? (
                <MicOff className="w-4 h-4 text-red-400" />
              ) : (
                <Mic className="w-4 h-4 text-green-400" />
              )}
              {p.is_video_off ? (
                <VideoOff className="w-4 h-4 text-red-400" />
              ) : (
                <Video className="w-4 h-4 text-green-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
