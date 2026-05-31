import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button, Field, Input } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

type Workshop = { id: string; name: string; address: string; phone: string; rating?: number; notes?: string };

const emptyWorkshopForm = () => ({ name: '', address: '', phone: '', rating: 5, notes: '' });

export function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [form, setForm] = useState(emptyWorkshopForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workshop | null>(null);
  const load = () => api.get<Workshop[]>('/workshops').then((res) => setWorkshops(res.data));
  useEffect(() => { void load(); }, []);

  function resetForm() {
    setForm(emptyWorkshopForm());
    setEditingId(null);
  }

  function startEdit(workshop: Workshop) {
    setEditingId(workshop.id);
    setForm({
      name: workshop.name,
      address: workshop.address,
      phone: workshop.phone,
      rating: workshop.rating ?? 5,
      notes: workshop.notes ?? '',
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/workshops/${editingId}`, form);
    } else {
      await api.post('/workshops', form);
    }
    resetForm();
    load();
  }

  async function removeWorkshop() {
    if (!deleteTarget) return;
    await api.delete(`/workshops/${deleteTarget.id}`);
    setDeleteTarget(null);
    load();
  }

  return (
    <>
      <PageHeader title="Workshops" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card title={editingId ? 'Edit Bengkel' : 'Tambah Bengkel'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Nama bengkel">
              <Input placeholder="Contoh: Bengkel Jaya Motor" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Alamat bengkel">
              <Input placeholder="Masukkan alamat lengkap bengkel" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </Field>
            <Field label="Nomor telepon">
              <Input placeholder="Contoh: 081234567890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </Field>
            <Field label="Rating bengkel">
              <Input type="number" min={1} max={5} placeholder="Angka 1 sampai 5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update Bengkel' : 'Simpan Bengkel'}</Button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">Batal</button>
              )}
            </div>
          </form>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {workshops.map((item) => (
            <Card key={item.id} title={item.name}>
              <p className="mt-2 text-sm text-muted">{item.address}</p>
              <p className="mt-1 text-sm font-semibold">{item.phone} - {item.rating ?? '-'} / 5</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-muted hover:text-ink">Edit</button>
                <button type="button" onClick={() => setDeleteTarget(item)} className="rounded-md border border-rose/30 px-3 py-2 text-sm font-semibold text-rose hover:bg-rose hover:text-white">Hapus</button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus bengkel?"
        message={deleteTarget ? `Bengkel ${deleteTarget.name} akan dihapus dari daftar langganan.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeWorkshop}
      />
    </>
  );
}
