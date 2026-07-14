import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLiveKit } from "../hooks/useLiveKit";
import { roomAPI } from "../services/api";
import MeetingRoom from "../components/meeting/MeetingRoom";
import WaitingRoom from "../components/meeting/WaitingRoom";
import FullScreenLoader from "../components/common/FullScreenLoader";

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomPassword, setRoomPassword] = useState("");
  const [room, setRoom] = useState(null);
  const [needsWaiting, setNeedsWaiting] = useState(true);

  const {
    token: lkToken,
    loading,
    error,
  } = useLiveKit(needsWaiting ? null : roomId, roomPassword);

  useEffect(() => {
    roomAPI
      .get(roomId)
      .then((data) => setRoom(data))
      .catch(() => navigate("/dashboard"));
  }, [roomId, navigate]);

  const handleLeave = () => {
    roomAPI.leave(roomId).catch(() => {});
    navigate("/dashboard");
  };

  // Debug Logs
  console.log("room =", room);
  console.log("loading =", loading);
  console.log("needsWaiting =", needsWaiting);
  console.log("lkToken =", lkToken);
  console.log("error =", error);

  // Wait until room information is loaded
  if (!room) {
    return <FullScreenLoader message="Loading room..." />;
  }

  // Show waiting room BEFORE trying to join LiveKit
  if (needsWaiting) {
    return (
      <WaitingRoom
        room={room}
        onJoin={(password) => {
          setRoomPassword(password);
          setNeedsWaiting(false);
        }}
        onCancel={() => navigate("/dashboard")}
      />
    );
  }

  // Waiting room finished, now fetch LiveKit token
  if (loading) {
    return <FullScreenLoader message="Connecting to meeting..." />;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!lkToken) {
    return <FullScreenLoader message="Getting video token..." />;
  }

  return <MeetingRoom token={lkToken} roomId={roomId} onLeave={handleLeave} />;
}
