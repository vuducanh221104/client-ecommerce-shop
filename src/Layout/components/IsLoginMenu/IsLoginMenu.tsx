import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./IsLoginMenu.module.scss";
import Link from "next/link";
import { getCurrentUser, logout } from "@/services/AuthServices";

const cx = classNames.bind(styles);

interface IsLoginMenuProps {
  onLogout: () => void;
}

interface UserData {
  full_name: string;
  email: string;
  name?: string; // Fallback if fullName is not available
}

function IsLoginMenu({ onLogout }: IsLoginMenuProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data when component mounts
    const user = getCurrentUser();
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleLogout = () => {
    logout(); // Clear user data from localStorage
    onLogout(); // Call the parent component's logout handler
  };

  return (
    <div className={cx("login-menu")}>
      <div className={cx("user-info")}>
        <div className={cx("avatar-container")}>
          <img
            src="https://mcdn.coolmate.me/image/October2023/mceclip3_72.png"
            alt="User Avatar"
            className={cx("user-avatar")}
          />
        </div>
        <div className={cx("user-details")}>
          <p className={cx("user-name")}>{userData?.full_name}</p>
          <p className={cx("user-email")}>
            {userData?.email || "email@example.com"}
          </p>
        </div>
      </div>

      <div className={cx("menu-items")}>
        <Link href="/account" className={cx("menu-item")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Thông Tin Tài Khoản</span>
        </Link>

        <Link href="/orders" className={cx("menu-item")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>Đơn hàng của tôi</span>
        </Link>

        <Link href="/address" className={cx("menu-item")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>Sổ địa chỉ</span>
        </Link>

        <button
          onClick={handleLogout}
          className={cx("menu-item", "logout-button")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default IsLoginMenu;
