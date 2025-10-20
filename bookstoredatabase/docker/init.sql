-- สร้างตาราง books
CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	author VARCHAR(255),
	isbn VARCHAR(50),
	year INTEGER,
	price DECIMAL(10,2),
	category VARCHAR(100),
	original_price DECIMAL(10,2),
	discount INTEGER DEFAULT 0,
	cover_image VARCHAR(500),
	rating DECIMAL(3,2) DEFAULT 0.0,
	reviews_count INTEGER DEFAULT 0,
	is_new BOOLEAN DEFAULT FALSE,
	pages INTEGER,
	language VARCHAR(50) DEFAULT 'Thai',
	publisher VARCHAR(255),
	description TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- สร้าง function สำหรับอัพเดท updated_at โดยอัตโนมัติ
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง trigger เพื่อเรียกใช้ function update_modified_column
CREATE TRIGGER update_books_modtime
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- สร้าง index บน title เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_books_title ON books(title);

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO books (title, author, isbn, year, price, category, original_price, discount, cover_image, rating, reviews_count, is_new, pages, language, publisher, description) VALUES
    ('Fundamental of Deep Learning in Practice', 'Nuttachot Promrit and Sajjaporn Waijanya', '978-1234567890', 2023, 599.00, 'technology', 699.00, 14, '/images/books/deeplearning.jpg', 4.8, 156, true, 320, 'Thai', 'Tech Publisher', 'หนังสือเกี่ยวกับการเรียนรู้เชิงลึกในทางปฏิบัติ'),
    ('Practical DevOps and Cloud Engineering', 'Nuttachot Promrit', '978-0987654321', 2024, 500.00, 'technology', 600.00, 17, '/images/books/devops.jpg', 4.6, 89, true, 280, 'Thai', 'Tech Publisher', 'หนังสือเกี่ยวกับ DevOps และ Cloud Engineering'),
    ('Mastering Golang for E-commerce Back End Development', 'Nuttachot Promrit', '978-1111222233', 2023, 450.00, 'technology', 500.00, 10, '/images/books/golang.jpg', 4.7, 203, false, 350, 'Thai', 'Tech Publisher', 'หนังสือเกี่ยวกับการพัฒนา Backend ด้วย Golang สำหรับ E-commerce'),
    ('The 7 Habits of Highly Effective People', 'Stephen R. Covey', '978-0743269513', 1989, 350.00, 'self-help', 400.00, 13, '/images/books/7habits.jpg', 4.9, 1250, false, 384, 'English', 'Free Press', 'Classic book on personal development and effectiveness'),
    ('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '978-0062316097', 2014, 420.00, 'history', 480.00, 13, '/images/books/sapiens.jpg', 4.8, 890, false, 443, 'English', 'Harper', 'A sweeping narrative of human history from the Stone Age to the modern age'),
    ('Atomic Habits', 'James Clear', '978-0735211292', 2018, 380.00, 'self-help', 450.00, 16, '/images/books/atomichabits.jpg', 4.9, 2100, false, 320, 'English', 'Avery', 'An easy and proven way to build good habits and break bad ones'),
    ('The Alchemist', 'Paulo Coelho', '978-0062315007', 1988, 250.00, 'fiction', 300.00, 17, '/images/books/alchemist.jpg', 4.7, 1800, false, 208, 'English', 'HarperOne', 'A philosophical novel about following your dreams'),
    ('Clean Code', 'Robert C. Martin', '978-0132350884', 2008, 550.00, 'technology', 650.00, 15, '/images/books/cleancode.jpg', 4.8, 756, false, 464, 'English', 'Prentice Hall', 'A handbook of agile software craftsmanship'),
    ('The Art of War', 'Sun Tzu', '978-1599869773', 2006, 180.00, 'business', 220.00, 18, '/images/books/artofwar.jpg', 4.6, 1200, false, 273, 'English', 'Filiquarian Publishing', 'Ancient Chinese military treatise on strategy and tactics'),
    ('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 1960, 320.00, 'fiction', 380.00, 16, '/images/books/mockingbird.jpg', 4.9, 2500, false, 376, 'English', 'J.B. Lippincott & Co.', 'A gripping tale of racial injustice and childhood innocence');