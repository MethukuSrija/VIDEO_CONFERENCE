import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  MessageSquare,
  Users,
  Hand,
  Brain,
  FileText,
  FolderOpen,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { useLocalParticipant } from "@livekit/components-react";
import { useMeeting } from "../../context/MeetingContext";
import { useNavigate, useParams } from "react-router-dom";
import { roomAPI, recordingAPI } from "../../services/api";
import notify from "../common/Toast";

export default function MeetingControls() {
  const { localParticipant } = useLocalParticipant();
  const {
    activePanel,
    togglePanel,
    handRaised,
    setHandRaised,
    isRecording,
    setIsRecording,
  } = useMeeting();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const toggleMic = async () =>
    await localParticipant.setMicrophoneEnabled(
      !localParticipant.isMicrophoneEnabled,
    );
  const toggleCam = async () =>
    await localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  const toggleScreenShare = async () =>
    await localParticipant.setScreenShareEnabled(
      !localParticipant.isScreenShareEnabled,
    );
  const leave = async () => {
    await roomAPI.leave(roomId).catch(() => {});
    notify.info("You left");
    navigate("/dashboard");
  };

  const startRecording = async () => {
    try {
      await recordingAPI.start(roomId);
      setIsRecording(true);
      notify.success("Recording started");
    } catch {
      notify.error("Failed to start recording");
    }
  };

  const btn = "p-3 rounded-full text-white transition";
  const inactive = "bg-slate-700 hover:bg-slate-600";
  const active = "bg-primary-600";

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur p-4 flex justify-center gap-2 flex-wrap">
      <button
        onClick={toggleMic}
        className={`${btn} ${localParticipant.isMicrophoneEnabled ? inactive : "bg-red-600"}`}
      >
        {localParticipant.isMicrophoneEnabled ? (
          <Mic className="w-5 h-5" />
        ) : (
          <MicOff className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={toggleCam}
        className={`${btn} ${localParticipant.isCameraEnabled ? inactive : "bg-red-600"}`}
      >
        {Video ? <Video className="w-5 h-5" /> : null}
        {localParticipant.isCameraEnabled ? (
          <Video className="w-5 h-5" />
        ) : (
          <VideoOff className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={toggleScreenShare}
        className={`${btn} ${localParticipant.isScreenShareEnabled ? active : inactive}`}
      >
        <ScreenShare className="w-5 h-5" />
      </button>
      <button
        onClick={() => setHandRaised(!handRaised)}
        className={`${btn} ${handRaised ? "bg-yellow-500" : inactive}`}
      >
        <Hand className="w-5 h-5" />
      </button>
      <button
        onClick={startRecording}
        className={`${btn} ${isRecording ? "bg-red-600 animate-pulse" : inactive}`}
      >
        <span className="text-lg">●</span>
      </button>

      <div className="w-px bg-slate-600 mx-1" />

      <button
        onClick={() => togglePanel("chat")}
        className={`${btn} ${activePanel === "chat" ? active : inactive}`}
      >
        <MessageSquare className="w-5 h-5" />
      </button>
      <button
        onClick={() => togglePanel("participants")}
        className={`${btn} ${activePanel === "participants" ? active : inactive}`}
      >
        <Users className="w-5 h-5" />
      </button>
      <button
        onClick={() => togglePanel("whiteboard")}
        className={`${btn} ${activePanel === "whiteboard" ? active : inactive}`}
      >
        <FileText className="w-5 h-5" />
      </button>
      <button
        onClick={() => togglePanel("ai")}
        className={`${btn} ${activePanel === "ai" ? "bg-purple-600" : inactive}`}
      >
        <Brain className="w-5 h-5" />
      </button>
      <button
        onClick={() => togglePanel("files")}
        className={`${btn} ${activePanel === "files" ? active : inactive}`}
      >
        <FolderOpen className="w-5 h-5" />
      </button>
      <button
        onClick={() => togglePanel("url")}
        className={`${btn} ${activePanel === "url" ? active : inactive}`}
      >
        <LinkIcon className="w-5 h-5" />
      </button>

      <button onClick={leave} className={`${btn} bg-red-600 hover:bg-red-700`}>
        <PhoneOff className="w-5 h-5" />
      </button>
    </div>
  );
}
