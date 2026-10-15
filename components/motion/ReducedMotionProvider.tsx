"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ReducedMotionContextValue = {
  reduced: boolean;
  systemReduced: boolean;
  manualOverride: boolean | null;
  toggle: () => void;
};

const ReducedMotionContext = createContext<ReducedMotionContextValue | null>(null);
const STORAGE_KEY = "alin-reduce-motion";

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setSystemReduced(mq.matches);
    handler();
    mq.addEventListener("change", handler);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setManualOverride(true);
    else if (stored === "false") setManualOverride(false);

    return () => mq.removeEventListener("change", handler);
  }, []);

  const reduced = manualOverride ?? systemReduced;

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
  }, [reduced]);

  const toggle = useCallback(() => {
    const next = !reduced;
    setManualOverride(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, [reduced]);

  return (
    <ReducedMotionContext.Provider value={{ reduced, systemReduced, manualOverride, toggle }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  const ctx = useContext(ReducedMotionContext);
  if (!ctx) throw new Error("useReducedMotion must be used inside <ReducedMotionProvider>");
  return ctx;
}
