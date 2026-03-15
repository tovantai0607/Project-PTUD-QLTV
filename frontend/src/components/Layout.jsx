import { Link, Outlet, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  // Danh sách các menu trên thanh điều hướng bên trái
  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/readers', label: 'Độc giả' },
    { path: '/books', label: 'Sách' }, // MỚI THÊM: Nút chuyển sang trang Sách
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar (Thanh menu màu đen bên trái) */}
      <div style={{ width: '250px', background: '#1a1a2e', color: 'white', padding: '20px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '20px', letterSpacing: '1px' }}>
          THƯ VIỆN
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item) => {
            // Kiểm tra xem trang hiện tại có đang được chọn không để bôi sáng màu lên
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '15px 25px',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  textDecoration: 'none',
                  background: isActive ? '#2563eb' : 'transparent', // Màu xanh khi đang ở trang đó
                  borderLeft: isActive ? '4px solid #60a5fa' : '4px solid transparent',
                  display: 'block',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content (Phần màn hình trắng rộng bên phải để hiển thị các trang) */}
      <div style={{ flex: 1, background: '#f8fafc', padding: '24px', overflowY: 'auto' }}>
        <Outlet />
      </div>

    </div>
  )
}