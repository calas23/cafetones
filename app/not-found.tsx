export default function NotFound() {
  return (
    <main>
      <section className="section" style={{ paddingTop: "calc(var(--header-height) + 3rem)" }}>
        <div className="container container--narrow text-center">
          <h1>Page introuvable</h1>
          <p className="text-muted" style={{ marginTop: "1rem" }}>
            La page que vous cherchez n&apos;existe pas ou n&apos;est plus disponible.
          </p>
          <a href="/" style={{ fontSize: "0.92rem" }}>← Retour à l&apos;accueil</a>
        </div>
      </section>
    </main>
  );
}
