import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các route cần bảo vệ
const PROTECTED_ROUTES = {
  admin: {
    login: "/admin/auth/login",
    base: "/admin/dashboard",
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    recover: "/auth/recover",
    resetPassword: "/auth/resetPassword",
  },
};

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const refreshTokenAdmin = request.cookies.get("refreshTokenAdmin")?.value;
  const { pathname } = request.nextUrl;

  // Xử lý routes auth
  if (pathname.startsWith("/auth")) {
    // Nếu đã đăng nhập, không cho phép truy cập các trang login, register, recover, resetPassword
    if (
      refreshToken &&
      [
        PROTECTED_ROUTES.auth.login,
        PROTECTED_ROUTES.auth.register,
        PROTECTED_ROUTES.auth.recover,
        PROTECTED_ROUTES.auth.resetPassword,
      ].includes(pathname)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Xử lý routes admin
  if (pathname.startsWith("/admin")) {
    // Cho phép truy cập trang login admin
    if (pathname === PROTECTED_ROUTES.admin.login) {
      // Nếu đã đăng nhập admin, chuyển về trang admin
      if (refreshTokenAdmin) {
        return NextResponse.redirect(
          new URL(PROTECTED_ROUTES.admin.base, request.url)
        );
      }
      return NextResponse.next();
    }

    // Nếu chưa đăng nhập admin, chuyển về trang login admin
    if (!refreshTokenAdmin) {
      return NextResponse.redirect(
        new URL(PROTECTED_ROUTES.admin.login, request.url)
      );
    }
  }

  return NextResponse.next();
}

// Áp dụng middleware cho cả routes auth và admin
export const config = {
  matcher: ["/auth/:path*", "/admin/:path*"],
};
