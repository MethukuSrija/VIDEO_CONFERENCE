import { useState } from "react";
import { X, Link as LinkIcon, Play, Youtube } from "lucide-react";
import toast from "react-hot-toast";

export default function URLShare() {
  const [url, setUrl] = useState("");
  const [activeUrl, setActiveUrl] = useState(null);

  const getEmbed = (url) => {
    if (url.includes("youtube.com/watch"))
      return `https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0]}`;
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]?.split("?")[0]}`;
    return url;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-500" /> Video Share
        </h3>
      </div>
      <div className="p-4 space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video URL"
          className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg outline-none"
        />
        <button
          onClick={() => {
            if (url) {
              setActiveUrl(url);
              toast.success("Playing!");
            }
          }}
          className="w-full py-2 bg-primary-600 rounded-lg flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" /> Play
        </button>
      </div>
      <div className="flex-1 p-2">
        {activeUrl ? (
          <iframe
            src={getEmbed(activeUrl)}
            className="w-full h-full rounded-lg"
            allow="autoplay"
            allowFullScreen
          />
        ) : (
          <div className="text-center text-gray-500 mt-12">
            <LinkIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Share a URL to play</p>
          </div>
        )}
      </div>
    </div>
  );
}
