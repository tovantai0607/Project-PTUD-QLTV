import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBooks, deleteBook } from '../../services/books'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBooks()
      // Lọc dữ liệu theo search ở client (nếu có search)
      if (search) {
        const lowerSearch = search.toLowerCase()
        setBooks(data.filter(b => b.title.toLowerCase().includes(lowerSearch) || b.author.toLowerCase().includes(lowerSearch)))
      } else {
        setBooks(data)
      }
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Lỗi tải danh sách sách')
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

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa sách "${title}" và toàn bộ bản sao của nó?`)) return
    try {
      await deleteBook(id)
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (e) {
      alert(e.response?.data?.detail || e.message || 'Không thể xóa sách')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Danh sách đầu sách</h1>
        <Link
          to="/books/new"
          style={{ padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: 6, textDecoration: 'none' }}
        >
          Thêm sách mới
        </Link>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Tìm theo tên sách hoặc tác giả..."
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
              <th style={{ padding: 12, textAlign: 'left' }}>Mã sách</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Tên sách</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Tác giả</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Chuyên ngành</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Số lượng</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                  Chưa có cuốn sách nào. Nhấn "Thêm sách mới" để thêm.
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>{b.id}</td>
                  <td style={{ padding: 12, fontWeight: 'bold' }}>{b.title}</td>
                  <td style={{ padding: 12 }}>{b.author}</td>
                  <td style={{ padding: 12 }}>{b.category?.name || '---'}</td>
                  <td style={{ padding: 12, textAlign: 'center' }}>{b.total_quantity}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <Link to={`/books/${b.id}/edit`} style={{ marginRight: 8, color: '#2563eb' }}>
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.id, b.title)}
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