import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ServiceSchedule, Vehicle, VehicleDocument } from '../api/types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button, Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

type VehicleDetail = Vehicle & { schedules: ServiceSchedule[]; documents: VehicleDocument[] };

export function VehicleDetailPage() {
  const { id = '' } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [odometer, setOdometer] = useState(0);
  const [doc, setDoc] = useState({ vehicleId: id, documentType: 'STNK', documentName: '', expiryDate: '' });

  const load = () => api.get<VehicleDetail>(`/vehicles/${id}`).then((res) => { setVehicle(res.data); setOdometer(res.data.currentOdometer); });
  useEffect(() => { void load(); }, [id]);

  async function updateKm(e: FormEvent) {
    e.preventDefault();
    await api.patch(`/vehicles/${id}/odometer`, { odometer });
    load();
  }

  async function addDoc(e: FormEvent) {
    e.preventDefault();
    await api.post('/vehicle-documents', { ...doc, expiryDate: doc.expiryDate || undefined });
    setDoc({ ...doc, documentName: '', expiryDate: '' });
    load();
  }

  if (!vehicle) return <div className="text-muted">Memuat kendaraan...</div>;

  return (
    <>
      <PageHeader title={vehicle.vehicleName} />
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Tipe" value={vehicle.vehicleType} />
        <Card title="Model" value={`${vehicle.brand} ${vehicle.model}`} />
        <Card title="Plat" value={vehicle.plateNumber} />
        <Card title="Kilometer" value={`${vehicle.currentOdometer.toLocaleString('id-ID')} km`} />
      </div>
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="grid gap-4">
          <Card title="Update Kilometer">
            <form onSubmit={updateKm} className="mt-4 grid gap-3">
              <Field label="Kilometer terbaru">
                <Input type="number" placeholder="Contoh: 21500" value={odometer} onChange={(e) => setOdometer(Number(e.target.value))} />
              </Field>
              <Button type="submit">Update</Button>
            </form>
          </Card>
          <Card title="Tambah Dokumen">
            <form onSubmit={addDoc} className="mt-4 grid gap-3">
              <Field label="Jenis dokumen">
                <Select value={doc.documentType} onChange={(e) => setDoc({ ...doc, documentType: e.target.value })}>
                  {['STNK', 'PAJAK', 'ASURANSI', 'GARANSI', 'LAINNYA'].map((type) => <option key={type}>{type}</option>)}
                </Select>
              </Field>
              <Field label="Nama dokumen">
                <Input placeholder="Contoh: STNK utama" value={doc.documentName} onChange={(e) => setDoc({ ...doc, documentName: e.target.value })} required />
              </Field>
              <Field label="Tanggal expired dokumen">
                <Input title="Tanggal expired dokumen" type="date" placeholder="Tanggal expired dokumen" value={doc.expiryDate} onChange={(e) => setDoc({ ...doc, expiryDate: e.target.value })} />
              </Field>
              <Button type="submit">Simpan Dokumen</Button>
            </form>
          </Card>
        </div>
        <div className="grid gap-4">
          <Card title="Jadwal Service">
            <div className="mt-4 divide-y divide-line">
              {vehicle.schedules.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{item.maintenanceItem?.name}</p>
                    <p className="text-sm text-muted">{item.nextServiceDate?.slice(0, 10) ?? '-'} · {item.nextServiceOdometer?.toLocaleString('id-ID') ?? '-'} km</p>
                  </div>
                  <Badge value={item.status} />
                </div>
              ))}
            </div>
          </Card>
          <Card title="Dokumen">
            <div className="mt-4 divide-y divide-line">
              {vehicle.documents.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold">{item.documentName}</p>
                    <p className="text-sm text-muted">{item.documentType} · {item.expiryDate?.slice(0, 10) ?? '-'}</p>
                  </div>
                  <Badge value={item.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
