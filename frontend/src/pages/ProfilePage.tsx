import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Profile" />
      <Card title="Akun">
        <div className="mt-4 text-sm text-muted">
          <p>Nama: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>
      </Card>
    </>
  );
}
