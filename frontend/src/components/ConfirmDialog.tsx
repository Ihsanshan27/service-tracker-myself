import { ReactNode } from 'react';
import { Button } from './FormControls';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ open, title, message, confirmLabel = 'Hapus', onCancel, onConfirm }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-lg border border-white bg-white p-5 shadow-lift ring-1 ring-line">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <div className="mt-2 text-sm text-muted">{message}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">
            Batal
          </button>
          <Button type="button" onClick={onConfirm} className="bg-rose">
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
