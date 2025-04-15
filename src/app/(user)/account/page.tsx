"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng đến trang thông tin tài khoản
    router.push("/account/info");
  }, [router]);

  // Trang này sẽ không hiển thị gì cả, chỉ dùng để chuyển hướng
  return null;
}
