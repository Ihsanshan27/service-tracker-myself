import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { MaintenanceItem, Role, User, VehicleType } from '../api/types';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Button, Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

type AdminDashboard = {
  totalUsers: number;
  totalVehicles: number;
  totalServiceRecords: number;
  totalMaintenanceItems: number;
  totalTemplates: number;
  latestUsers: User[];
  vehicleTypeStats: { type: VehicleType; count: number }[];
};

type Template = { id: string; vehicleType: VehicleType; maintenanceItemId: string; intervalKm: number; intervalMonth: number; maintenanceItem?: MaintenanceItem };

const emptyItemForm = () => ({ name: '', description: '', defaultIntervalKm: 0, defaultIntervalMonth: 0, vehicleType: 'MOTOR' as VehicleType });
const emptyTemplateForm = () => ({ vehicleType: 'MOTOR' as VehicleType, maintenanceItemId: '', intervalKm: 0, intervalMonth: 0 });
const emptyUserForm = () => ({ name: '', email: '', password: '', role: 'USER' as Role });

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  useEffect(() => { api.get<AdminDashboard>('/dashboard/admin').then((res) => setData(res.data)); }, []);
  if (!data) return <div className="text-muted">Memuat dashboard admin...</div>;
  return (
    <>
      <PageHeader title="Admin Dashboard" />
      <div className="grid gap-4 md:grid-cols-5">
        <Card title="Users" value={data.totalUsers} />
        <Card title="Vehicles" value={data.totalVehicles} />
        <Card title="Records" value={data.totalServiceRecords} />
        <Card title="Items" value={data.totalMaintenanceItems} />
        <Card title="Templates" value={data.totalTemplates} />
      </div>
      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card title="User Terbaru">
          <div className="mt-4 divide-y divide-line">{data.latestUsers.map((user) => <div key={user.id} className="py-3 text-sm">{user.name} - {user.email}</div>)}</div>
        </Card>
        <Card title="Statistik Tipe Kendaraan">
          <div className="mt-4 divide-y divide-line">{data.vehicleTypeStats.map((row) => <div key={row.type} className="flex justify-between py-3 text-sm"><span>{row.type}</span><strong>{row.count}</strong></div>)}</div>
        </Card>
      </section>
    </>
  );
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(emptyUserForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [error, setError] = useState('');
  const load = () => api.get<User[]>('/users').then((res) => setUsers(res.data));
  useEffect(() => { void load(); }, []);

  function resetForm() {
    setForm(emptyUserForm());
    setEditingId(null);
    setError('');
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setError('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const payload = form.password ? form : { name: form.name, email: form.email, role: form.role };
        await api.patch(`/users/${editingId}`, payload);
      } else {
        await api.post('/users', form);
      }
      resetForm();
      load();
    } catch {
      setError('Gagal menyimpan user. Pastikan email belum terdaftar dan password minimal 8 karakter.');
    }
  }

  async function removeUser() {
    if (!deleteTarget) return;
    await api.delete(`/users/${deleteTarget.id}`);
    setDeleteTarget(null);
    load();
  }

  return (
    <>
      <PageHeader title="Admin Users" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card title={editingId ? 'Edit User' : 'Tambah User'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Nama user">
              <Input placeholder="Masukkan nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Email user">
              <Input type="email" placeholder="contoh@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label={editingId ? 'Password baru' : 'Password awal'}>
              <Input type="password" placeholder={editingId ? 'Kosongkan jika tidak ingin mengganti password' : 'Minimal 8 karakter'} minLength={editingId && !form.password ? undefined : 8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} />
            </Field>
            <Field label="Role user">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </Field>
            {error && <p className="text-sm text-rose">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update User' : 'Simpan User'}</Button>
              {editingId && <button type="button" onClick={resetForm} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">Batal</button>}
            </div>
          </form>
        </Card>
        <Card title="Daftar User">
          <div className="mt-4 divide-y divide-line">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span>{user.name} - {user.email}</span>
                <div className="flex items-center gap-3">
                  <strong>{user.role}</strong>
                  <button type="button" onClick={() => startEdit(user)} className="font-semibold text-brand">Edit</button>
                  <button type="button" onClick={() => setDeleteTarget(user)} className="font-semibold text-rose">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus user?"
        message={deleteTarget ? `User ${deleteTarget.name} akan dihapus.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeUser}
      />
    </>
  );
}

export function AdminMaintenanceItemsPage() {
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [form, setForm] = useState(emptyItemForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceItem | null>(null);
  const load = () => api.get<MaintenanceItem[]>('/maintenance-items').then((res) => setItems(res.data));
  useEffect(() => { void load(); }, []);

  function resetForm() {
    setForm(emptyItemForm());
    setEditingId(null);
  }

  function startEdit(item: MaintenanceItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description ?? '',
      defaultIntervalKm: item.defaultIntervalKm,
      defaultIntervalMonth: item.defaultIntervalMonth,
      vehicleType: item.vehicleType,
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/maintenance-items/${editingId}`, form);
    } else {
      await api.post('/maintenance-items', form);
    }
    resetForm();
    load();
  }

  async function removeItem() {
    if (!deleteTarget) return;
    await api.delete(`/maintenance-items/${deleteTarget.id}`);
    setDeleteTarget(null);
    load();
  }

  return (
    <>
      <PageHeader title="Maintenance Items" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card title={editingId ? 'Edit Item' : 'Tambah Item'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Nama item maintenance">
              <Input placeholder="Contoh: Ganti oli mesin" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Deskripsi item">
              <Input placeholder="Deskripsi singkat item maintenance" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Interval kilometer default">
              <Input type="number" placeholder="Contoh: 3000" value={form.defaultIntervalKm} onChange={(e) => setForm({ ...form, defaultIntervalKm: Number(e.target.value) })} />
            </Field>
            <Field label="Interval bulan default">
              <Input type="number" placeholder="Contoh: 3" value={form.defaultIntervalMonth} onChange={(e) => setForm({ ...form, defaultIntervalMonth: Number(e.target.value) })} />
            </Field>
            <Field label="Tipe kendaraan">
              <Select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value as VehicleType })}><option value="MOTOR">Motor</option><option value="MOBIL">Mobil</option></Select>
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update Item' : 'Simpan Item'}</Button>
              {editingId && <button type="button" onClick={resetForm} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">Batal</button>}
            </div>
          </form>
        </Card>
        <Card title="Daftar Item">
          <div className="mt-4 divide-y divide-line">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span><strong>{item.name}</strong> - {item.vehicleType} - {item.defaultIntervalKm} km / {item.defaultIntervalMonth} bulan</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(item)} className="font-semibold text-brand">Edit</button>
                  <button type="button" onClick={() => setDeleteTarget(item)} className="font-semibold text-rose">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus maintenance item?"
        message={deleteTarget ? `${deleteTarget.name} akan dihapus dari master data.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeItem}
      />
    </>
  );
}

export function AdminServiceTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [items, setItems] = useState<MaintenanceItem[]>([]);
  const [form, setForm] = useState(emptyTemplateForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);

  const load = () => {
    api.get<Template[]>('/service-templates').then((res) => setTemplates(res.data));
    api.get<MaintenanceItem[]>('/maintenance-items').then((res) => setItems(res.data));
  };
  useEffect(() => { void load(); }, []);

  function resetForm() {
    setForm(emptyTemplateForm());
    setEditingId(null);
  }

  function startEdit(template: Template) {
    setEditingId(template.id);
    setForm({
      vehicleType: template.vehicleType,
      maintenanceItemId: template.maintenanceItemId,
      intervalKm: template.intervalKm,
      intervalMonth: template.intervalMonth,
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.patch(`/service-templates/${editingId}`, form);
    } else {
      await api.post('/service-templates', form);
    }
    resetForm();
    load();
  }

  async function removeTemplate() {
    if (!deleteTarget) return;
    await api.delete(`/service-templates/${deleteTarget.id}`);
    setDeleteTarget(null);
    load();
  }

  return (
    <>
      <PageHeader title="Service Templates" />
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card title={editingId ? 'Edit Template Service' : 'Tambah Template Service'}>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Field label="Tipe kendaraan">
              <Select value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value as VehicleType })}>
                <option value="MOTOR">Motor</option>
                <option value="MOBIL">Mobil</option>
              </Select>
            </Field>
            <Field label="Maintenance item">
              <Select value={form.maintenanceItemId} onChange={(e) => setForm({ ...form, maintenanceItemId: e.target.value })} required>
                <option value="">Pilih maintenance item</option>
                {items.filter((item) => item.vehicleType === form.vehicleType).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Select>
            </Field>
            <Field label="Interval kilometer">
              <Input type="number" placeholder="Contoh: 3000" value={form.intervalKm} onChange={(e) => setForm({ ...form, intervalKm: Number(e.target.value) })} />
            </Field>
            <Field label="Interval bulan">
              <Input type="number" placeholder="Contoh: 3" value={form.intervalMonth} onChange={(e) => setForm({ ...form, intervalMonth: Number(e.target.value) })} />
            </Field>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Update Template' : 'Simpan Template'}</Button>
              {editingId && <button type="button" onClick={resetForm} className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-muted hover:text-ink">Batal</button>}
            </div>
          </form>
        </Card>
        <Card title="Template Service">
          <div className="mt-4 divide-y divide-line">
            {templates.map((tpl) => (
              <div key={tpl.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <span><strong>{tpl.maintenanceItem?.name}</strong> - {tpl.vehicleType} - {tpl.intervalKm} km / {tpl.intervalMonth} bulan</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(tpl)} className="font-semibold text-brand">Edit</button>
                  <button type="button" onClick={() => setDeleteTarget(tpl)} className="font-semibold text-rose">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus template service?"
        message={deleteTarget ? `${deleteTarget.maintenanceItem?.name ?? 'Template'} akan dihapus.` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={removeTemplate}
      />
    </>
  );
}
