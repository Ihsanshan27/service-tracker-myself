import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Vehicle, VehicleType } from '../api/types';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Button, Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

const emptyVehicleForm = () => ({
  vehicleName: '',
  vehicleType: 'MOTOR' as VehicleType,
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plateNumber: '',
  currentOdometer: 0,
});

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState(emptyVehicleForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const load = () => api.get<Vehicle[]>('/vehicles').then((res) => setVehicles(res.data));
  useEffect(() => { void load(); }, []);

  function resetForm() {
    setForm(emptyVehicleForm());
    setEditingId(null);
  }

  function startEdit(vehicle: Vehicle) {
    setEditingId(vehicle.id);
    setForm({
      vehicleName: vehicle.vehicleName,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plateNumber: vehicle.plateNumber,
      currentOdometer: vehicle.currentOdometer,
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/vehicles/${editingId}`, form);
    } else {
      await api.post('/vehicles', form);
    }
    resetForm();
    load();
  }

  async function removeVehicle() {
    if (!deleteTarget) return;
    await api.delete(`/vehicles/${deleteTarget.id}`);
    setDeleteTarget(null);
    load();
  }

  return (
    <>
      <PageHeader title="Vehicles" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card title={editingId ? 'Edit Kendaraan' : 'Tambah Kendaraan'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Nama kendaraan">
              <Input placeholder="Contoh: Vario harian, Avanza keluarga" value={form.vehicleName} onChange={(e) => setForm({ ...form, vehicleName: e.target.value })} required />
            </Field>
            <Field label="Tipe kendaraan">
              <Select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value as VehicleType })}>
                <option value="MOTOR">Motor</option>
                <option value="MOBIL">Mobil</option>
              </Select>
            </Field>
            <Field label="Merek kendaraan">
              <Input placeholder="Contoh: Honda, Toyota" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </Field>
            <Field label="Model kendaraan">
              <Input placeholder="Contoh: Beat, Avanza" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </Field>
            <Field label="Tahun produksi">
              <Input type="number" placeholder="Contoh: 2021" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
            </Field>
            <Field label="Nomor plat">
              <Input placeholder="Contoh: B 1234 ABC" value={form.plateNumber} onChange={(e) => setForm({ ...form, plateNumber: e.target.value })} required />
            </Field>
            <Field label="Kilometer saat ini">
              <Input type="number" placeholder="Contoh: 15000" value={form.currentOdometer} onChange={(e) => setForm({ ...form, currentOdometer: Number(e.target.value) })} required />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update Kendaraan' : 'Simpan Kendaraan'}</Button>
              {editingId && (
                <button type="button" onClick={resetForm} className="secondary-button">
                  Batal
                </button>
              )}
            </div>
          </form>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.length === 0 ? <EmptyState title="Belum ada kendaraan" /> : vehicles.map((vehicle) => (
            <article key={vehicle.id} className="glass-panel p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-ink">{vehicle.vehicleName}</p>
                  <p className="text-sm text-muted">{vehicle.brand} {vehicle.model} - {vehicle.year}</p>
                </div>
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand">{vehicle.vehicleType}</span>
              </div>
              <div className="subtle-panel mt-5 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Kilometer</p>
                <p className="mt-1 text-lg font-bold text-ink">{vehicle.currentOdometer.toLocaleString('id-ID')} km</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/vehicles/${vehicle.id}`} className="secondary-button">Detail</Link>
                <button type="button" onClick={() => startEdit(vehicle)} className="secondary-button">Edit</button>
                <button type="button" onClick={() => setDeleteTarget(vehicle)} className="rounded-md border border-rose/30 px-3 py-2 text-sm font-semibold text-rose hover:bg-rose hover:text-white">Hapus</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus kendaraan?"
        message={deleteTarget ? `Kendaraan ${deleteTarget.vehicleName} dan data terkaitnya akan dihapus.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeVehicle}
      />
    </>
  );
}
