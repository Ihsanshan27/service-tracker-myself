import { ScheduleStatus, DocumentStatus } from '../api/types';

const styles: Record<ScheduleStatus | DocumentStatus, string> = {
  SAFE: 'bg-mint/15 text-mint ring-mint/20',
  DUE_SOON: 'bg-amber/15 text-amber ring-amber/20',
  OVERDUE: 'bg-rose/15 text-rose ring-rose/20',
  EXPIRED: 'bg-rose/15 text-rose ring-rose/20',
};

export function Badge({ value }: { value: ScheduleStatus | DocumentStatus }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[value]}`}>{value}</span>;
}
