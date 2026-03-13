import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getReader, createReader, updateReader } from '../../services/readers'

export default function ReaderForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    full_name: '',
    class_name: '',
    date_of_birth: '',
    gender: 'Nam',
  })
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setLoadError(null)
    getReader(id)
      .then((r) => {
        if (!cancelled) {
          setForm({
            full_name: r.full_name,
            class_name: r.class_name,
            date_of_birth: r.date_of_birth?.slice(0, 10) || '',
            gender: r.gender || 'Nam',
          })
        }
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e.response?.data?.detail || e.message || 'Không tải được thông tin')
      })
    return () => { cancelled = true }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    if (!form.full_name?.trim()) {
      setSubmitError('Vui lòng nhập họ tên.')
      return
    }
    if (!form.class_name?.trim()) {
      setSubmitError('Vui lòng nhập lớp.')
      return
    }
    if (!form.date_of_birth) {
      setSubmitError('Vui lòng chọn ngày sinh.')
      return
    }
    if (!form.gender?.trim()) {
      setSubmitError('Vui lòng chọn giới tính.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        full_name: form.full_name.trim(),
        class_name: form.class_name.trim(),
        date_of_birth: form.date_of_birth,
        gender: form.gender.trim(),
      }
      if (isEdit) {
        await updateReader(id, payload)
        navigate('/readers')
      } else {
        await createReader(payload)
        navigate('/readers')
      }
    } catch (e) {
      const msg = e.response?.data?.detail
      setSubmitError(Array.isArray(msg) ? msg.map((x) => x.msg).join(', ') : msg || e.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (loadError) return <p style={{ color: 'red' }}>{loadError}</p>

  return (
    <div>
      <h1>{isEdit ? 'Sửa độc giả' : 'Thêm độc giả'}</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'white',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <label>
          Họ tên <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>
        <label>
          Lớp <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            name="class_name"
            value={form.class_name}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>
        <label>
          Ngày sinh <span style={{ color: 'red' }}>*</span>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>
        <label>
          Giới tính <span style={{ color: 'red' }}>*</span>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={{ display: 'block', width: '100%', padding: '8px 12px', marginTop: 4, borderRadius: 6, border: '1px solid #ccc' }}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </label>
        {submitError && <p style={{ color: 'red', margin: 0 }}>{submitError}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/readers')}
            style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
