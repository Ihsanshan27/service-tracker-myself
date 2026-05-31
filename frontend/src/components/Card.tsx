import { ReactNode } from 'react';

export function Card({ title, value, children }: { title: string; value?: ReactNode; children?: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/80 bg-white/90 p-5 shadow-soft ring-1 ring-line/70 backdrop-blur transition-shadow hover:shadow-lift">
      <p className="text-sm font-semibold text-muted">{title}</p>
      {value !== undefined && <div className="mt-2 text-2xl font-bold text-ink">{value}</div>}
      {children}
    </section>
  );
}
