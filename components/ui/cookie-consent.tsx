"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "pillcare-cookie-consent";

type ConsentValue = "accepted" | "necessary";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // localStorage may be unavailable in some contexts — silently ignore
    }
  }, []);

  function saveConsent(value: ConsentValue) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl sm:bottom-6 sm:left-6 sm:right-6"
          role="dialog"
          aria-label="Сповіщення про cookies"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-border/60 bg-background/90 p-4 shadow-2xl backdrop-blur-md sm:p-5">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Cookie className="h-4 w-4 text-primary" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-foreground">
                  Ми використовуємо cookies для коректної роботи додатку.{" "}
                  <span className="text-muted-foreground">
                    Детальніше у нашій{" "}
                  </span>
                  <Link
                    href="/cookies"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Політиці Cookies
                  </Link>
                  .
                </p>

                {/* Buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => saveConsent("accepted")}
                    className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Прийняти
                  </button>
                  <button
                    onClick={() => saveConsent("necessary")}
                    className="rounded-lg border border-border px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Тільки необхідні
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
