"use client";

import { useEffect } from "react";
import { startScrollReveal } from "./scroll-reveal.mjs";

export default function ScrollReveal() {
  useEffect(() => {
    try { return startScrollReveal(window, document); }
    catch { return undefined; } // A browser failure must not break page content.
  }, []);
  return null;
}
