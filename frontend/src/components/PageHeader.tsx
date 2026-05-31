import { ReactNode } from 'react';

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brand">Vehicle Service Tracker</p>
        <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
