import { useState } from "react";
import { X, Upload, File, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token");
  const { roomId } = useParams();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File too large");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${API_URL}/api/files/upload?room_id=${roomId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        setFiles((p) => [
          ...p,
          { name: file.name, url: data.url, size: file.size },
        ]);
        toast.success("Uploaded!");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold">File Sharing</h3>
      </div>
      <div className="p-4">
        <label className="block">
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500">
            {uploading ? (
              <p>Uploading...</p>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Click to upload (max 25MB)
                </p>
              </>
            )}
          </div>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {files.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-8">No files yet</p>
        ) : (
          files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg"
            >
              <File className="w-5 h-5 text-primary-400" />
              <span className="flex-1 truncate text-sm">{f.name}</span>
              <span className="text-xs text-gray-500">
                {(f.size / 1024).toFixed(1)}KB
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
