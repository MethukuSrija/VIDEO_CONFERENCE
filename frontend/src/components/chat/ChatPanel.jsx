import { useState, useEffect, useRef } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [aiMode, setAiMode] = useState(false);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
  const { token } = useAuthStore();

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8000/api/chat/ws/${roomId}?token=${token}`,
    );
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "message") setMessages((p) => [...p, data]);
      } catch {}
    };
    return () => ws.close();
  }, [roomId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current) return;
    if (aiMode) {
      wsRef.current.send(
        JSON.stringify({
          type: "ai_request",
          content: input,
          history: messages.slice(-10),
        }),
      );
    } else {
      wsRef.current.send(JSON.stringify({ type: "message", content: input }));
    }
    setInput("");
  };

  return (
    <div className="h-full flex flex-col text-white">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <button
          onClick={() => setAiMode(!aiMode)}
          className={`p-2 rounded-lg text-sm flex items-center gap-1 ${aiMode ? "bg-purple-600" : "bg-slate-700"}`}
        >
          <Sparkles className="w-4 h-4" /> AI
        </button>
      </div>
      {aiMode && (
        <div className="p-2 bg-purple-900/30 text-purple-300 text-xs text-center">
          ✨ AI mode active
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.is_ai_response ? "bg-purple-900/20 p-3 rounded-lg" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm flex-shrink-0">
              {m.user_name?.[0] || "🤖"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{m.user_name}</p>
              <p className="text-sm text-gray-200 break-words whitespace-pre-wrap">
                {m.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={send}
        className="p-4 border-t border-slate-700 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={aiMode ? "Ask AI..." : "Message..."}
          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg outline-none"
        />
        <button
          type="submit"
          className="p-2 bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
