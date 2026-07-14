import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
