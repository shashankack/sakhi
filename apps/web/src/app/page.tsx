import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <p className="eyebrow">A little more clarity, at your pace</p>
          <h1>
            Your body has a story.
            <br />
            <em>Let&apos;s make sense of it.</em>
          </h1>
          <p className="hero-copy">
            A gentle place to learn about PCOS-related symptoms, find words for
            what you&apos;re feeling, and prepare for a conversation with a
            clinician.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="/chat">
              Start a conversation <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/learn">
              Explore the learning space
            </Link>
          </div>
          <p className="hero-note">
            No judgement. Just clear, educational information.
          </p>
        </div>
        <div className="hero-art" aria-hidden="true" />
      </section>
      <section className="home-band">
        <h2>Made for questions that don&apos;t always come easily.</h2>
        <p>
          Share symptoms in everyday language. Sakhi can offer general
          education and care conversation starters—not a diagnosis or a
          replacement for a health professional.
        </p>
      </section>
    </>
  );
}
