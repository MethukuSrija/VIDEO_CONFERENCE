from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from starlette.middleware.sessions import SessionMiddleware
from app.config.settings import settings
import os

from app.config.settings import settings
from app.config.logging import setup_logging
from app.config.database import engine, Base
from app.routes import auth, rooms, participants, chat, files, whiteboard, ai, recording
from app.websocket import chat_websocket, whiteboard_websocket
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.exceptions.handlers import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    general_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

setup_logging(debug=settings.DEBUG)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    os.makedirs(settings.RECORDING_STORAGE_PATH, exist_ok=True)
    os.makedirs(settings.FILE_UPLOAD_PATH, exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    print(f"✅ {settings.APP_NAME} started")
    yield
    await engine.dispose()


app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION, lifespan=lifespan,
              docs_url="/api/docs", redoc_url="/api/redoc")


app.add_middleware(SessionMiddleware,secret_key=settings.JWT_SECRET,)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(participants.router)
app.include_router(chat.router)
app.include_router(files.router)
app.include_router(whiteboard.router)
app.include_router(ai.router)
app.include_router(recording.router)


@app.websocket("/api/chat/ws/{room_id}")
async def chat_ws_route(websocket, room_id: int, token: str = None):
    await chat_websocket(websocket, room_id, token)


@app.websocket("/api/whiteboard/ws/{room_id}")
async def wb_ws_route(websocket, room_id: str, token: str = None):
    await whiteboard_websocket(websocket, room_id, token)


@app.get("/")
async def root():
    return {"app": settings.APP_NAME, "version": settings.APP_VERSION, "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
