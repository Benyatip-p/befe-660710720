import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpenIcon, ArrowLeftIcon, SaveIcon, ExclamationCircleIcon } from '@heroicons/react/outline';

const EditBookPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    year: '',
    category: '',
    price: '',
    original_price: '',
    discount: '',
    cover_image: '',
    rating: '',
    reviews_count: '',
    is_new: false,
    pages: '',
    language: 'Thai',
    publisher: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookData();
  }, [id]);

  const fetchBookData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/books/${id}`);
      if (!response.ok) throw new Error('ไม่พบข้อมูลหนังสือ');

      const book = await response.json();
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        year: book.year?.toString() || '',
        category: book.category || '',
        price: book.price?.toString() || '',
        original_price: book.original_price?.toString() || '',
        discount: book.discount?.toString() || '',
        cover_image: book.cover_image || '',
        rating: book.rating?.toString() || '',
        reviews_count: book.reviews_count?.toString() || '',
        is_new: book.is_new || false,
        pages: book.pages?.toString() || '',
        language: book.language || 'Thai',
        publisher: book.publisher || '',
        description: book.description || ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณากรอกชื่อหนังสือ';
    } else if (formData.title.length < 2) {
      newErrors.title = 'ชื่อหนังสือต้องมีอย่างน้อย 2 ตัวอักษร';
    }

    // Author validation
    if (!formData.author.trim()) {
      newErrors.author = 'กรุณากรอกชื่อผู้แต่ง';
    }

    // ISBN validation
    if (formData.isbn && !/^[0-9-]+$/.test(formData.isbn)) {
      newErrors.isbn = 'ISBN ต้องเป็นตัวเลขและเครื่องหมาย - เท่านั้น';
    }

    // Year validation
    const yearNum = parseInt(formData.year);
    if (formData.year && (yearNum < 1000 || yearNum > new Date().getFullYear() + 1)) {
      newErrors.year = `ปีต้องอยู่ระหว่าง 1000 ถึง ${new Date().getFullYear() + 1}`;
    }

    // Price validation
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'ราคาต้องไม่ติดลบ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };

      // Auto-calculate sale price
      if (name === 'original_price' || name === 'discount') {
        const originalPrice = parseFloat(
          name === 'original_price' ? newValue : prev.original_price
        ) || 0;
        const discount = parseFloat(
          name === 'discount' ? newValue : prev.discount
        ) || 0;

        if (originalPrice > 0 && discount >= 0 && discount <= 100) {
          updated.price = (originalPrice * (1 - discount / 100)).toFixed(2);
        }
      }

      return updated;
    });

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const bookData = {
        ...formData,
        title: formData.title.trim(),
        author: formData.author.trim(),
        year: parseInt(formData.year) || 0,
        price: parseFloat(formData.price) || 0,
        original_price: parseFloat(formData.original_price) || null,
        discount: parseInt(formData.discount) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviews_count: parseInt(formData.reviews_count) || 0,
        pages: parseInt(formData.pages) || null
      };

      const response = await fetch(`/api/v1/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error('ไม่สามารถบันทึกข้อมูลได้');

      navigate('/store-manager');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-viridian-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">แก้ไขข้อมูลหนังสือ</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-left p-4 mb-6">
          <a href="/store-manager" className="text-sm text-black hover:text-viridian-100 transition-colors">
            ← กลับสู่หน้ารายการหนังสือ
          </a>
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">

          {/* ข้อมูลพื้นฐาน */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpenIcon className="h-6 w-6 text-viridian-600" />
              <h2 className="text-xl font-bold text-gray-900">ข้อมูลพื้นฐาน</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหนังสือ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="กรอกชื่อหนังสือ"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ผู้แต่ง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors ${errors.author ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="กรอกชื่อผู้แต่ง"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {errors.author}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors ${errors.isbn ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="978-1234567890"
                />
                {errors.isbn && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {errors.isbn}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ปีที่พิมพ์
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors ${errors.year ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="2024"
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {errors.year}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="fiction">นิยาย</option>
                  <option value="non-fiction">สารคดี</option>
                  <option value="psychology">จิตวิทยา</option>
                  <option value="business">ธุรกิจ</option>
                  <option value="technology">เทคโนโลยี</option>
                  <option value="history">ประวัติศาสตร์</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนหน้า
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="300"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลราคา */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 font-bold text-lg">฿</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">ข้อมูลราคา</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคาปกติ
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ส่วนลด (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคาขาย <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors ${errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="450.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="h-4 w-4" />
                    {errors.price}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ข้อมูลรีวิว */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 font-bold text-lg">★</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">ข้อมูลรีวิว</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คะแนน (0-5)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนรีวิว
                </label>
                <input
                  type="number"
                  min="0"
                  name="reviews_count"
                  value={formData.reviews_count}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลอื่นๆ */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 font-bold text-lg">ℹ</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">ข้อมูลอื่นๆ</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ภาษา
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                >
                  <option value="Thai">ไทย</option>
                  <option value="English">อังกฤษ</option>
                  <option value="Other">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  สำนักพิมพ์
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="กรอกชื่อสำนักพิมพ์"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปภาพปก
                </label>
                <input
                  type="url"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-viridian-500 focus:border-transparent transition-colors"
                  placeholder="กรอกคำอธิบายหนังสือ"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_new"
                  name="is_new"
                  checked={formData.is_new}
                  onChange={handleChange}
                  className="h-4 w-4 text-viridian-600 focus:ring-viridian-500 border-gray-300 rounded"
                />
                <label htmlFor="is_new" className="ml-2 text-sm text-gray-700">
                  เป็นหนังสือใหม่
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5" />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/store-manager')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-viridian-600 text-white rounded-lg hover:bg-viridian-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <SaveIcon className="h-5 w-5" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPage;