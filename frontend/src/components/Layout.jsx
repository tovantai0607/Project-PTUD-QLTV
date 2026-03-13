import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 200,
          background: '#1a1a2e',
          color: '#eee',
          padding: '1rem 0',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link
            to="/"
            style={{ color: '#eee', padding: '8px 16px', textDecoration: 'none' }}
          >
            Dashboard
          </Link>
          <Link
            to="/readers"
            style={{ color: '#eee', padding: '8px 16px', textDecoration: 'none' }}
          >
            Độc giả
          </Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1rem', background: '#f5f5f5' }}>
        <Outlet />
      </main>
    </div>
  )
}
