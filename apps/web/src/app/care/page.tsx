"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, PhoneCall, Stethoscope } from "lucide-react";
import { EssentialsOffer } from "@/components/essentials-offer";
import { NearbyCarePanel } from "@/components/nearby-care";

const easeOut = [0.22, 1, 0.36, 1] as const;

const visitTips = [
  "Write what you noticed and when it started.",
  "Note cycle timing, medicines, and anything that makes symptoms better or worse.",
  "Bring questions  Aai can help you draft them in chat.",
  "Ask about other possible causes, not only PCOS.",
];

export default function CarePage() {
  const reduce = useReducedMotion();
  return (
    <section className="care-page">
      <div className="care-page-wrap">
        <motion.header
          className="care-page-heading"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <p className="eyebrow">When you are ready for next steps</p>
          <h1>Find care near you</h1>
          <p>
            Locate nearby hospitals and clinics on the map, then prepare a calm
            visit. Aai stays educational  never a diagnosis.
          </p>
        </motion.header>

        <motion.div
          className="care-page-stack"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.06, duration: 0.45, ease: easeOut }}
        >
          <NearbyCarePanel />
          <EssentialsOffer />
        </motion.div>

        <div className="care-page-grid">
          <article className="care-tip-panel">
            <header className="section-label">
              <PhoneCall aria-hidden="true" size={15} />
              Urgent help
            </header>
            <p>
              If you may faint, have heavy bleeding soaking pads hourly, severe
              pain, chest pain, or thoughts of self-harm  seek emergency care
              now.
            </p>
            <p className="care-tip-emphasis">
              In India, ambulance: <strong>108</strong>
            </p>
          </article>

          <article className="care-tip-panel">
            <header className="section-label">
              <ClipboardList aria-hidden="true" size={15} />
              Prepare for a visit
            </header>
            <ul>
              {visitTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <Link className="care-tip-link" href="/chat">
              Ask Aai to draft questions →
            </Link>
          </article>

          <article className="care-tip-panel">
            <header className="section-label">
              <Stethoscope aria-hidden="true" size={15} />
              What to expect
            </header>
            <p>
              A GP or gynecologist may ask about cycles, hair or skin changes,
              weight, mood, and family history. Many patterns have more than one
              possible explanation.
            </p>
            <Link className="care-tip-link" href="/learn">
              Browse education themes →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
