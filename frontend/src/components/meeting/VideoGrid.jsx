import { useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import VideoTile from "./VideoTile";

export default function VideoGrid() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div
      className={`grid gap-2 p-2 h-full ${
        tracks.length <= 1
          ? "grid-cols-1"
          : tracks.length === 2
            ? "grid-cols-2"
            : "grid-cols-3"
      }`}
    >
      {tracks.map((t) => (
        <VideoTile
          key={t.publication.trackSid}
          participant={t.participant}
          isLocal={t.participant.isLocal}
        />
      ))}
    </div>
  );
}
