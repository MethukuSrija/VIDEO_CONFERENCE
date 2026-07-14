import { Track } from "livekit-client";
import { useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import Avatar from "../common/Avatar";

export default function VideoTile({ participant, isLocal = false }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const videoTrack = participant.getTrackPublication(
    Track.Source.Camera,
  )?.track;
  const audioTrack = participant.getTrackPublication(
    Track.Source.Microphone,
  )?.track;

  useEffect(() => {
    if (videoRef.current && videoTrack) videoTrack.attach(videoRef.current);
    return () => {
      videoTrack?.detach(videoRef.current);
    };
  }, [videoTrack]);

  useEffect(() => {
    if (audioRef.current && audioTrack && !isLocal)
      audioTrack.attach(audioRef.current);
    return () => {
      audioTrack?.detach(audioRef.current);
    };
  }, [audioTrack, isLocal]);

  const isMuted = !participant.isMicrophoneEnabled;
  const hasVideo = !!videoTrack;

  return (
    <div className="relative bg-slate-800 rounded-xl overflow-hidden aspect-video">
      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
          <Avatar name={participant.name || "User"} size="lg" />
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      {!isLocal && <audio ref={audioRef} autoPlay />}
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-sm flex items-center gap-2">
        {isMuted ? (
          <MicOff className="w-3 h-3 text-red-400" />
        ) : (
          <Mic className="w-3 h-3 text-green-400" />
        )}
        <span>{participant.name || (isLocal ? "You" : "Guest")}</span>
      </div>
      {isLocal && (
        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
          YOU
        </div>
      )}
    </div>
  );
}
