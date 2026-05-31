import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ServiceSchedule } from '../api/types';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';

export function ServiceSchedulesPage() {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>([]);
  useEffect(() => { api.get<ServiceSchedule[]>('/service-schedules').then((res) => setSchedules(res.data)); }, []);

  return (
    <>
      <PageHeader title="Service Schedules" />
      <Card title="Semua Jadwal">
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted"><tr><th className="py-2">Kendaraan</th><th>Service</th><th>Tanggal</th><th>KM</th><th>Status</th></tr></thead>
            <tbody className="divide-y divide-line">
              {schedules.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">{item.vehicle?.vehicleName}</td>
                  <td>{item.maintenanceItem?.name}</td>
                  <td>{item.nextServiceDate?.slice(0, 10) ?? '-'}</td>
                  <td>{item.nextServiceOdometer?.toLocaleString('id-ID') ?? '-'}</td>
                  <td><Badge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
