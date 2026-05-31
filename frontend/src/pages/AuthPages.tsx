import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Field, Input } from '../components/FormControls';
import { useAuth } from '../auth/AuthContext';

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <section className="w-full max-w-md rounded-lg border border-white bg-white/90 p-8 shadow-lift ring-1 ring-line/70 backdrop-blur">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand text-white shadow-soft">V</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Vehicle Service Tracker</p>
            <h1 className="text-2xl font-bold text-ink">{title}</h1>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Login gagal. Periksa email dan password.');
    }
  }

  return (
    <AuthShell title="Login">
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <Field label="Email">
          <Input placeholder="Masukkan email akun" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Password">
          <Input placeholder="Masukkan password akun" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error && <p className="text-sm text-rose">{error}</p>}
        <Button type="submit">Masuk</Button>
        <Link className="text-sm font-semibold text-brand" to="/register">
          Belum punya akun? Register
        </Link>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch {
      setError('Register gagal. Email mungkin sudah dipakai.');
    }
  }

  return (
    <AuthShell title="Register">
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <Field label="Nama lengkap">
          <Input placeholder="Masukkan nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Email">
          <Input placeholder="Masukkan email aktif" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </Field>
        <Field label="Password">
          <Input placeholder="Buat password minimal 8 karakter" type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </Field>
        {error && <p className="text-sm text-rose">{error}</p>}
        <Button type="submit">Buat Akun</Button>
        <Link className="text-sm font-semibold text-brand" to="/login">
          Sudah punya akun? Login
        </Link>
      </form>
    </AuthShell>
  );
}
