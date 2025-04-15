"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/AuthServices";
import styles from "./layout.module.scss";
import classNames from "classnames/bind";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  UserOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const cx = classNames.bind(styles);

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = getCurrentUser();

    if (!userData) {
      // Nếu không có thông tin đăng nhập, chuyển hướng về trang chủ
      router.push("/");
      return;
    }

    // Cài đặt dữ liệu người dùng
    setUser({
      id: userData.id || "1",
      full_name: userData.full_name || "Nguyễn Văn A",
      email: userData.email || "example@gmail.com",
      avatar:
        userData.avatar ||
        "https://mcdn.coolmate.me/image/October2023/mceclip3_72.png",
    });

    setLoading(false);
  }, [router]);

  // Hàm kiểm tra xem menu item có đang active hay không
  const isActive = (path: string) => {
    return pathname === path;
  };

  if (loading) {
    return (
      <div className={cx("loading-container")}>
        <div className={cx("loading-spinner")}></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className={cx("account-page")}>
      <div className={cx("account-header")}>
        <div className="container">
          <h1 className={cx("page-title")}>Tài khoản của tôi</h1>
        </div>
      </div>

      <div className="container">
        <div className={cx("account-container")}>
          {/* Sidebar */}
          <div className={cx("account-sidebar")}>
            <div className={cx("user-info")}>
              <div className={cx("avatar")}>
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.full_name}
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className={cx("avatar-placeholder")}>
                    {user?.full_name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className={cx("user-name")}>{user?.full_name}</div>
              <div className={cx("user-email")}>{user?.email}</div>
            </div>

            <div className={cx("menu")}>
              <Link
                href="/account/info"
                className={cx("menu-item", {
                  active: isActive("/account/info"),
                })}
              >
                <UserOutlined className={cx("menu-icon")} />
                <span>Thông tin tài khoản</span>
              </Link>

              <Link
                href="/account/order"
                className={cx("menu-item", {
                  active: isActive("/account/order"),
                })}
              >
                <ShoppingOutlined className={cx("menu-icon")} />
                <span>Đơn hàng của tôi</span>
              </Link>

              <Link
                href="/account/address"
                className={cx("menu-item", {
                  active: isActive("/account/address"),
                })}
              >
                <EnvironmentOutlined className={cx("menu-icon")} />
                <span>Sổ địa chỉ</span>
              </Link>

              <Link
                href="/account/changePassword"
                className={cx("menu-item", {
                  active: isActive("/account/changePassword"),
                })}
              >
                <LockOutlined className={cx("menu-icon")} />
                <span>Đổi mật khẩu</span>
              </Link>

              <div className={cx("menu-item", "logout-item")}>
                <LogoutOutlined className={cx("menu-icon")} />
                <span>Đăng xuất</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className={cx("account-content")}>{children}</div>
        </div>
      </div>
    </div>
  );
}
