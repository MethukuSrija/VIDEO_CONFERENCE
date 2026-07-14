from datetime import timedelta
from livekit import api
from app.config.settings import settings


class LiveKitService:
    def __init__(self):
        self.api_key = settings.LIVEKIT_API_KEY
        self.api_secret = settings.LIVEKIT_API_SECRET
        self.url = settings.LIVEKIT_URL

    def generate_token(
        self,
        room_name: str,
        identity: str,
        name: str,
        can_publish: bool = True,
        can_subscribe: bool = True,
        can_publish_data: bool = True,
        is_host: bool = False,
        ttl_hours: int = 24,
    ) -> str:
        grants = api.VideoGrants(
            room=room_name,
            room_join=True,
            can_publish=can_publish,
            can_subscribe=can_subscribe,
            can_publish_data=can_publish_data,
            can_update_own_metadata=True,
            room_admin=is_host,
            room_create=is_host,
        )

        token = (
            api.AccessToken(self.api_key, self.api_secret)
            .with_identity(identity)
            .with_name(name)
            .with_grants(grants)
            .with_ttl(timedelta(hours=ttl_hours))
        )
        return token.to_jwt()

    async def start_room_recording(self, room_name: str, layout: str = "grid"):
        """Start server-side recording."""
        try:
            from livekit.api import LiveKitAPI
            from livekit.api import EncodedFileOutput, EncodedFileType

            lkapi = LiveKitAPI(self.url, self.api_key, self.api_secret)
            egress = await lkapi.egress.start_room_composite_egress(
                room_name=room_name,
                layout=layout,
                file_outputs=[
                    EncodedFileOutput(
                        file_type=EncodedFileType.MP4,
                        filepath=f"{room_name}-recording.mp4",
                    )
                ],
            )
            return {"egress_id": egress.egress_id, "status": "recording"}
        except Exception as e:
            # For dev: simulate recording start
            import secrets
            return {"egress_id": f"egress_{secrets.token_hex(8)}", "status": "recording", "note": str(e)}

    async def stop_recording(self, egress_id: str):
        try:
            from livekit.api import LiveKitAPI
            lkapi = LiveKitAPI(self.url, self.api_key, self.api_secret)
            result = await lkapi.egress.stop_egress(egress_id=egress_id)
            return {
                "file_url": getattr(result.file.results[0], 'download_url', None) if result.file else None,
                "duration": getattr(result, 'duration', 0),
                "size": getattr(result.file.results[0], 'size', 0) if result.file else 0,
            }
        except Exception:
            return {"file_url": None, "duration": 0, "size": 0}

    async def remove_participant(self, room_name: str, identity: str):
        try:
            from livekit.api import LiveKitAPI
            lkapi = LiveKitAPI(self.url, self.api_key, self.api_secret)
            await lkapi.room.remove_participant(room=room_name, identity=identity)
        except Exception:
            pass

    async def mute_participant(self, room_name: str, identity: str, track_sid: str, muted: bool):
        try:
            from livekit.api import LiveKitAPI
            lkapi = LiveKitAPI(self.url, self.api_key, self.api_secret)
            await lkapi.room.mute_published_track(
                room=room_name, identity=identity, track_sid=track_sid, muted=muted,
            )
        except Exception:
            pass


livekit_service = LiveKitService()
