export default function AboutPage() {
  return (
    <div className="page-shell">
      <header className="page-intro">
        <p className="eyebrow">About Saheli</p>
        <h1>Clear information. Your choices stay yours.</h1>
        <p>
          Saheli is a symptom education experience focused on PCOS-related
          questions. It is here to help you feel more prepared—not to make
          health decisions for you.
        </p>
      </header>
      <section className="about-grid">
        <article className="info-card">
          <h2>Important to know</h2>
          <p>
            <strong>This is not a medical diagnosis.</strong> Saheli cannot
            diagnose a condition, assess your personal health, or replace advice
            from a qualified healthcare professional.
          </p>
        </article>
        <article className="info-card">
          <h2>Your privacy</h2>
          <p>
            This demo keeps conversation history in the current page session.
            Refreshing or leaving the page clears it. Do not share information
            you would not want included in a health conversation.
          </p>
        </article>
        <article className="info-card emergency-card full-width">
          <h2>When something feels urgent</h2>
          <p>
            If you are bleeding heavily, feel faint, or feel in immediate
            danger, seek urgent medical help now or contact your local emergency
            service. Do not wait for an online response.
          </p>
        </article>
      </section>
    </div>
  );
}
