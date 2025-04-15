import React, { useState, useRef, useEffect } from "react";
import styles from "./SuccessMessage.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface SuccessMessageProps {
  onClose: () => void;
  switchToLogin?: () => void;
  email: string;
}

function SuccessMessage({
  onClose,
  switchToLogin,
  email,
}: SuccessMessageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add event listener for clicks outside the modal
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Match animation duration
  };

  // Handle switch to login with animation
  const handleSwitchToLogin = () => {
    if (switchToLogin) {
      setIsClosing(true);
      setTimeout(() => {
        switchToLogin();
      }, 400); // Match animation duration
    }
  };

  // Stop propagation for modal content clicks
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={cx("success-overlay")}>
      <div
        ref={modalRef}
        className={cx("success-modal", { closing: isClosing })}
        onClick={handleModalClick}
      >
        <button className={cx("close-button")} onClick={handleClose}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={cx("modal-content")}>
          <h2 className={cx("title")}>Yêu Cầu Thành Công</h2>

          <div className={cx("message")}>
            Vui lòng kiểm tra email để thực hiện thay đổi mật khẩu.
            <br />
            <br />
            Nếu không tìm thấy, vui lòng kiểm tra mục <span>"Spam"</span>
          </div>

          <div className={cx("actions")}>
            <button
              className={cx("login-button")}
              onClick={handleSwitchToLogin}
            >
              Đăng nhập
            </button>

            <button
              className={cx("register-button")}
              onClick={handleSwitchToLogin}
            >
              Đăng ký tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessMessage;
