import { ReactNode } from 'react';

export function Card({ title, value, children }: { title: string; value?: ReactNode; children?: ReactNode }) {
  return (
    <section className="glass-panel p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <p className="text-sm font-semibold text-muted">{title}</p>
      {value !== undefined && <div className="mt-2 text-2xl font-bold text-ink">{value}</div>}
      {children}
    </section>
  );
}
