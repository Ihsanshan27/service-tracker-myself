import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DocumentType, Vehicle, VehicleDocument } from '../api/types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button, Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

const emptyDocForm = (vehicleId = '') => ({
  vehicleId,
  documentType: 'STNK' as DocumentType,
  documentName: '',
  documentNumber: '',
  expiryDate: '',
  fileUrl: '',
  notes: '',
});

export function DocumentsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [docs, setDocs] = useState<VehicleDocument[]>([]);
  const [form, setForm] = useState(emptyDocForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VehicleDocument | null>(null);

  useEffect(() => { api.get<Vehicle[]>('/vehicles').then((res) => setVehicles(res.data)); }, []);
  const loadDocs = () => {
    if (!vehicleId) {
      setDocs([]);
      return;
    }
    api.get<VehicleDocument[]>(`/vehicle-documents/vehicle/${vehicleId}`).then((res) => setDocs(res.data));
  };
  useEffect(loadDocs, [vehicleId]);

  function resetForm(nextVehicleId = vehicleId) {
    setForm(emptyDocForm(nextVehicleId));
    setEditingId(null);
  }

  function startEdit(doc: VehicleDocument) {
    setEditingId(doc.id);
    setForm({
      vehicleId: doc.vehicleId,
      documentType: doc.documentType,
      documentName: doc.documentName,
      documentNumber: doc.documentNumber ?? '',
      expiryDate: doc.expiryDate?.slice(0, 10) ?? '',
      fileUrl: doc.fileUrl ?? '',
      notes: doc.notes ?? '',
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const payload = { ...form, expiryDate: form.expiryDate || undefined };
    if (editingId) {
      await api.patch(`/vehicle-documents/${editingId}`, payload);
    } else {
      await api.post('/vehicle-documents', payload);
    }
    if (form.vehicleId !== vehicleId) setVehicleId(form.vehicleId);
    resetForm(form.vehicleId);
    loadDocs();
  }

  async function removeDoc() {
    if (!deleteTarget) return;
    await api.delete(`/vehicle-documents/${deleteTarget.id}`);
    setDeleteTarget(null);
    loadDocs();
  }

  return (
    <>
      <PageHeader title="Documents" />
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card title={editingId ? 'Edit Dokumen' : 'Tambah Dokumen'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Kendaraan">
              <Select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} required>
                <option value="">Pilih kendaraan</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName}</option>)}
              </Select>
            </Field>
            <Field label="Jenis dokumen">
              <Select value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value as DocumentType })}>
                {['STNK', 'PAJAK', 'ASURANSI', 'GARANSI', 'LAINNYA'].map((type) => <option key={type} value={type}>{type}</option>)}
              </Select>
            </Field>
            <Field label="Nama dokumen">
              <Input placeholder="Contoh: STNK utama" value={form.documentName} onChange={(e) => setForm({ ...form, documentName: e.target.value })} required />
            </Field>
            <Field label="Nomor dokumen">
              <Input placeholder="Nomor dokumen jika ada" value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} />
            </Field>
            <Field label="Tanggal expired">
              <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update Dokumen' : 'Simpan Dokumen'}</Button>
              {editingId && <button type="button" onClick={() => resetForm()} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">Batal</button>}
            </div>
          </form>
        </Card>
        <Card title="Dokumen Kendaraan">
          <div className="mt-4 max-w-sm">
            <Field label="Filter kendaraan">
              <Select value={vehicleId} onChange={(e) => { setVehicleId(e.target.value); resetForm(e.target.value); }}>
                <option value="">Pilih kendaraan</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName}</option>)}
              </Select>
            </Field>
          </div>
          <div className="mt-4 divide-y divide-line">
            {docs.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{doc.documentName}</p>
                  <p className="text-sm text-muted">{doc.documentType} - {doc.expiryDate?.slice(0, 10) ?? '-'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge value={doc.status} />
                  <button type="button" onClick={() => startEdit(doc)} className="text-sm font-semibold text-brand">Edit</button>
                  <button type="button" onClick={() => setDeleteTarget(doc)} className="text-sm font-semibold text-rose">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus dokumen?"
        message={deleteTarget ? `${deleteTarget.documentName} akan dihapus.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeDoc}
      />
    </>
  );
}
