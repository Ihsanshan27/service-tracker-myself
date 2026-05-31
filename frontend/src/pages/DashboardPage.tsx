import { AlertTriangle, Car, CheckCircle2, ReceiptText, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ServiceSchedule, VehicleDocument } from '../api/types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';

type Dashboard = {
  totalVehicles: number;
  totalServiceThisMonth: number;
  totalServiceCostThisMonth: number;
  dueSoonVehicles: ServiceSchedule[];
  overdueVehicles: ServiceSchedule[];
  documentReminders: VehicleDocument[];
  upcomingSchedules: ServiceSchedule[];
  healthScore: number;
  vehicleHealthScores: { vehicleId: string; vehicleName: string; score: number }[];
};

export function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get<Dashboard>('/dashboard/user').then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="text-muted">Memuat dashboard...</div>;

  return (
    <>
      <PageHeader title="User Dashboard" />
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Total Kendaraan">
          <div className="mt-3 flex items-end justify-between">
            <div className="text-3xl font-bold text-ink">{data.totalVehicles}</div>
            <Car className="text-brand" size={28} />
          </div>
        </Card>
        <Card title="Service Bulan Ini">
          <div className="mt-3 flex items-end justify-between">
            <div className="text-3xl font-bold text-ink">{data.totalServiceThisMonth}</div>
            <Wrench className="text-cyan" size={28} />
          </div>
        </Card>
        <Card title="Biaya Bulan Ini">
          <div className="mt-3 flex items-end justify-between">
            <div className="text-2xl font-bold text-ink">Rp {data.totalServiceCostThisMonth.toLocaleString('id-ID')}</div>
            <ReceiptText className="text-amber" size={28} />
          </div>
        </Card>
        <Card title="Health Score">
          <div className="mt-3 flex items-end justify-between">
            <div className="text-3xl font-bold text-ink">{data.healthScore}/100</div>
            {data.healthScore >= 80 ? <CheckCircle2 className="text-mint" size={28} /> : <AlertTriangle className="text-amber" size={28} />}
          </div>
        </Card>
      </div>
      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card title="Jadwal Service Terdekat">
          <div className="mt-4 overflow-x-auto">
            {data.upcomingSchedules.length === 0 ? (
              <EmptyState title="Belum ada jadwal service" />
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-muted"><tr><th className="py-2">Kendaraan</th><th>Service</th><th>Tanggal</th><th>Status</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {data.upcomingSchedules.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium">{item.vehicle?.vehicleName}</td>
                      <td className="py-3">{item.maintenanceItem?.name}</td>
                      <td className="py-3">{item.nextServiceDate?.slice(0, 10) ?? '-'}</td>
                      <td className="py-3"><Badge value={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
        <Card title="Reminder Dokumen">
          <div className="mt-4 grid gap-3">
            {data.documentReminders.length === 0 ? <EmptyState title="Tidak ada dokumen yang mendekati expired" /> : data.documentReminders.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-line bg-slate-50/70 p-3">
                <div>
                  <p className="font-semibold">{doc.documentName}</p>
                  <p className="text-sm text-muted">{doc.vehicle?.vehicleName} - {doc.documentType} - {doc.expiryDate?.slice(0, 10)}</p>
                </div>
                <Badge value={doc.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Health Score Per Kendaraan">
          <div className="mt-4 divide-y divide-line">
            {data.vehicleHealthScores.length === 0 ? <EmptyState title="Belum ada kendaraan" /> : data.vehicleHealthScores.map((vehicle) => (
              <div key={vehicle.vehicleId} className="flex justify-between py-3 text-sm">
                <span>{vehicle.vehicleName}</span>
                <strong>{vehicle.score}/100</strong>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
