import { Link } from "react-router-dom";
import { Shield, Home } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
      <div className="text-center">
        <Shield className="w-24 h-24 text-red-500 mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-red-500 mb-2">403</h1>
        <h2 className="text-2xl font-bold mb-2">Access Forbidden</h2>
        <p className="text-gray-500 mb-6">You don't have permission.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg"
        >
          <Home className="w-5 h-5" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
