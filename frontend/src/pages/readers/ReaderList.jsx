import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getReaders, deleteReader } from '../../services/readers'

export default function ReaderList() {
  const [readers, setReaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getReaders(search ? { search } : {})
      setReaders(data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Lỗi tải danh sách')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa độc giả "${name}"?`)) return
    try {
      await deleteReader(id)
      setReaders((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      alert(e.response?.data?.detail || e.message || 'Không thể xóa')
    }
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('vi-VN') : ''

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách độc giả</h1>
        <Link
          to="/readers/new"
          style={{
            padding: '8px 16px',
            background: '#2563eb',
            color: 'white',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Thêm độc giả
        </Link>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Tìm theo tên hoặc lớp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 12px', width: 280, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #ccc' }}>
          Tìm
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Đang tải...</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ background: '#1a1a2e', color: '#eee' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Mã độc giả</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Họ tên</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Lớp</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Ngày sinh</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Giới tính</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {readers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                  Chưa có độc giả nào. Nhấn "Thêm độc giả" để thêm.
                </td>
              </tr>
            ) : (
              readers.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>{r.id}</td>
                  <td style={{ padding: 12 }}>{r.full_name}</td>
                  <td style={{ padding: 12 }}>{r.class_name}</td>
                  <td style={{ padding: 12 }}>{formatDate(r.date_of_birth)}</td>
                  <td style={{ padding: 12 }}>{r.gender}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <Link
                      to={`/readers/${r.id}/edit`}
                      style={{ marginRight: 8, color: '#2563eb' }}
                    >
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id, r.full_name)}
                      style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
