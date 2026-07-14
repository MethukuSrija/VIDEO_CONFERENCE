import { useState } from "react";
import { X, Brain, Send } from "lucide-react";
import toast from "react-hot-toast";
import { aiAPI } from "../../services/api";
import { useParams } from "react-router-dom";

export default function AIBot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I am **MeetAI**. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { roomId } = useParams();

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    try {
      const data = await aiAPI.chat({ message: input, room_id: roomId });
      setMessages((m) => [...m, { role: "assistant", content: data.response }]);
    } catch {
      toast.error("AI error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-900/20 to-slate-900 text-white">
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold">MeetAI Assistant</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-primary-600" : "bg-purple-600"}`}
            >
              {m.role === "user" ? "👤" : "🤖"}
            </div>
            <div
              className={`p-3 rounded-2xl max-w-[85%] ${m.role === "user" ? "bg-primary-600" : "bg-slate-800"}`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-400 text-sm">Thinking...</p>}
      </div>
      <form
        onSubmit={send}
        className="p-4 border-t border-slate-700 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-purple-600 rounded-lg"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
