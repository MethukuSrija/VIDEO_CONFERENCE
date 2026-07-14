import toast from "react-hot-toast";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

const variants = {
  success: { icon: CheckCircle, className: "bg-green-600" },
  error: { icon: XCircle, className: "bg-red-600" },
  info: { icon: Info, className: "bg-blue-600" },
  warning: { icon: AlertTriangle, className: "bg-yellow-600" },
};

const showToast = (message, type = "info", duration = 3000) => {
  const { icon: Icon, className } = variants[type] || variants.info;
  toast.custom(
    (t) => (
      <div
        className={`${className} ${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full text-white shadow-lg rounded-lg flex items-center gap-3 p-4`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        <p className="flex-1">{message}</p>
      </div>
    ),
    { duration },
  );
};

const notify = {
  success: (msg) => showToast(msg, "success"),
  error: (msg) => showToast(msg, "error"),
  info: (msg) => showToast(msg, "info"),
  warning: (msg) => showToast(msg, "warning"),
};

export default notify;
