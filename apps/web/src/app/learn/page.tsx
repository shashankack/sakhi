import Link from "next/link";

const fundamentals = [
  {
    number: "01",
    title: "Cycles can vary",
    body: "Periods that are less predictable can have many possible explanations. Stress, thyroid changes, medicines, pregnancy, and PCOS education topics are all discussed in care  not as a single answer from an app.",
    span: "wide",
  },
  {
    number: "02",
    title: "Symptoms can overlap",
    body: "Skin, hair, energy, mood, and weight changes can share more than one cause. One symptom alone does not tell you what is happening.",
    span: "",
  },
  {
    number: "03",
    title: "PCOS is one topic to learn about",
    body: "PCOS is a common hormone-related condition discussed in education. Learning about it can help you prepare questions  only a clinician can assess your situation.",
    span: "",
  },
];

const themes = [
  {
    id: "cycle_irregularity",
    title: "Irregular periods",
    body: "Late, skipped, or unpredictable cycles are a frequent reason people seek clarity. Education covers how ovulation patterns are discussed in PCOS materials  alongside other common explanations.",
  },
  {
    id: "hirsutism",
    title: "Facial or body hair",
    body: "New or thicker hair on the face, chest, or abdomen is often linked to androgen-related topics in PCOS education. Genetics, medicines, and other endocrine causes can look similar.",
  },
  {
    id: "acne",
    title: "Acne",
    body: "Breakouts along the jaw or chin are sometimes discussed with hormonal themes. Diet, stress, skincare, and medicines also matter  so care conversations stay open.",
  },
  {
    id: "weight_insulin",
    title: "Weight and hunger",
    body: "Some PCOS education notes insulin resistance and appetite changes. Thyroid health, sleep, stress, and medicines are common overlapping factors.",
  },
  {
    id: "mood",
    title: "Mood changes",
    body: "Irritability, low mood, or anxiety can travel with cycle shifts and chronic symptoms. Mental health support belongs in care, not as a self-label from chat.",
  },
  {
    id: "hair_loss",
    title: "Hair fall",
    body: "Thinning or excess shedding may be discussed with hormonal themes, iron status, thyroid, stress, or postpartum changes. Patterns over months help a clinician more than a single day.",
  },
  {
    id: "fatigue",
    title: "Fatigue",
    body: "Tiredness is common and non-specific. Sleep, nutrition, thyroid, anemia, mood, and chronic stress are frequent companions in education  not a diagnosis by themselves.",
  },
  {
    id: "fertility_concerns",
    title: "Trying to conceive",
    body: "Irregular ovulation is often part of fertility conversations in PCOS education. Timing, partner factors, and other causes belong with a clinician who knows your history.",
  },
];

const prepTips = [
  "Write when symptoms started and what changed recently.",
  "Note cycle length, medicines, and anything that helps or worsens symptoms.",
  "List questions you want answered  Aai can help you draft them in chat.",
  "Ask about other possible causes, not only PCOS.",
];

export default function LearnPage() {
  return (
    <div className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">Learn, without the overwhelm</p>
        <h1>A starting point for understanding PCOS.</h1>
        <p>
          Grounded ideas to help you make sense of common symptoms, explore
          themes Aai can discuss, and decide what you might want to ask next.
          This is education  never a diagnosis.
        </p>
      </header>

      <section className="learn-bento" aria-label="Core ideas">
        {fundamentals.map((topic) => (
          <article
            className={`learn-card${topic.span ? ` learn-card-${topic.span}` : ""}`}
            key={topic.number}
          >
            <span className="learn-number">{topic.number}</span>
            <h2>{topic.title}</h2>
            <p>{topic.body}</p>
          </article>
        ))}
      </section>

      <section className="learn-section" aria-labelledby="learn-themes-title">
        <header className="learn-section-intro">
          <p className="eyebrow">Themes Aai can discuss</p>
          <h2 id="learn-themes-title">What education covers here</h2>
          <p>
            These themes match the topics Aai retrieves from our research
            corpus. Use them as a map  not as a checklist to self-diagnose.
          </p>
        </header>
        <div className="learn-theme-grid">
          {themes.map((theme) => (
            <article className="learn-theme-card" key={theme.id}>
              <h3>{theme.title}</h3>
              <p>{theme.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="learn-section learn-split" aria-labelledby="learn-overlap-title">
        <article className="info-card">
          <h2 id="learn-overlap-title">Other explanations matter</h2>
          <p>
            Thyroid conditions, prolactin changes, medicines, pregnancy,
            nutritional gaps, and stress can mimic or sit alongside PCOS-related
            patterns. Good care usually explores more than one possibility.
          </p>
        </article>
        <article className="info-card">
          <h2>How to use Aai</h2>
          <ul>
            <li>Describe symptoms in English, Hindi, Hinglish, or Kannada.</li>
            <li>Read themes and questions as preparation  not a verdict.</li>
            <li>Use Find care for nearby hospitals when you are ready.</li>
            <li>Seek urgent help for red-flag symptoms right away.</li>
          </ul>
        </article>
      </section>

      <section className="learn-section" aria-labelledby="learn-prep-title">
        <article className="info-card full-width learn-prep">
          <h2 id="learn-prep-title">Prepare for a visit</h2>
          <p>
            A short note before you go can make the conversation calmer and more
            useful.
          </p>
          <ul>
            {prepTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <div className="learn-cta-row">
            <Link className="button-primary" href="/chat">
              Ask Aai <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/care">
              Find care nearby
            </Link>
          </div>
        </article>
      </section>

      <p className="learn-note">
        This information is general education and cannot tell you whether you
        have PCOS. A health professional can discuss symptoms in the context of
        your individual health.
      </p>
    </div>
  );
}
