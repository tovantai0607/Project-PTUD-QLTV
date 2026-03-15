import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BorrowReturn = () => {
  const [borrowedList, setBorrowedList] = useState([]);
  const [formData, setFormData] = useState({ reader_id: '', book_copy_id: '' });
  const API_URL = "http://localhost:8000/api/borrow-system";

  // Lấy danh sách đang mượn
  const fetchBorrowed = async () => {
    try {
      const res = await axios.get(`${API_URL}/borrowed`);
      setBorrowedList(res.data);
    } catch (err) {
      console.error("Không thể lấy danh sách mượn", err);
    }
  };

  useEffect(() => { fetchBorrowed(); }, []);

  // Xử lý cho mượn sách
  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/borrow`, null, { params: formData });
      alert("Cho mượn sách thành công!");
      setFormData({ reader_id: '', book_copy_id: '' });
      fetchBorrowed();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi hệ thống");
    }
  };

  // Xử lý trả sách
  const handleReturn = async (id) => {
    try {
      await axios.post(`${API_URL}/return/${id}`);
      alert("Đã ghi nhận trả sách!");
      fetchBorrowed();
    } catch (err) {
      alert("Lỗi khi trả sách");
    }
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Quản lý Mượn - Trả Sách</h1>
      
      {/* Form tạo phiếu mượn - Nhiệm vụ 118 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-lg font-semibold mb-4">Tạo Phiếu Mượn Mới</h2>
        <form onSubmit={handleBorrow} className="flex gap-4">
          <input 
            type="number" placeholder="Mã độc giả (Reader ID)" 
            className="border p-2 rounded w-full"
            value={formData.reader_id}
            onChange={(e) => setFormData({...formData, reader_id: e.target.value})}
            required
          />
          <input 
            type="number" placeholder="Mã sách (Book Copy ID)" 
            className="border p-2 rounded w-full"
            value={formData.book_copy_id}
            onChange={(e) => setFormData({...formData, book_copy_id: e.target.value})}
            required
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Xác nhận mượn
          </button>
        </form>
      </div>

      {/* Danh sách đang mượn - Nhiệm vụ 120 */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b bg-gray-50">Sách đang được mượn</h2>
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID Phiếu</th>
              <th className="p-3">Mã Độc giả</th>
              <th className="p-3">Mã Sách</th>
              <th className="p-3">Ngày mượn</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {borrowedList.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.reader_id}</td>
                <td className="p-3">{item.book_copy_id}</td>
                <td className="p-3">{item.borrow_date}</td>
                <td className="p-3">
                  <button 
                    onClick={() => handleReturn(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Trả sách
                  </button>
                </td>
              </tr>
            ))}
            {borrowedList.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Không có sách nào đang mượn.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowReturn;