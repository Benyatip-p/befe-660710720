import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StoreManagerPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      // Proxied via nginx in production and CRA proxy in dev
      const res = await fetch('/api/v1/books');
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
      }
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    navigate('/store-manager/add-book');
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('ต้องการลบหนังสือเล่มนี้หรือไม่?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/v1/books/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }
      // Refresh list after delete
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert('ลบไม่สำเร็จ: ' + (e.message || 'unknown error'));
    }
  };

  const handleEdit = (id) => {
    // Placeholder navigation (implement edit page later if needed)
    // Could navigate to /store-manager/edit/:id in the future
    navigate('/store-manager/add-book', { state: { editId: id } });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">BookStore - Store Manager</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">รายการหนังสือ</h2>
          <button
            onClick={handleAddBook}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + เพิ่มหนังสือ
          </button>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">กำลังโหลด...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            เกิดข้อผิดพลาด: {error}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อหนังสือ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ผู้แต่ง</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ปี</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคา</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map((b) => (
                    <tr key={b.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{b.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{b.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof b.price === 'number' ? `฿${b.price}` : b.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleEdit(b.id)}
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                        ไม่พบข้อมูลหนังสือ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagerPage;