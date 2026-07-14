import { useState } from "react";
import { Video, Lock, Loader2 } from "lucide-react";
import { roomAPI } from "../../services/api";

export default function WaitingRoom({ room, onJoin, onCancel }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = () => {
    onJoin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold">Ready to join?</h2>
        </div>
        <h3 className="text-xl mb-2">{room.title}</h3>
        <p className="text-gray-400 text-sm mb-6">Room ID: {room.room_id}</p>

        {room.has_password && (
          <div className="mb-4">
            <label className="block text-sm mb-2">
              <Lock className="w-4 h-4 inline mr-1" /> Meeting Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg outline-none"
              placeholder="Enter password"
            />
          </div>
        )}

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Join Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
