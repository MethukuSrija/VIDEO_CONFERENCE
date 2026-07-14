import { Loader2 } from "lucide-react";

export default function FullScreenLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}
