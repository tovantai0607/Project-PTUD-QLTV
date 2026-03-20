import { useState, useEffect } from 'react'
import { getUsers } from '../../services/admin'
import { createUser } from '../../services/admin'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ username: '', password: '', full_name: '', role: 'librarian' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {

    try {
      const data = await getUsers()
      setUsers(data)
    } catch (e) {

      setError('Không tải được danh sách nhân viên.')
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError(null)
    setSuccess(null)

    if (!form.username.trim() || !form.password || !form.role) {
      setError('Vui lòng điền đầy đủ tên đăng nhập, mật khẩu và vai trò.')
      return
    }

    try {
      await createUser(form)
      setSuccess('Tạo nhân viên thành công!')
      setForm({ username: '', password: '', full_name: '', role: 'librarian' })
      loadUsers()
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Lỗi khi tạo nhân viên.')

    }
  }

  return (
    <div>

      <h1>Quản lý nhân viên</h1>
      <p>Quản lý danh sách nhân viên / tài khoản truy cập hệ thống.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <input name="username" value={form.username} onChange={handleChange} placeholder="Tên đăng nhập" style={{ flex: 1 }} />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mật khẩu" style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Họ tên" style={{ flex: 1 }} />
          <select name="role" value={form.role} onChange={handleChange} style={{ width: 200 }}>
            <option value="librarian">Librarian</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6 }}>
          Thêm nhân viên
        </button>
      </form>

      <h2>Danh sách nhân viên</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>ID</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Tên đăng nhập</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Họ tên</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{user.id}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{user.username}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{user.full_name || '-'}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{user.role}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: 8, textAlign: 'center' }}>
                Chưa có nhân viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}
