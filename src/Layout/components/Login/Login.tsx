import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import Register from "../Register/Register";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import { toast } from "react-hot-toast";
import { Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { login } from "@/redux/apiRequest";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

interface LoginProps {
  onClose: (loginSuccess?: boolean) => void;
}

function Login({ onClose }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();

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

  // Show register form and hide login form
  const handleShowRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRegister(true);
    setShowForgetPassword(false);
  };

  // Show login form and hide register form
  const handleShowLogin = () => {
    setShowRegister(false);
    setShowForgetPassword(false);
  };

  // Show forget password form
  const handleShowForgetPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgetPassword(true);
    setShowRegister(false);
  };

  // Updated login function to use Redux
  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      try {
        // Use the Redux login function with dispatch
        const result = await login(
          {
            emailOrPhone: values.emailOrPhone,
            password: values.password,
          },
          "", // tokenCaptcha (empty string)
          dispatch,
          router
        );

        if (result) {
          // Show success toast notification
          toast.success("Đăng nhập thành công!");

          // If successful, close the modal with a slight delay to ensure Redux state is updated
          setIsClosing(true);

          // Ensure Redux state is properly persisted before closing
          setTimeout(() => {
            // Pass true to indicate successful login
            onClose(true);
          }, 500);
        }
      } catch (error: any) {
        // Show error message
        toast.error(
          error.response?.data?.message ||
            "Đăng nhập thất bại. Vui lòng thử lại!"
        );
      } finally {
        setIsLoading(false);
      }
    } catch (errorInfo) {
      // Form validation error
      console.log("Validate Failed:", errorInfo);
    }
  };

  // Stop propagation for modal content clicks
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (showRegister) {
    return <Register onClose={onClose} switchToLogin={handleShowLogin} />;
  }

  if (showForgetPassword) {
    return <ForgetPassword onClose={onClose} switchToLogin={handleShowLogin} />;
  }

  return (
    <div className={cx("login-overlay")}>
      <div
        ref={modalRef}
        className={cx("login-modal", { closing: isClosing })}
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
          <div className={cx("modal-content-inner")}>
            {/* Cool Club Logo */}
            <Image
              src="https://mcdn.coolmate.me/image/March2024/mceclip4_81.jpg"
              alt="Cool Club"
              width={180}
              height={29}
              className={cx("cool-club-logo")}
              style={{ height: "29px" }}
              priority={true}
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
                  alt="Hoàn tiền Coolcash"
                  width={290}
                  height={133}
                />
              </div>
            </div>

            {/* Login Options */}
            <div className={cx("login-options")}>
              <span className={cx("login-label")}>Đăng nhập bằng:</span>

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
              <span>Hoặc đăng nhập tài khoản:</span>
            </div>

            {/* Login Form with antd */}
            <Form
              form={form}
              onFinish={handleLogin}
              layout="vertical"
              className={cx("login-form")}
              validateTrigger={["onBlur", "onChange"]}
            >
              <Form.Item
                name="emailOrPhone"
                className={cx("form-group")}
                rules={[
                  { required: true, message: "Vui lòng nhập Email hoặc SĐT" },
                  {
                    validator: (_, value) => {
                      // Email validation
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      // Phone number validation (Vietnamese phone number)
                      const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

                      if (
                        !value ||
                        emailRegex.test(value) ||
                        phoneRegex.test(value)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Email hoặc số điện thoại không đúng định dạng"
                      );
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Email/SĐT của bạn"
                  className={cx("input-field")}
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
                  placeholder="Mật khẩu"
                  className={cx("input-field")}
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

              <Form.Item>
                <button
                  type="submit"
                  className={cx("login-button")}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
              </Form.Item>

              <div className={cx("footer-links")}>
                <a href="#" onClick={handleShowRegister}>
                  Đăng ký
                </a>
                <a href="#" onClick={handleShowForgetPassword}>
                  Quên mật khẩu
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
