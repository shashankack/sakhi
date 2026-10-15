"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function HomeHero() {
  const reduce = useReducedMotion();
  const duration = reduce ? 0 : 0.7;

  return (
    <section className="home-hero" aria-label="Aai">
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-visual-wash" />
        <div className="hero-visual-bloom hero-visual-bloom-a" />
        <div className="hero-visual-bloom hero-visual-bloom-b" />
        <div className="hero-visual-grain" />
      </div>

      <div className="hero-stage">
        <motion.p
          className="hero-brand"
          initial={reduce ? false : { y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration, ease: easeOut }}
        >
          Aai<span className="hero-brand-dot">.</span>
        </motion.p>

        <motion.h1
          initial={reduce ? false : { y: 18 }}
          animate={{ y: 0 }}
          transition={{ delay: reduce ? 0 : 0.08, duration, ease: easeOut }}
        >
          Clarity for the questions you carry quietly.
        </motion.h1>

        <motion.p
          className="hero-copy"
          initial={reduce ? false : { y: 12 }}
          animate={{ y: 0 }}
          transition={{
            delay: reduce ? 0 : 0.14,
            duration: 0.65,
            ease: easeOut,
          }}
        >
          Educational guidance for PCOS-related symptoms in your words, at your
          pace. Never a diagnosis.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={reduce ? false : { y: 10 }}
          animate={{ y: 0 }}
          transition={{ delay: reduce ? 0 : 0.2, duration: 0.6, ease: easeOut }}
        >
          <Link className="button-primary" href="/chat">
            Ask Aai <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" href="/care">
            Find care nearby
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
