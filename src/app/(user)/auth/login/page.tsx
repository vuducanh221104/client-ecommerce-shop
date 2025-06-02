"use client";
import React, { useState } from "react";
import { Input, Button, Form, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from "./login.module.scss";
import { useDispatch } from "react-redux";
import { login } from "@/redux/apiRequest";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      try {
        // Use the Redux login function with dispatch
        const result = await login(
          {
            emailOrPhone: values.email, // Using email field as emailOrPhone
            password: values.password,
          },
          "", // tokenCaptcha (empty string)
          dispatch,
          router
        );

        if (result) {
          // Show success toast notification
          toast.success("Đăng nhập thành công!");
          
          // Redirect to home page after successful login
          router.push("/");
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
      console.error("Validate Failed:", errorInfo);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <Image 
            src="/golbal/logo_golbal.png" 
            alt="Logo" 
            width={170} 
            height={70} 
            className={styles.logo}
          />
          <h1 className={styles.title}>Đăng nhập</h1>
          <p className={styles.subtitle}>
            Rất nhiều đặc quyền và quyền lợi mua sắm đang chờ bạn
          </p>
        </div>

        <div className={styles.benefitsContainer}>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              <Image 
                src="/svg/login-1.webp"
                alt="Voucher" 
                width={120} 
                height={120} 
              />
            </div>
        
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              <Image 
                src="/svg/login-2.webp" 
                alt="Gift" 
                width={120} 
                height={120} 
              />
            </div>
     
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              <Image 
                src="/svg/login-3.webp" 
                alt="Coolcash" 
                width={120} 
                height={120} 
              />
            </div>
     
          </div>
        </div>

        <div className={styles.socialLogin}>
          <Button className={styles.googleButton}>
            <Image 
                src="/svg/login-google.png" 
              alt="Google" 
              width={24} 
              height={24} 
            />
            <span>Đăng nhập bằng Google</span>
          </Button>
        </div>

        <Divider className={styles.divider}>
          <span>Hoặc đăng nhập tài khoản</span>
        </Divider>

        <Form
          form={form}
          name="login_form"
          className={styles.loginForm}
          onFinish={handleSubmit}
          layout="vertical"
          validateTrigger={["onBlur", "onChange"]}
        >
          <Form.Item
            name="email"
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
              className={styles.input}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <div className={styles.passwordWrapper}>
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Mật khẩu"
                className={styles.input}
                size="large"
              />
              <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className={styles.loginButton}
              size="large"
              block
              loading={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footerLinks}>
          <Link href="/auth/register" className={styles.registerLink}>
            Đăng ký
          </Link>
          <Link href="/auth/forgot-password" className={styles.forgotPasswordLink}>
            Quên mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;