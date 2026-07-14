import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Video,
  Plus,
  LogOut,
  Copy,
  Users,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import { roomAPI } from "../services/api";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [newRoom, setNewRoom] = useState({ title: "", password: "" });

  useEffect(() => {
    roomAPI
      .list()
      .then(setRooms)
      .catch(() => toast.error("Failed to load"));
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const data = await roomAPI.create({
        title: newRoom.title,
        password: newRoom.password || null,
      });
      toast.success("Meeting created!");
      navigate(`/room/${data.room_id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create");
    }
  };

  const joinByCode = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    try {
      await roomAPI.join(joinCode, { password: joinPassword });
      navigate(`/room/${joinCode}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to join");
    }
  };

  const copyLink = (roomId) => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-7 h-7 text-primary-600" />
          <span className="text-xl font-bold">LiveMeet</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/meetings" className="text-sm hover:underline">
            History
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          {user?.picture && (
            <img src={user.picture} className="w-8 h-8 rounded-full" />
          )}
          <span className="text-sm">{user?.name}</span>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="p-6 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl hover:shadow-lg flex items-center gap-4 text-left"
          >
            <Plus className="w-8 h-8" />
            <div>
              <div className="text-lg font-bold">Create New Meeting</div>
              <div className="text-sm opacity-90">Start instantly</div>
            </div>
          </button>

          <form
            onSubmit={joinByCode}
            className="p-6 bg-white dark:bg-slate-800 rounded-2xl flex flex-col md:flex-row items-stretch gap-2"
          >
            <input
              type="text"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="password"
              placeholder="Password (optional)"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              className="md:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Join
            </button>
          </form>
        </div>

        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create New Meeting</h3>
              <form onSubmit={createRoom} className="space-y-4">
                <input
                  type="text"
                  placeholder="Meeting title"
                  value={newRoom.title}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password (optional)"
                  value={newRoom.password}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, password: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Your Meetings</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {rooms.length === 0 && (
            <p className="col-span-3 text-center py-12 text-gray-500">
              No meetings yet. Create one!
            </p>
          )}
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{room.title}</h3>
                {room.is_live && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Code:{" "}
                <span className="font-mono">
                  {room.room_id.substring(0, 8)}...
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/room/${room.room_id}`)}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Start
                </button>
                <button
                  onClick={() => copyLink(room.room_id)}
                  className="px-3 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
