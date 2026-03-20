import { useEffect, useState } from 'react'

import {
  borrowBook,
  getAvailableCopies,
  getBorrowedRecords,
  returnBorrowedBook,
} from '../services/borrow'
import { getReaders } from '../services/readers'

const cardStyle = {
  background: 'white',
  padding: 24,
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}

export default function BorrowReturn() {
  const [borrowedList, setBorrowedList] = useState([])
  const [readers, setReaders] = useState([])
  const [availableCopies, setAvailableCopies] = useState([])
  const [formData, setFormData] = useState({ reader_id: '', book_copy_id: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [borrowed, readerData, copies] = await Promise.all([
        getBorrowedRecords(),
        getReaders({ limit: 500 }),
        getAvailableCopies(),
      ])

      setBorrowedList(borrowed)
      setReaders(readerData)
      setAvailableCopies(copies)
      setFormData((prev) => ({
        reader_id: readerData.some((reader) => String(reader.id) === prev.reader_id)
          ? prev.reader_id
          : readerData[0]?.id?.toString() || '',
        book_copy_id: copies.some((copy) => String(copy.id) === prev.book_copy_id)
          ? prev.book_copy_id
          : copies[0]?.id?.toString() || '',
      }))
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Không thể tải dữ liệu mượn trả')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBorrow = async (e) => {
    e.preventDefault()

    if (!formData.reader_id || !formData.book_copy_id) {
      alert('Vui lòng chọn độc giả và bản sao sách.')
      return
    }

    setSubmitting(true)
    try {
      await borrowBook({
        reader_id: Number(formData.reader_id),
        book_copy_id: Number(formData.book_copy_id),
      })
      await loadData()
      alert('Cho mượn sách thành công!')
    } catch (e) {
      alert(e.response?.data?.detail || e.message || 'Lỗi hệ thống')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReturn = async (recordId) => {
    try {
      await returnBorrowedBook(recordId)
      await loadData()
      alert('Đã ghi nhận trả sách!')
    } catch (e) {
      alert(e.response?.data?.detail || e.message || 'Lỗi khi trả sách')
    }
  }

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Quản lý mượn - trả sách</h1>
        <button
          type="button"
          onClick={loadData}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          Làm mới
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Tạo phiếu mượn mới</h2>
        <form onSubmit={handleBorrow} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <label>
            Độc giả
            <select
              name="reader_id"
              value={formData.reader_id}
              onChange={handleChange}
              disabled={loading || readers.length === 0}
              style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
            >
              {readers.length === 0 && <option value="">Chưa có độc giả</option>}
              {readers.map((reader) => (
                <option key={reader.id} value={reader.id}>
                  {reader.full_name} - {reader.class_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Bản sao sách có sẵn
            <select
              name="book_copy_id"
              value={formData.book_copy_id}
              onChange={handleChange}
              disabled={loading || availableCopies.length === 0}
              style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
            >
              {availableCopies.length === 0 && <option value="">Không có bản sao nào sẵn sàng</option>}
              {availableCopies.map((copy) => (
                <option key={copy.id} value={copy.id}>
                  {copy.book_title} - {copy.copy_code}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting || readers.length === 0 || availableCopies.length === 0}
            style={{
              padding: '10px 16px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Đang xử lý...' : 'Xác nhận mượn'}
          </button>
        </form>

        <p style={{ marginBottom: 0, marginTop: 12, color: '#64748b' }}>
          Hệ thống chỉ cho mượn các bản sao đang ở trạng thái có sẵn và mỗi độc giả chỉ được giữ một phiếu mượn đang hoạt động.
        </p>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Danh sách đang mượn</h2>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1a1a2e', color: '#eee' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Phiếu</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Độc giả</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Sách</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Bản sao</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Ngày mượn</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Hạn trả</th>
                <th style={{ padding: 12, textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {borrowedList.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                    Hiện chưa có phiếu mượn nào đang hoạt động.
                  </td>
                </tr>
              ) : (
                borrowedList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: 12 }}>#{item.id}</td>
                    <td style={{ padding: 12 }}>{item.reader_name}</td>
                    <td style={{ padding: 12 }}>{item.book_title}</td>
                    <td style={{ padding: 12 }}>{item.copy_code}</td>
                    <td style={{ padding: 12 }}>{formatDate(item.borrow_date)}</td>
                    <td style={{ padding: 12 }}>{formatDate(item.due_date)}</td>
                    <td style={{ padding: 12, textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleReturn(item.id)}
                        style={{
                          background: '#16a34a',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                        }}
                      >
                        Trả sách
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
