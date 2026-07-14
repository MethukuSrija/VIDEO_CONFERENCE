import { Link } from "react-router-dom";
import { Video, Brain, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-950 dark:to-slate-900">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Video className="w-8 h-8 text-primary-600" />
          <span className="text-2xl font-bold">LiveMeet</span>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Meetings, Reimagined with AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Crystal-clear video, AI assistant, collaborative whiteboard, and
          privacy-first design.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-lg"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-200 dark:bg-slate-800 rounded-lg text-lg"
          >
            Try Demo
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Video,
              title: "HD Video Calls",
              desc: "Up to 50 participants with screen sharing, virtual backgrounds, and noise suppression.",
            },
            {
              icon: Brain,
              title: "AI Copilot",
              desc: "Real-time Q&A, code generation, concept explanations, and meeting summaries.",
            },
            {
              icon: Shield,
              title: "Privacy First",
              desc: "No data stored on servers. Password-protected rooms. You own your data.",
            },
            {
              icon: Sparkles,
              title: "Smart Whiteboard",
              desc: "Collaborative drawing with Tldraw — like Miro, built in.",
            },
            {
              icon: Video,
              title: "HD Recording",
              desc: "Server-side recording with auto-generated AI summaries.",
            },
            {
              icon: Brain,
              title: "Reactions & Polls",
              desc: "Engage with emoji reactions, hand raise, and live polls.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg"
            >
              <f.icon className="w-10 h-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
