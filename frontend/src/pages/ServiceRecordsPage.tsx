import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { MaintenanceItem, ServiceRecord, Vehicle } from '../api/types';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button, Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

type Workshop = { id: string; name: string };

const emptyRecordForm = () => ({
  vehicleId: '',
  maintenanceItemId: '',
  serviceDate: new Date().toISOString().slice(0, 10),
  odometerAtService: 0,
  workshopName: '',
  cost: 0,
  notes: '',
});

export function ServiceRecordsPage() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [form, setForm] = useState(emptyRecordForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceRecord | null>(null);
  const [filters, setFilters] = useState({ vehicleId: '', maintenanceItemId: '', from: '', to: '' });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const loadRecords = () => api.get<ServiceRecord[]>(`/service-records${query ? `?${query}` : ''}`).then((res) => setRecords(res.data));
  const loadOptions = () => {
    api.get<Vehicle[]>('/vehicles').then((res) => setVehicles(res.data));
    api.get<MaintenanceItem[]>('/maintenance-items').then((res) => setItems(res.data));
    api.get<Workshop[]>('/workshops').then((res) => setWorkshops(res.data));
  };

  useEffect(() => { loadOptions(); }, []);
  useEffect(() => { void loadRecords(); }, [query]);

  function resetForm() {
    setForm(emptyRecordForm());
    setEditingId(null);
  }

  function startEdit(record: ServiceRecord) {
    setEditingId(record.id);
    setForm({
      vehicleId: record.vehicleId,
      maintenanceItemId: record.maintenanceItemId,
      serviceDate: record.serviceDate.slice(0, 10),
      odometerAtService: record.odometerAtService,
      workshopName: record.workshopName,
      cost: Number(record.cost),
      notes: record.notes ?? '',
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/service-records/${editingId}`, form);
    } else {
      await api.post('/service-records', form);
    }
    resetForm();
    loadRecords();
  }

  async function removeRecord() {
    if (!deleteTarget) return;
    await api.delete(`/service-records/${deleteTarget.id}`);
    setDeleteTarget(null);
    loadRecords();
  }

  return (
    <>
      <PageHeader title="Service Records" />
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card title={editingId ? 'Edit Riwayat Service' : 'Tambah Riwayat Service'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Kendaraan yang diservice">
              <Select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} required>
                <option value="">Pilih kendaraan</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName}</option>)}
              </Select>
            </Field>
            <Field label="Jenis service">
              <Select value={form.maintenanceItemId} onChange={(e) => setForm({ ...form, maintenanceItemId: e.target.value })} required>
                <option value="">Pilih jenis service</option>
                {items.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.vehicleType}</option>)}
              </Select>
            </Field>
            <Field label="Tanggal service">
              <Input title="Tanggal service" type="date" value={form.serviceDate} onChange={(e) => setForm({ ...form, serviceDate: e.target.value })} required />
            </Field>
            <Field label="Odometer saat service">
              <Input type="number" placeholder="Contoh: 18000" value={form.odometerAtService} onChange={(e) => setForm({ ...form, odometerAtService: Number(e.target.value) })} required />
            </Field>
            <Field label="Bengkel">
              <Select value={form.workshopName} onChange={(e) => setForm({ ...form, workshopName: e.target.value })} required>
                <option value="">Pilih atau isi manual lewat daftar bengkel</option>
                {workshops.map((workshop) => <option key={workshop.id} value={workshop.name}>{workshop.name}</option>)}
              </Select>
            </Field>
            <Field label="Nama bengkel manual">
              <Input placeholder="Contoh: Bengkel Jaya Motor" value={form.workshopName} onChange={(e) => setForm({ ...form, workshopName: e.target.value })} required />
            </Field>
            <Field label="Biaya service">
              <Input type="number" placeholder="Contoh: 250000" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} required />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update Service' : 'Simpan Service'}</Button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">Batal</button>
              )}
            </div>
          </form>
        </Card>
        <div className="grid gap-4">
          <Card title="Filter Riwayat">
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <Field label="Kendaraan">
                <Select value={filters.vehicleId} onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}>
                  <option value="">Semua kendaraan</option>
                  {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName}</option>)}
                </Select>
              </Field>
              <Field label="Jenis service">
                <Select value={filters.maintenanceItemId} onChange={(e) => setFilters({ ...filters, maintenanceItemId: e.target.value })}>
                  <option value="">Semua service</option>
                  {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </Select>
              </Field>
              <Field label="Dari tanggal">
                <Input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
              </Field>
              <Field label="Sampai tanggal">
                <Input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
              </Field>
            </div>
          </Card>
          <Card title="Riwayat">
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted"><tr><th className="py-2">Tanggal</th><th>Kendaraan</th><th>Item</th><th>Bengkel</th><th>Biaya</th><th>Aksi</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="py-3">{record.serviceDate.slice(0, 10)}</td>
                      <td>{record.vehicle?.vehicleName}</td>
                      <td>{record.maintenanceItem?.name}</td>
                      <td>{record.workshopName}</td>
                      <td>Rp {Number(record.cost).toLocaleString('id-ID')}</td>
                      <td>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => startEdit(record)} className="font-semibold text-brand">Edit</button>
                          <button type="button" onClick={() => setDeleteTarget(record)} className="font-semibold text-rose">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus riwayat service?"
        message="Riwayat service ini akan dihapus dari laporan biaya."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeRecord}
      />
    </>
  );
}
