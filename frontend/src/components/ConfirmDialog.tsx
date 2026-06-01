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
    <div className="fixed inset-0 z-50 grid place-items-center bg-overlay/55 p-4 backdrop-blur-md">
      <section className="glass-panel w-full max-w-md p-6 shadow-lift">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <div className="mt-2 text-sm text-muted">{message}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="secondary-button">
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
