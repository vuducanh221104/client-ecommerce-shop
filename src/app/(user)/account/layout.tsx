"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/apiRequest";
import { toast } from "react-hot-toast";

const cx = classNames.bind(styles);

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
}

// Define the expected shape of the user object from Redux
interface ReduxUser {
  id?: string;
  _id?: string;
  fullName?: string;
  full_name?: string;
  email: string;
  avatar?: string;
  [key: string]: any;
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
  const dispatch = useDispatch();

  // Get user data from Redux store with correct typing
  const currentUser = useSelector<RootState, ReduxUser | null>(
    (state) => state.auth.login.currentUser
  );

  useEffect(() => {
    // If no user in Redux state, redirect to home page
    if (!currentUser) {
      router.push("/");
      return;
    }

    // Set user data from Redux state
    setUser({
      id: currentUser.id || currentUser._id || "1",
      full_name: currentUser.fullName || currentUser.full_name || "Người dùng",
      email: currentUser.email || "example@gmail.com",
      avatar:
        currentUser.avatar ||
        "https://mcdn.coolmate.me/image/October2023/mceclip3_72.png",
    });

    setLoading(false);
  }, [router, currentUser]);

  // Hàm kiểm tra xem menu item có đang active hay không
  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      // Call the Redux logout function with dispatch
      await logout(dispatch, router);

      // Show success message
      toast.success("Đăng xuất thành công");

      // Router will redirect to home page
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
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

              <div
                className={cx("menu-item", "logout-item")}
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
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
