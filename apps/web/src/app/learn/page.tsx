const topics = [
  {
    number: "01",
    title: "Cycles can vary",
    body: "Periods that are less predictable can have many possible explanations. A clinician can help explore patterns alongside your health history.",
  },
  {
    number: "02",
    title: "Symptoms can overlap",
    body: "Changes in skin, hair, energy, or mood may have different causes and can overlap. One symptom alone does not tell you what is happening.",
  },
  {
    number: "03",
    title: "PCOS is one topic to learn about",
    body: "PCOS is a common hormone-related condition. Learning about it can help you prepare questions, but only a qualified clinician can assess your situation.",
  },
  {
    number: "04",
    title: "Your questions belong in care",
    body: "Noting when symptoms started, what has changed, and what matters most to you can make a healthcare conversation feel more focused.",
  },
];

export default function LearnPage() {
  return (
    <div className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">Learn, without the overwhelm</p>
        <h1>A starting point for understanding PCOS.</h1>
        <p>
          A few grounded ideas to help you make sense of common symptoms and
          decide what you might want to ask next.
        </p>
      </header>
      <section className="learn-grid" aria-label="PCOS education topics">
        {topics.map((topic) => (
          <article className="learn-card" key={topic.number}>
            <span className="learn-number">{topic.number}</span>
            <h2>{topic.title}</h2>
            <p>{topic.body}</p>
          </article>
        ))}
      </section>
      <p className="learn-note">
        This information is general education and cannot tell you whether you
        have PCOS. A health professional can discuss symptoms in the context of
        your individual health.
      </p>
    </div>
  );
}
