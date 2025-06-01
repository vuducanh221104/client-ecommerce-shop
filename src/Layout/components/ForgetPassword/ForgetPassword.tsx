import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ForgetPassword.module.scss";
import classNames from "classnames/bind";
import SuccessMessage from "./SuccessMessage";

const cx = classNames.bind(styles);

interface ForgetPasswordProps {
  onClose: () => void;
  switchToLogin?: () => void;
}

function ForgetPassword({ onClose, switchToLogin }: ForgetPasswordProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOrPhone.trim()) {
      setIsSubmitted(true);
    }
  };

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Match animation duration
  };

  // Handle switch to login with animation
  const handleSwitchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
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

  if (isSubmitted) {
    return (
      <SuccessMessage
        onClose={onClose}
        switchToLogin={switchToLogin}
        email={emailOrPhone}
      />
    );
  }

  return (
    <div className={cx("forget-overlay")}>
      <div
        ref={modalRef}
        className={cx("forget-modal", { closing: isClosing })}
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
          {/* Cool Club Logo */}
          <Image
            src="https://mcdn.coolmate.me/image/March2024/mceclip4_81.jpg"
            alt="Cool Club"
            width={180}
            height={29}
            className={cx("cool-club-logo")}
            style={{ height: "29px" }}
          />

          {/* Heading */}
          <h2 className={cx("benefits-heading")}>Khôi phục mật khẩu</h2>

          {/* Benefits Icons */}
          <div className={cx("benefits-icons")}>
            <div className={cx("benefit-icon")}>
              <Image
                src="https://mcdn.coolmate.me/image/March2024/mceclip3_52.jpg"
                alt="Voucher ưu đãi"
                width={290}
                height={133}
              />
            </div>

            <div className={cx("benefit-icon")}>
              <Image
                src="https://mcdn.coolmate.me/image/March2024/mceclip1_36.jpg"
                alt="Quà tặng độc quyền"
                width={290}
                height={133}
              />
            </div>

            <div className={cx("benefit-icon")}>
              <Image
                src="https://mcdn.coolmate.me/image/March2024/mceclip2_55.jpg"
                alt="Hoàn tiền ZenFit"
                width={290}
                height={133}
              />
            </div>
          </div>

          <div className={cx("description")}>
            Vui lòng nhập địa chỉ email hoặc số điện thoại của bạn để yêu cầu
            khôi phục mật khẩu
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className={cx("form-group")}>
              <input
                type="text"
                className={cx("input-field")}
                placeholder="Email hoặc số điện thoại"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={cx("submit-button")}>
              Khôi phục mật khẩu
            </button>
          </form>

          {/* Footer Link */}
          <div className={cx("footer-links")}>
            <a href="#" onClick={handleSwitchToLogin}>
              Quay lại đăng nhập
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
