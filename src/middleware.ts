import { NextResponse, type NextRequest } from 'next/server';

/**
 * Khoá cả site bằng Basic Auth để giữ bí mật quà (Vercel Hobby không có Password Protection).
 * Bật bằng env SITE_PASSWORD (user: bất kỳ). Không set = không khoá (chạy local).
 */
export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const header = req.headers.get('authorization');
  if (header?.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const given = decoded.slice(decoded.indexOf(':') + 1);
      if (given === password) return NextResponse.next();
    } catch {
      // header hỏng → hỏi lại
    }
  }
  return new NextResponse('Cần mật khẩu', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Lich 2027", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
