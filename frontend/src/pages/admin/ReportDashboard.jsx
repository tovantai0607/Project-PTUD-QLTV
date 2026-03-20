import { useEffect, useState } from 'react'

import { getTopBooksReport, getUnreturnedReport } from '../../services/admin'

export default function ReportDashboard() {
  const [topBooks, setTopBooks] = useState([])
  const [unreturned, setUnreturned] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const [topBooksData, unreturnedData] = await Promise.all([
        getTopBooksReport(),
        getUnreturnedReport(),
      ])
      setTopBooks(topBooksData)
      setUnreturned(unreturnedData)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Báo cáo thống kê</h1>
        <button
          type="button"
          onClick={loadReports}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer' }}
        >
          Làm mới
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>Top sách được mượn nhiều nhất</h2>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : topBooks.length === 0 ? (
            <p>Chưa có dữ liệu mượn sách để thống kê.</p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {topBooks.map((item) => (
                <li key={item.book_name} style={{ marginBottom: 8 }}>
                  <strong>{item.book_name}</strong> - {item.borrow_count} lượt mượn
                </li>
              ))}
            </ol>
          )}
        </div>

        <div style={{ background: 'white', padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>Danh sách chưa trả / quá hạn</h2>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a2e', color: '#eee' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>Độc giả</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Sách</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Bản sao</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Ngày mượn</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Hạn trả</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Quá hạn</th>
                </tr>
              </thead>
              <tbody>
                {unreturned.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                      Không có phiếu mượn nào đang hoạt động.
                    </td>
                  </tr>
                ) : (
                  unreturned.map((item) => (
                    <tr key={`${item.copy_code}-${item.reader_name}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: 12 }}>{item.reader_name}</td>
                      <td style={{ padding: 12 }}>{item.book_name}</td>
                      <td style={{ padding: 12 }}>{item.copy_code}</td>
                      <td style={{ padding: 12 }}>{formatDate(item.borrow_date)}</td>
                      <td style={{ padding: 12 }}>{formatDate(item.due_date)}</td>
                      <td style={{ padding: 12, color: item.days_overdue > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                        {item.days_overdue > 0 ? `${item.days_overdue} ngày` : 'Đúng hạn'}
                      </td>
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
