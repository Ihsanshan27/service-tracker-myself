import { ScheduleStatus, DocumentStatus } from '../api/types';

const styles: Record<ScheduleStatus | DocumentStatus, string> = {
  SAFE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  DUE_SOON: 'bg-amber-50 text-amber-800 ring-amber-200',
  OVERDUE: 'bg-rose-50 text-rose-700 ring-rose-200',
  EXPIRED: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export function Badge({ value }: { value: ScheduleStatus | DocumentStatus }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[value]}`}>{value}</span>;
}
