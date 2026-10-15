import Link from "next/link";
import { HomeHero } from "@/components/home-hero";

const path = [
  {
    step: "01",
    title: "Describe",
    body: "Share what you have noticed in English, Hindi, Hinglish, or Kannada  typed or spoken.",
  },
  {
    step: "02",
    title: "Understand",
    body: "Get calm educational themes grounded in our research corpus, with clear non-diagnostic language.",
  },
  {
    step: "03",
    title: "Prepare",
    body: "Leave with clinician questions, nearby care options, and optional comfort essentials.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section className="home-promise" aria-labelledby="home-promise-title">
        <h2 id="home-promise-title">A private moment to make sense of symptoms.</h2>
        <p>
          Aai listens without judgement and helps you prepare for a real care
          conversation  not replace one.
        </p>
      </section>

      <section className="home-path" aria-labelledby="home-path-title">
        <header className="home-path-intro">
          <p className="eyebrow">How it works</p>
          <h2 id="home-path-title">Three quiet steps.</h2>
        </header>
        <ol className="home-path-list">
          {path.map((item) => (
            <li key={item.step}>
              <span className="home-path-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-continue" aria-labelledby="home-continue-title">
        <div className="home-continue-copy">
          <h2 id="home-continue-title">When you are ready, keep going.</h2>
          <p>
            Learn the themes, find hospitals near you, or start with whatever is
            on your mind today.
          </p>
        </div>
        <div className="home-continue-links">
          <Link href="/learn">Learn about PCOS themes</Link>
          <Link href="/care">Find care &amp; weather tips</Link>
          <Link href="/chat">Start a conversation</Link>
        </div>
      </section>

    </>
  );
}
