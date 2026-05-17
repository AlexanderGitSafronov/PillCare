"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Bell, Calendar, BarChart3, Wifi, Shield, Globe,
  Check, ArrowRight, Star, Lock, Zap, ChevronDown,
} from "lucide-react";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(current);
            if (current >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("uk-UA")}
      {suffix}
    </span>
  );
}

// ─── Floating Element ─────────────────────────────────────────────────────────
function FloatingIcon({
  emoji,
  style,
  delay = 0,
  duration = 4,
}: {
  emoji: string;
  style: React.CSSProperties;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className="absolute select-none pointer-events-none text-3xl"
      style={style}
      animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {emoji}
    </motion.div>
  );
}

// ─── Glassmorphism Card ───────────────────────────────────────────────────────
function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`rounded-2xl border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0.4]);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)" }}
    >
      {/* ── Mesh Gradient Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4F8EF7 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════ NAVBAR ═══ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
        style={{ backdropFilter: "blur(20px)", background: "rgba(2,6,23,0.7)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-lg"
              style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}
            >
              💊
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">PillCare</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Можливості", href: "#features" },
              { label: "Як це працює", href: "#how-it-works" },
              { label: "Відгуки", href: "#testimonials" },
              { label: "Ціни", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/40 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                boxShadow: "0 4px 20px rgba(79,142,247,0.35)",
              }}
            >
              Відкрити додаток
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              <div className="w-5 h-0.5 bg-white mb-1" />
              <div className="w-5 h-0.5 bg-white mb-1" />
              <div className="w-5 h-0.5 bg-white" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-white/10"
            style={{ background: "rgba(2,6,23,0.95)" }}
          >
            {[
              { label: "Можливості", href: "#features" },
              { label: "Як це працює", href: "#how-it-works" },
              { label: "Відгуки", href: "#testimonials" },
              { label: "Ціни", href: "#pricing" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-white py-2 text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}
            >
              Відкрити додаток
            </Link>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════ HERO ════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        {/* Floating Emojis */}
        <FloatingIcon emoji="💊" style={{ top: "18%", left: "8%" }} delay={0} duration={4.2} />
        <FloatingIcon emoji="🔔" style={{ top: "30%", right: "10%" }} delay={0.8} duration={3.8} />
        <FloatingIcon emoji="📅" style={{ bottom: "28%", left: "12%" }} delay={1.4} duration={4.6} />
        <FloatingIcon emoji="💉" style={{ top: "12%", right: "22%" }} delay={0.3} duration={5} />
        <FloatingIcon emoji="🏥" style={{ bottom: "20%", right: "8%" }} delay={2} duration={3.6} />
        <FloatingIcon emoji="❤️" style={{ top: "55%", left: "5%" }} delay={1} duration={4.8} />
        <FloatingIcon emoji="⏰" style={{ top: "8%", left: "40%" }} delay={0.5} duration={4} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-500/30"
            style={{ background: "rgba(79,142,247,0.1)", color: "#93C5FD" }}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Безкоштовний додаток для вашого здоров'я
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-white">Ніколи більше</span>
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #4F8EF7 0%, #7C3AED 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              не пропускай ліки
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            PillCare — розумний щоденник ліків з нагадуваннями, статистикою та
            підтримкою 3 мов. Турбуйся про своє здоров'я без зусиль.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                boxShadow: "0 8px 32px rgba(79,142,247,0.45)",
              }}
            >
              Розпочати безкоштовно
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-slate-200 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
            >
              Дивитись демо
              <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>

          {/* App Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative mx-auto"
            style={{ maxWidth: 380 }}
          >
            <div
              className="relative rounded-[32px] p-[2px] shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(79,142,247,0.6), rgba(124,58,237,0.6), rgba(6,182,212,0.4))",
                boxShadow: "0 30px 80px rgba(79,142,247,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="rounded-[30px] overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)" }}
              >
                {/* App Header */}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Доброго ранку, Олена 👋</p>
                      <p className="font-bold text-white text-lg">Сьогодні 3 ліки</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}
                    >
                      <span className="text-lg">💊</span>
                    </div>
                  </div>
                  {/* Progress */}
                  <div
                    className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-slate-400">Прогрес дня</span>
                      <span className="text-xs font-bold text-blue-400">67%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "67%" }}
                        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #4F8EF7, #7C3AED)" }}
                      />
                    </div>
                  </div>
                </div>
                {/* Medication List */}
                <div className="px-5 pb-5 space-y-2">
                  {[
                    { name: "Вітамін D3", time: "08:00", color: "#FF9500", taken: true, emoji: "🌅" },
                    { name: "Магній B6", time: "13:00", color: "#34C759", taken: true, emoji: "💪" },
                    { name: "Омега-3", time: "20:00", color: "#4F8EF7", taken: false, emoji: "🐟" },
                  ].map((med, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.12 }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                        style={{ background: `${med.color}25`, border: `1px solid ${med.color}50` }}
                      >
                        {med.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{med.name}</p>
                        <p className="text-xs text-slate-400">{med.time}</p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: med.taken ? "#22C55E" : "rgba(255,255,255,0.08)",
                          border: med.taken ? "none" : "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        {med.taken && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow under mockup */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(79,142,247,0.4), transparent 70%)", filter: "blur(20px)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════ STATS ═══ */}
      <section className="py-16 px-6 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 10000, suffix: "+", label: "Користувачів" },
            { value: 99, suffix: ".9%", label: "Uptime" },
            { value: 3, suffix: "", label: "Мови інтерфейсу" },
            { value: 100, suffix: "%", label: "Безкоштовно" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="text-4xl font-extrabold mb-1"
                style={{
                  background: "linear-gradient(90deg, #4F8EF7, #7C3AED)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════ FEATURES ═══════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-blue-500/30 text-blue-300"
              style={{ background: "rgba(79,142,247,0.1)" }}
            >
              МОЖЛИВОСТІ
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Все, що потрібно для{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #4F8EF7, #06B6D4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                вашого здоров'я
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Комплексний інструмент для відстеження прийому ліків із зручним
              інтерфейсом і потужною аналітикою.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Bell,
                title: "Розумні нагадування",
                desc: "Push-повідомлення в точний час. Ніколи не пропускай прийом ліків, навіть без інтернету.",
                color: "#4F8EF7",
                bg: "rgba(79,142,247,0.12)",
              },
              {
                icon: Calendar,
                title: "Гнучкий розклад",
                desc: "Щоденно, через день, у певні дні тижня — будь-який режим прийому під вашу потребу.",
                color: "#7C3AED",
                bg: "rgba(124,58,237,0.12)",
              },
              {
                icon: BarChart3,
                title: "Детальна статистика",
                desc: "Графіки дотримання розкладу, тижневі звіти та аналіз ваших звичок.",
                color: "#06B6D4",
                bg: "rgba(6,182,212,0.12)",
              },
              {
                icon: Wifi,
                title: "Офлайн-режим",
                desc: "PWA-технологія дозволяє використовувати додаток без інтернету — ваші дані завжди під рукою.",
                color: "#22C55E",
                bg: "rgba(34,197,94,0.12)",
              },
              {
                icon: Shield,
                title: "Повна безпека",
                desc: "Шифрування даних, GDPR-відповідність та суворий контроль доступу до вашої інформації.",
                color: "#F59E0B",
                bg: "rgba(245,158,11,0.12)",
              },
              {
                icon: Globe,
                title: "3 мови",
                desc: "Українська, англійська та польська — обирай мову інтерфейсу за потребою.",
                color: "#EC4899",
                bg: "rgba(236,72,153,0.12)",
              },
            ].map((feature, i) => (
              <GlassCard key={i} delay={i * 0.08}>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: feature.bg, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ HOW IT WORKS ═══════════ */}
      <section
        id="how-it-works"
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.015)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-violet-500/30 text-violet-300"
              style={{ background: "rgba(124,58,237,0.1)" }}
            >
              ЯК ЦЕ ПРАЦЮЄ
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Три прості кроки
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Почніть піклуватись про своє здоров'я за лічені хвилини.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-[27px] top-8 bottom-8 w-0.5 hidden sm:block"
              style={{ background: "linear-gradient(180deg, #4F8EF7, #7C3AED, #06B6D4)" }}
            />

            <div className="space-y-10">
              {[
                {
                  step: "01",
                  title: "Додай ліки",
                  desc: "Введи назву препарату, дозування та фото упаковки. Додаток запам'ятає все.",
                  emoji: "💊",
                  color: "#4F8EF7",
                },
                {
                  step: "02",
                  title: "Налаштуй розклад",
                  desc: "Вибери час, частоту і тривалість курсу. PillCare адаптується до будь-якого режиму.",
                  emoji: "📅",
                  color: "#7C3AED",
                },
                {
                  step: "03",
                  title: "Отримуй нагадування",
                  desc: "Push-сповіщення нагадають саме тоді, коли потрібно. Відмічай прийом одним дотиком.",
                  emoji: "🔔",
                  color: "#06B6D4",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-6 items-start"
                >
                  <div
                    className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}30, ${item.color}15)`,
                      border: `2px solid ${item.color}50`,
                    }}
                  >
                    {item.emoji}
                  </div>
                  <div
                    className="flex-1 rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ color: item.color, background: `${item.color}20` }}
                      >
                        Крок {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ APP PREVIEW ════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Чистий та інтуїтивний інтерфейс
            </h2>
            <p className="text-slate-400 text-lg">
              Розроблено з турботою про зручність кожного користувача.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "40px",
              boxShadow: "0 40px 100px rgba(79,142,247,0.2)",
            }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(2,6,23,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div
                  className="flex-1 mx-4 h-6 rounded-md flex items-center px-3 text-xs text-slate-500"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  pillcare.app/dashboard
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl" style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }} />
                    <div>
                      <div className="h-3 w-20 rounded-full bg-white/20 mb-1" />
                      <div className="h-2 w-14 rounded-full bg-white/10" />
                    </div>
                  </div>
                  {[80, 60, 45, 90].map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: `rgba(${i % 2 === 0 ? "79,142,247" : "124,58,237"},0.3)` }} />
                      <div className="flex-1">
                        <div className="h-2 rounded-full mb-1" style={{ width: `${w}%`, background: `rgba(${i % 2 === 0 ? "79,142,247" : "124,58,237"},0.5)` }} />
                        <div className="h-1.5 rounded-full w-1/2 bg-white/10" />
                      </div>
                      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: i < 3 ? "#22C55E" : "rgba(255,255,255,0.1)" }} />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl p-3" style={{ background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.2)" }}>
                    <div className="text-2xl font-bold text-blue-400">87%</div>
                    <div className="text-xs text-slate-400">Дотримання</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-xs text-slate-400">Цього місяця</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <div className="text-2xl font-bold text-violet-400">3</div>
                    <div className="text-xs text-slate-400">Сьогодні</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════ TESTIMONIALS ══════════════ */}
      <section
        id="testimonials"
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.015)" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-cyan-500/30 text-cyan-300"
              style={{ background: "rgba(6,182,212,0.1)" }}
            >
              ВІДГУКИ
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Що кажуть користувачі
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Олена Коваль",
                role: "Пацієнтка з діабетом",
                initials: "ОК",
                color: "#4F8EF7",
                text: "PillCare змінив моє життя. Я більше не боюсь пропустити інсулін — нагадування завжди вчасно. Інтерфейс настільки зручний, що розібралась за 5 хвилин!",
                stars: 5,
              },
              {
                name: "Михайло Петренко",
                role: "Кардіологічний хворий",
                initials: "МП",
                color: "#7C3AED",
                text: "Три роки п'ю серцеві препарати. З PillCare вперше маю повну статистику дотримання, яку показую лікарю. Офлайн-режим — це просто геніально.",
                stars: 5,
              },
              {
                name: "Ірина Мельник",
                role: "Мама двох дітей",
                initials: "ІМ",
                color: "#06B6D4",
                text: "Слідкую за ліками всієї сім'ї в одному додатку. Зручно, що є українська мова — бабуся теж розбирається. Дякую команді за безкоштовний доступ!",
                stars: 5,
              },
            ].map((t, i) => (
              <GlassCard key={i} delay={i * 0.12}>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ SECURITY ════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,58,237,0.08))",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.2), rgba(124,58,237,0.2))", border: "1px solid rgba(79,142,247,0.3)" }}
            >
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Ваші дані у безпеці</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Ми дотримуємось найвищих стандартів захисту персональних даних і медичної інформації.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: "🔒", label: "SSL шифрування" },
                { icon: "🇪🇺", label: "GDPR відповідність" },
                { icon: "🛡️", label: "End-to-end захист" },
                { icon: "🔐", label: "Безпечне зберігання" },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-300"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span>{badge.icon}</span>
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ PRICING ═════════════ */}
      <section
        id="pricing"
        className="py-24 px-6"
        style={{ background: "rgba(255,255,255,0.015)" }}
      >
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-green-500/30 text-green-300"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              ЦІНИ
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Просто і зрозуміло
            </h2>
            <p className="text-slate-400">Один тариф — повний доступ назавжди.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(79,142,247,0.12), rgba(124,58,237,0.12))",
              border: "1px solid rgba(79,142,247,0.3)",
              boxShadow: "0 30px 80px rgba(79,142,247,0.2)",
            }}
          >
            {/* Popular badge */}
            <div
              className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}
            >
              Єдиний план
            </div>

            <div className="p-8">
              <p className="text-slate-400 text-sm font-semibold mb-2">FREE FOREVER</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-6xl font-extrabold text-white">₀</span>
                <div>
                  <span className="text-2xl font-bold text-white">грн</span>
                  <p className="text-slate-400 text-xs">назавжди безкоштовно</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Необмежена кількість ліків",
                  "Push-нагадування 24/7",
                  "Детальна статистика та звіти",
                  "Офлайн-режим (PWA)",
                  "3 мови інтерфейсу",
                  "Захист даних GDPR",
                  "Оновлення та підтримка",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)" }}
                    >
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                  boxShadow: "0 8px 32px rgba(79,142,247,0.4)",
                }}
              >
                Почати безкоштовно
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-xs text-slate-500 mt-3">Реєстрація займає менше хвилини</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ CTA BANNER ═════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden text-center px-8 py-16"
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #4c1d95 50%, #164e63 100%)",
              boxShadow: "0 40px 100px rgba(79,142,247,0.3)",
            }}
          >
            {/* Mesh overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, #4F8EF7, transparent)", filter: "blur(40px)" }}
              />
              <div
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-30"
                style={{ background: "radial-gradient(circle, #7C3AED, transparent)", filter: "blur(40px)" }}
              />
            </div>

            <div className="relative z-10">
              <div className="text-5xl mb-4">💊</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Почніть сьогодні
              </h2>
              <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
                Приєднуйтесь до тисяч користувачів, які вже дбають про своє здоров'я разом із PillCare.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-bold text-slate-900 transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #ffffff, #e2e8f0)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                Відкрити PillCare
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ FOOTER ═════ */}
      <footer
        className="border-t border-white/5 pt-12 pb-8 px-6"
        style={{ background: "rgba(2,6,23,0.8)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "linear-gradient(135deg, #4F8EF7, #7C3AED)" }}
                >
                  💊
                </div>
                <span className="font-extrabold text-xl text-white">PillCare</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Розумний щоденник ліків для турботливих людей. Безкоштовно та назавжди.
              </p>
              <div className="flex gap-3 mt-5">
                {["🔒", "🇪🇺", "🛡️"].map((icon, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Навігація */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Навігація</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Можливості", href: "#features" },
                  { label: "Як це працює", href: "#how-it-works" },
                  { label: "Відгуки", href: "#testimonials" },
                  { label: "Ціни", href: "#pricing" },
                  { label: "Відкрити додаток", href: "/dashboard" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Юридичне */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Юридичне</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Конфіденційність", href: "/privacy" },
                  { label: "Умови використання", href: "/terms" },
                  { label: "Política cookies", href: "/cookies" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs">
              © 2025 PillCare. Усі права захищені. Зроблено з ❤️ для вашого здоров'я.
            </p>
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-slate-600" />
              <span className="text-slate-500 text-xs">Захищено SSL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
