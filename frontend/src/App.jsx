import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ReaderList from './pages/readers/ReaderList'
import ReaderForm from './pages/readers/ReaderForm'

// --- PHẦN CỦA THÀNH VIÊN 4 IMPORT THÊM 2 COMPONENT DƯỚI ĐÂY --- //
import ReportDashboard from './pages/admin/ReportDashboard' 
import UserManagement from './pages/admin/UserManagement'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="readers" element={<ReaderList />} />
          <Route path="readers/new" element={<ReaderForm />} />
          <Route path="readers/:id/edit" element={<ReaderForm />} />

          {/* ĐĂNG KÝ ROUTE CHO THÀNH VIÊN 4 */}
          <Route path="admin/reports" element={<ReportDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          {/* ------------------------------------------ */}
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
