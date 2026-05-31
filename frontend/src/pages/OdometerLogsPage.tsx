import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { Vehicle } from '../api/types';
import { Card } from '../components/Card';
import { Button, Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

type OdometerLog = { id: string; odometer: number; recordedAt: string; notes?: string };
type ServiceEstimate = { scheduleId: string; maintenanceItemName: string; kmRemaining: number | null; estimatedDate: string | null };
type OdometerResponse = { logs: OdometerLog[]; averageKmPerDay: number; serviceEstimates: ServiceEstimate[] };

export function OdometerLogsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [logs, setLogs] = useState<OdometerLog[]>([]);
  const [estimates, setEstimates] = useState<ServiceEstimate[]>([]);
  const [average, setAverage] = useState(0);
  const [odometer, setOdometer] = useState(0);

  useEffect(() => { api.get<Vehicle[]>('/vehicles').then((res) => setVehicles(res.data)); }, []);

  async function loadLogs(id = vehicleId) {
    if (!id) return;
    const res = await api.get<OdometerResponse>(`/odometer-logs/vehicle/${id}`);
    setLogs(res.data.logs);
    setAverage(res.data.averageKmPerDay);
    setEstimates(res.data.serviceEstimates);
  }

  useEffect(() => { void loadLogs(vehicleId); }, [vehicleId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.post('/odometer-logs', { vehicleId, odometer, recordedAt: new Date().toISOString() });
    await loadLogs();
  }

  return (
    <>
      <PageHeader title="Odometer Log" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card title="Tambah Log Kilometer">
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Kendaraan">
              <Select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
                <option value="">Pilih kendaraan</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName}</option>)}
              </Select>
            </Field>
            <Field label="Kilometer terbaru">
              <Input type="number" placeholder="Contoh: 21500" value={odometer} onChange={(e) => setOdometer(Number(e.target.value))} required />
            </Field>
            <Button type="submit">Simpan Log</Button>
          </form>
        </Card>
        <div className="grid gap-4">
          <Card title={`Riwayat - rata-rata ${average} km/hari`}>
            <div className="mt-4 divide-y divide-line">
              {logs.map((log) => <div key={log.id} className="flex justify-between py-3"><span>{log.recordedAt.slice(0, 10)}</span><strong>{log.odometer.toLocaleString('id-ID')} km</strong></div>)}
            </div>
          </Card>
          <Card title="Estimasi Service Berdasarkan Pemakaian">
            <div className="mt-4 divide-y divide-line">
              {estimates.map((estimate) => (
                <div key={estimate.scheduleId} className="flex justify-between gap-4 py-3 text-sm">
                  <span>{estimate.maintenanceItemName}</span>
                  <strong>{estimate.estimatedDate ? estimate.estimatedDate.slice(0, 10) : '-'} / {estimate.kmRemaining ?? '-'} km lagi</strong>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
