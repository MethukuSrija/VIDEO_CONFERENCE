import { Room, RoomEvent, Track } from "livekit-client";

export function createRoom(options = {}) {
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      videoCodec: "VP9",
    },
    ...options,
  });

  room.on(RoomEvent.ParticipantConnected, (participant) => {
    console.log("Participant connected:", participant.identity);
  });

  room.on(RoomEvent.ParticipantDisconnected, (participant) => {
    console.log("Participant disconnected:", participant.identity);
  });

  room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    console.log("Track subscribed:", track.kind, "from", participant.identity);
  });

  return room;
}

export { Room, RoomEvent, Track };
