import { useEffect, useState } from 'react'

import { createUser, getUsers } from '../../services/admin'

const initialForm = {
  username: '',
  password: '',
  full_name: '',
  role: 'librarian',
}

const tableHeaderStyle = {
  padding: 12,
  textAlign: 'left',
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Không thể tải danh sách nhân viên')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const createdUser = await createUser({
        username: form.username.trim(),
        password: form.password.trim(),
        full_name: form.full_name.trim(),
        role: form.role,
      })
      setUsers((prev) => [createdUser, ...prev])
      setForm(initialForm)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Không thể tạo nhân viên')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Quản lý nhân viên</h1>
        <button
          type="button"
          onClick={loadUsers}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          Làm mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'white',
            padding: 24,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0 }}>Thêm nhân viên</h2>
          <label>
            Tên đăng nhập
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
            />
          </label>
          <label>
            Mật khẩu
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
            />
          </label>
          <label>
            Họ tên
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
            />
          </label>
          <label>
            Vai trò
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
            >
              <option value="librarian">librarian</option>
              <option value="admin">admin</option>
            </select>
          </label>
          {error && <p style={{ margin: 0, color: 'red' }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 16px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Đang lưu...' : 'Tạo nhân viên'}
          </button>
        </form>

        <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>Danh sách nhân viên</h2>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a2e', color: '#eee' }}>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Tên đăng nhập</th>
                  <th style={tableHeaderStyle}>Họ tên</th>
                  <th style={tableHeaderStyle}>Vai trò</th>
                  <th style={tableHeaderStyle}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                      Chưa có nhân viên nào được tạo.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: 12 }}>{user.id}</td>
                      <td style={{ padding: 12 }}>{user.username}</td>
                      <td style={{ padding: 12 }}>{user.full_name || '---'}</td>
                      <td style={{ padding: 12 }}>{user.role}</td>
                      <td style={{ padding: 12 }}>{user.is_active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
