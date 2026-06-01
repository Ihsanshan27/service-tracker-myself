import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-ink">
      <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-line/70 bg-panel px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 hover:border-line focus:border-brand focus:ring-4 focus:ring-brand/10 ${props.className ?? ''}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-line/70 bg-panel px-4 py-3 text-sm text-ink shadow-sm outline-none transition hover:border-line focus:border-brand focus:ring-4 focus:ring-brand/10 ${props.className ?? ''}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-2xl border border-line/70 bg-panel px-4 py-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/70 hover:border-line focus:border-brand focus:ring-4 focus:ring-brand/10 ${props.className ?? ''}`} />;
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[0.99] hover:bg-brand/90 focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:opacity-60 ${props.className ?? ''}`}
    />
  );
}
