"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Помилка входу"); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Помилка мережі");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => { setEmail("demo@pillcare.app"); setPassword("demo123"); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-md"
    >
      <div
        className="rounded-2xl border border-white/10 p-8"
        style={{ backdropFilter: "blur(20px)", background: "rgba(255,255,255,0.04)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}>💊</div>
          <span className="font-extrabold text-xl text-white">PillCare</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Вхід</h1>
        <p className="text-slate-400 text-sm mb-6">Введіть свої дані для входу</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Увійти <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Demo hint */}
        <button
          onClick={fillDemo}
          className="mt-3 w-full py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:border-white/20 hover:text-slate-300 transition-colors"
        >
          Спробувати демо
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Немає акаунту?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Зареєструватись
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
