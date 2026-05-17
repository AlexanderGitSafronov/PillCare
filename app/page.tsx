"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell, Calendar, BarChart3, Wifi, Check,
  Pill, ArrowRight, Heart, Shield, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const featureIcons = [Bell, Calendar, BarChart3, Wifi];

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">PillCare</span>
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard">{t.landing.hero.cta}</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5" />
              {t.landing.hero.badge}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="text-gradient">{t.landing.hero.title}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.landing.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="gap-3 shadow-lg shadow-primary/30">
                <Link href="/dashboard">
                  {t.landing.hero.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href="#features">{t.landing.hero.ctaSecondary}</a>
              </Button>
            </div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto w-72 sm:w-80">
              <div className="bg-gradient-to-b from-primary/20 to-violet-500/10 rounded-[40px] p-2 shadow-2xl">
                <div className="bg-card rounded-[32px] overflow-hidden border border-border shadow-inner">
                  {/* Phone mockup content */}
                  <div className="bg-primary/5 px-5 py-6">
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">Доброго ранку</p>
                      <p className="font-bold text-lg">Сьогодні, 3 ліки 💊</p>
                    </div>
                    <div className="mt-4 bg-background rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Прогрес</span>
                        <span className="text-sm font-bold text-primary">67%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "67%" }}
                          transition={{ delay: 0.8, duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {[
                      { name: "Вітамін D3", time: "08:00", color: "#FF9500", taken: true },
                      { name: "Магній", time: "12:00", color: "#34C759", taken: true },
                      { name: "Омега-3", time: "20:00", color: "#4F8EF7", taken: false },
                    ].map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-3 bg-muted/50 rounded-xl p-3"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: med.color }}
                        >
                          {med.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{med.name}</p>
                          <p className="text-xs text-muted-foreground">{med.time}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${med.taken ? "bg-green-500" : "bg-muted border-2 border-border"}`}>
                          {med.taken && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-b from-primary/20 to-violet-500/20 rounded-full blur-2xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.h2
              variants={fadeIn}
              custom={0}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              {t.landing.features.title}
            </motion.h2>
            <motion.p
              variants={fadeIn}
              custom={1}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              {t.landing.features.subtitle}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.landing.features.items.map((feature, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={i}
                  className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Benefits
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-8">{t.landing.benefits.title}</h2>
              <ul className="space-y-4">
                {t.landing.benefits.items.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <span className="text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 flex justify-center"
            >
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {[
                  { icon: Shield, label: "Безпечно", color: "text-blue-500 bg-blue-50 dark:bg-blue-950" },
                  { icon: Bell, label: "Вчасно", color: "text-orange-500 bg-orange-50 dark:bg-orange-950" },
                  { icon: Heart, label: "Турботливо", color: "text-red-500 bg-red-50 dark:bg-red-950" },
                  { icon: Zap, label: "Швидко", color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-sm">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-violet-500/5 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.landing.cta.title}</h2>
            <p className="text-muted-foreground text-lg mb-8">{t.landing.cta.subtitle}</p>
            <Button asChild size="xl" className="gap-3 shadow-lg shadow-primary/30">
              <Link href="/dashboard">
                {t.landing.cta.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">PillCare</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 PillCare. Made with ❤️ for your health.
          </p>
        </div>
      </footer>
    </div>
  );
}
