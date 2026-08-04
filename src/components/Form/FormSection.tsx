const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-surface border border-accent-muted rounded-xl p-6 mb-8 shadow-sm">
    <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
    {children}
  </section>
);

export default Section;
