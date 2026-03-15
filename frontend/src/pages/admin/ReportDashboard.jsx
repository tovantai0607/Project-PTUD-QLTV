import { useEffect, useState } from 'react'
import { getTopBooksReport } from '../../services/admin'

export default function ReportDashboard() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    getTopBooksReport().then(setReports)
  }, [])

  return (
    <div>
      <h1>Báo cáo thống kê</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <h3>Sách mượn nhiều nhất</h3>
          {reports.map((item, index) => (
            <p key={index}>{item.book_name}: {item.borrow_count} lượt</p>
          ))}
        </div>
      </div>
    </div>
  )
}