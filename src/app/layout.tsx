import type { Metadata } from 'next';
// Font tự host qua @fontsource (có subset vietnamese) — build/in không phụ thuộc mạng.
// Đã test chuỗi có dấu: "Vân Ơi, Trăng Rằm, Người Phụ Nữ".
import '@fontsource/baloo-2/vietnamese-600.css';
import '@fontsource/baloo-2/vietnamese-700.css';
import '@fontsource/baloo-2/vietnamese-800.css';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/baloo-2/latin-800.css';
import '@fontsource/baloo-2/latin-ext-600.css';
import '@fontsource/baloo-2/latin-ext-700.css';
import '@fontsource/baloo-2/latin-ext-800.css';
import '@fontsource/mali/vietnamese-500.css';
import '@fontsource/mali/latin-500.css';
import '@fontsource/mali/latin-ext-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-700.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/be-vietnam-pro/latin-600.css';
import '@fontsource/be-vietnam-pro/latin-700.css';
import '@fontsource/be-vietnam-pro/latin-ext-400.css';
import '@fontsource/be-vietnam-pro/latin-ext-600.css';
// Font riêng cho theme "Chị Đẹp Tài Chính"
import '@fontsource/lexend/vietnamese-700.css';
import '@fontsource/lexend/vietnamese-800.css';
import '@fontsource/lexend/latin-700.css';
import '@fontsource/lexend/latin-800.css';
import '@fontsource/lexend/latin-ext-700.css';
import '@fontsource/lexend/latin-ext-800.css';
import '@fontsource/charm/vietnamese-700.css';
import '@fontsource/charm/latin-700.css';
import '@fontsource/charm/latin-ext-700.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cloud Calendar 2027',
  description: 'Thiết kế lịch để bàn 2027 theme mây pastel — quà của team gửi chị Vân',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  );
}
