import { DocumentStatus, ScheduleStatus } from '@prisma/client';

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function getScheduleStatus(input: {
  nextServiceDate?: Date | null;
  nextServiceOdometer?: number | null;
  currentOdometer: number;
}): ScheduleStatus {
  const now = new Date();
  const daysLeft = input.nextServiceDate
    ? Math.ceil((input.nextServiceDate.getTime() - now.getTime()) / 86_400_000)
    : Number.POSITIVE_INFINITY;
  const kmLeft =
    typeof input.nextServiceOdometer === 'number'
      ? input.nextServiceOdometer - input.currentOdometer
      : Number.POSITIVE_INFINITY;

  if (daysLeft < 0 || kmLeft < 0) return ScheduleStatus.OVERDUE;
  if (daysLeft <= 7 || kmLeft <= 500) return ScheduleStatus.DUE_SOON;
  return ScheduleStatus.SAFE;
}

export function getDocumentStatus(expiryDate?: Date | null): DocumentStatus {
  if (!expiryDate) return DocumentStatus.SAFE;
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / 86_400_000);
  if (daysLeft < 0) return DocumentStatus.EXPIRED;
  if (daysLeft <= 30) return DocumentStatus.DUE_SOON;
  return DocumentStatus.SAFE;
}

export function monthStartEnd(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}
