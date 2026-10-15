import Link from "next/link";

const principles = [
  {
    title: "Education, not diagnosis",
    body: "Aai explains common PCOS-related themes and helps you prepare questions. It never claims you have a condition, and it cannot replace a clinician.",
  },
  {
    title: "Your words, your pace",
    body: "Describe symptoms in everyday language  English, Hindi, Hinglish, or Kannada  typed or spoken in supported browsers. You decide what to share.",
  },
  {
    title: "Grounded in research",
    body: "Answers are built from a local research corpus with closed theme IDs. Optional local Ollama polish improves wording without sending your chat to cloud LLM APIs.",
  },
  {
    title: "Care stays with you",
    body: "Nearby hospital suggestions, weather comfort tips, and essentials links are helpers only. Emergency care always comes first when something feels urgent.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "You describe",
    body: "Share what you have noticed. Voice chips set the speech language so English stays Latin script when you want it to.",
  },
  {
    step: "02",
    title: "Aai retrieves",
    body: "Local RAG matches themes like cycles, acne, hair, mood, fatigue, weight, and fertility concerns  with clear non-diagnostic language.",
  },
  {
    step: "03",
    title: "You prepare",
    body: "Leave with educational themes, visit questions, and optional next steps like Find care  ready for a real conversation.",
  },
];

const weDont = [
  "Diagnose PCOS or any other condition",
  "Prescribe medicines or suggest dosages",
  "Book appointments or place product orders",
  "Store your chat in a permanent account or database",
  "Send core answers through cloud LLM APIs",
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">About Aai</p>
        <h1>Clear information. Your choices stay yours.</h1>
        <p>
          Aai is a calm symptom-education experience for PCOS-related
          questions. It helps you feel more prepared for care  not to make
          health decisions for you.
        </p>
      </header>

      <section className="about-bento" aria-label="What Aai stands for">
        {principles.map((item, index) => (
          <article
            className={`info-card${index === 0 ? " about-card-feature" : ""}`}
            key={item.title}
          >
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="learn-section" aria-labelledby="about-how-title">
        <header className="learn-section-intro">
          <p className="eyebrow">How it works</p>
          <h2 id="about-how-title">Three quiet steps</h2>
          <p>
            Built for a hackathon demo with a small team  local RAG on the
            machine, a thin API, and a Next.js front end.
          </p>
        </header>
        <ol className="about-steps">
          {howItWorks.map((item) => (
            <li key={item.step}>
              <span className="learn-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="learn-split" aria-label="Privacy and limits">
        <article className="info-card">
          <h2>Your privacy</h2>
          <p>
            This demo keeps conversation history in the current page session.
            Refreshing or leaving clears it. Location for weather and nearby
            care stays in the browser and is only used for those helpers.
          </p>
          <p className="about-aside">
            Do not share information you would not want included in a health
            conversation.
          </p>
        </article>
        <article className="info-card">
          <h2>What Aai does not do</h2>
          <ul>
            {weDont.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="about-grid about-grid-tight" aria-label="More context">
        <article className="info-card">
          <h2>Languages</h2>
          <p>
            Chat accepts English, Hindi, Hinglish, and Kannada. Mic language
            chips set browser speech recognition so you can speak in the
            language you chose.
          </p>
        </article>
        <article className="info-card">
          <h2>Who it is for</h2>
          <p>
            Anyone curious about PCOS-related symptoms who wants calm, plain
            language before talking to a clinician  especially when English is
            not the only language they think in.
          </p>
        </article>
        <article className="info-card emergency-card full-width">
          <h2>When something feels urgent</h2>
          <p>
            If you may faint, have heavy bleeding soaking pads hourly, severe
            pain, chest pain, or thoughts of self-harm  seek emergency care
            now. In India, ambulance: <strong>108</strong>. Do not wait for an
            online response.
          </p>
          <div className="learn-cta-row">
            <Link className="care-tip-link" href="/care">
              Find nearby hospitals →
            </Link>
            <Link className="care-tip-link" href="/chat">
              Start a calm conversation →
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
