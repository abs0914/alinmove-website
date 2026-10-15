export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="section">
      <div className="container-page max-w-3xl prose-invert">
        <div className="space-y-6 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_p]:text-alin-muted [&_p]:leading-7 [&_a]:text-alin-gold hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-alin-muted [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </article>
  );
}
