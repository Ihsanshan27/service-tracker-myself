import { FormEvent, useState } from 'react';
import { Moon, SunMedium } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Field, Input } from '../components/FormControls';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-4">
      <button onClick={toggleTheme} className="secondary-button absolute right-4 top-4 z-10" aria-label={theme === 'light' ? 'Aktifkan night mode' : 'Aktifkan light mode'}>
        {theme === 'light' ? <Moon size={16} /> : <SunMedium size={16} />}
        {theme === 'light' ? 'Night' : 'Light'}
      </button>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand/10 to-transparent" />
      <section className="glass-panel w-full max-w-md p-8 shadow-lift">
        <div className="mb-7 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-soft">V</div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand">Vehicle Service Tracker</p>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          </div>
        </div>
        <p className="mb-6 max-w-sm text-sm leading-6 text-muted">Interface lebih bersih, fokus, dan nyaman dipakai siang maupun malam untuk mengelola kendaraan Anda.</p>
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
        <Link className="quiet-link" to="/register">
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
        <Link className="quiet-link" to="/login">
          Sudah punya akun? Login
        </Link>
      </form>
    </AuthShell>
  );
}
