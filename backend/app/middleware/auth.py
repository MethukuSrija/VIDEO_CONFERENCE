from fastapi import HTTPException
from fastapi.security import HTTPBearer
from app.utils.jwt import decode_token


class JWTBearer(HTTPBearer):
    async def __call__(self, request):
        credentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid auth")
        if not decode_token(credentials.credentials):
            raise HTTPException(status_code=403, detail="Invalid or expired token")
        return credentials
