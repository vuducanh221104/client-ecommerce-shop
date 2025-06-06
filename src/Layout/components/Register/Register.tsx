import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import { authRegister } from "@/services/authServices";
import { toast } from "react-hot-toast";
import { Form, Input } from "antd";

const cx = classNames.bind(styles);

interface RegisterProps {
  onClose: () => void;
  switchToLogin?: () => void;
}

function Register({ onClose, switchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

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
  const handleSwitchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (switchToLogin) {
      setIsClosing(true);
      setTimeout(() => {
        switchToLogin();
      }, 400); // Match animation duration
    }
  };

  // Handle register submission with antd form
  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      try {
        // Call the register service
        const result = await authRegister({
          name: values.email.split('@')[0], // Using part of email as name
          fullName: values.email.split('@')[0], // Using part of email as fullName
          phone: "", // Empty phone number
          email: values.email,
          username: values.email, // Using email as username
          password: values.password,
        });

        // Show success message
        toast.success("Đăng ký thành công!");

        // Switch to login after registration
        if (switchToLogin) {
          setIsClosing(true);
          setTimeout(() => {
            switchToLogin();
          }, 400);
        } else {
          // If switchToLogin not provided, just close the modal
          handleClose();
        }
      } catch (error: any) {
        // Show error message
        toast.error(
          error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!"
        );
      } finally {
        setIsLoading(false);
      }
    } catch (errorInfo) {
      // Form validation error
    }
  };

  // Stop propagation for modal content clicks
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={cx("register-overlay")}>
      <div
        ref={modalRef}
        className={cx("register-modal", { closing: isClosing })}
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
          <h2 className={cx("benefits-heading")}>
            Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
          </h2>

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

          {/* Social Login Options */}
          <div className={cx("login-options")}>
            <span className={cx("login-label")}>Đăng ký bằng:</span>

            <div className={cx("social-login")}>
              <button className={cx("social-button")}>
                <Image
                  src="https://mcdn.coolmate.me/image/September2023/mceclip1_21.png"
                  alt="Google"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className={cx("or-divider")}>
            <span>Hoặc đăng ký tài khoản:</span>
          </div>

          {/* Registration Form with antd */}
          <Form
            form={form}
            onFinish={handleRegister}
            layout="vertical"
            validateTrigger={["onBlur", "onChange"]}
          >
            <Form.Item
              name="email"
              className={cx("form-group")}
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không đúng định dạng" },
              ]}
            >
              <Input
                className={cx("input-field")}
                placeholder="Email của bạn"
              />
            </Form.Item>

            <Form.Item
              name="password"
              className={cx("form-group", "password-field")}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input
                type={showPassword ? "text" : "password"}
                className={cx("input-field")}
                placeholder="Mật khẩu"
                suffix={
                  <button
                    type="button"
                    className={cx("toggle-password")}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              className={cx("form-group", "password-field")}
              dependencies={['password']}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                  },
                }),
              ]}
            >
              <Input
                type={showConfirmPassword ? "text" : "password"}
                className={cx("input-field")}
                placeholder="Xác nhận mật khẩu"
                suffix={
                  <button
                    type="button"
                    className={cx("toggle-password")}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                }
              />
            </Form.Item>

            <Form.Item>
              <button
                type="submit"
                className={cx("register-button")}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </Form.Item>

            {/* Footer Link */}
            <div className={cx("footer-links")}>
              <a href="#" onClick={handleSwitchToLogin}>
                Đã có tài khoản? Đăng nhập
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
