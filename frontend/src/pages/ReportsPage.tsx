import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api/client';
import { ServiceRecord, Vehicle } from '../api/types';
import { Card } from '../components/Card';
import { Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

type Summary = { totalCost: number; totalRecords: number; records: ServiceRecord[] };
type ChartRow = { label: string; totalCost: number; count: number };

export function ReportsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<ChartRow[]>([]);
  const [byVehicle, setByVehicle] = useState<ChartRow[]>([]);
  const [byItem, setByItem] = useState<ChartRow[]>([]);
  const [filters, setFilters] = useState({ vehicleId: '', from: '', to: '' });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  useEffect(() => { api.get<Vehicle[]>('/vehicles').then((res) => setVehicles(res.data)); }, []);
  useEffect(() => {
    const suffix = query ? `?${query}` : '';
    api.get<Summary>(`/reports/service-cost${suffix}`).then((res) => setSummary(res.data));
    api.get<ChartRow[]>(`/reports/service-cost/monthly${suffix}`).then((res) => setMonthly(res.data));
    api.get<ChartRow[]>(`/reports/service-cost/by-vehicle${suffix}`).then((res) => setByVehicle(res.data));
    api.get<ChartRow[]>(`/reports/service-cost/by-maintenance-item${suffix}`).then((res) => setByItem(res.data));
  }, [query]);

  return (
    <>
      <PageHeader title="Reports" />
      <Card title="Filter Laporan">
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label="Kendaraan">
            <Select value={filters.vehicleId} onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}>
              <option value="">Semua kendaraan</option>
              {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName}</option>)}
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
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Total Biaya Service" value={`Rp ${(summary?.totalCost ?? 0).toLocaleString('id-ID')}`} />
        <Card title="Total Riwayat Service" value={summary?.totalRecords ?? 0} />
      </div>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Biaya Per Bulan">
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalCost" fill="#0891B2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Pengeluaran Terbaru">
          <div className="mt-4 divide-y divide-line">
            {summary?.records.map((record) => (
              <div key={record.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>{record.serviceDate.slice(0, 10)} - {record.vehicle?.vehicleName} - {record.maintenanceItem?.name}</span>
                <strong>Rp {Number(record.cost).toLocaleString('id-ID')}</strong>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Total Per Kendaraan">
          <div className="mt-4 divide-y divide-line">
            {byVehicle.map((row) => <div key={row.label} className="flex justify-between py-3 text-sm"><span>{row.label}</span><strong>Rp {row.totalCost.toLocaleString('id-ID')}</strong></div>)}
          </div>
        </Card>
        <Card title="Total Per Maintenance Item">
          <div className="mt-4 divide-y divide-line">
            {byItem.map((row) => <div key={row.label} className="flex justify-between py-3 text-sm"><span>{row.label}</span><strong>Rp {row.totalCost.toLocaleString('id-ID')}</strong></div>)}
          </div>
        </Card>
      </section>
    </>
  );
}
