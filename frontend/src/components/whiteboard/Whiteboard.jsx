import { useRef, useEffect, useState } from "react";
import { X, Eraser, Trash2, Download, Brush } from "lucide-react";

export default function Whiteboard({ onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX || e.touches?.[0]?.clientX) - r.left,
      y: (e.clientY || e.touches?.[0]?.clientY) - r.top,
    };
  };

  const start = (e) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
    lastPos.current = p;
  };
  const end = () => setIsDrawing(false);
  const clear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };
  const download = () => {
    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      <div className="p-3 bg-white border-b flex justify-between items-center flex-wrap gap-2">
        <h3 className="font-semibold">Whiteboard</h3>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(+e.target.value)}
            className="w-20"
          />
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded ${isEraser ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={clear}
            className="p-2 bg-red-100 text-red-600 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={download}
            className="p-2 bg-blue-100 text-blue-600 rounded"
          >
            <Download className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={end}
        className="flex-1 cursor-crosshair"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
