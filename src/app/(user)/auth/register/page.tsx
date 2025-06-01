"use client";
import React, { useState } from "react";
import { Input, Button, Form, Divider, Checkbox } from "antd";
import Image from "next/image";
import Link from "next/link";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import styles from "./register.module.scss";
import { authRegister } from "@/services/authServices";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import config from "@/config";

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async () => {
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
        toast.success("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");

        // Delay redirect để người dùng có thể đọc thông báo
        setTimeout(() => {
          // Redirect to login page after successful registration
          router.push(config.routes.login);
        }, 1500); // Đợi 1.5 giây
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
      console.error("Validate Failed:", errorInfo);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <Image 
            src="/golbal/logo_golbal.png" 
            alt="Logo" 
            width={170} 
            height={70} 
            className={styles.logo}
          />
          <h1 className={styles.title}>Đăng ký</h1>
          <p className={styles.subtitle}>
            Tạo tài khoản để nhận nhiều đặc quyền và quyền lợi mua sắm
          </p>
        </div>

        <div className={styles.benefitsContainer}>
          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              <Image 
                src="https://mcdn.coolmate.me/image/March2024/mceclip3_52.jpg" 
                alt="Voucher" 
                width={120} 
                height={120} 
              />
            </div>
     
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              <Image 
                src="https://mcdn.coolmate.me/image/March2024/mceclip1_36.jpg" 
                alt="Gift" 
                width={120} 
                height={120} 
              />
            </div>
         
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              <Image 
                src="https://mcdn.coolmate.me/image/March2024/mceclip2_55.jpg" 
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
              src="https://mcdn.coolmate.me/image/September2023/mceclip1_21.png" 
              alt="Google" 
              width={24} 
              height={24} 
            />
            <span>Đăng ký bằng Google</span>
          </Button>
        </div>

        <Divider className={styles.divider}>
          <span>Hoặc đăng ký tài khoản</span>
        </Divider>

        <Form
          form={form}
          name="register_form"
          className={styles.registerForm}
          onFinish={handleSubmit}
          layout="vertical"
          validateTrigger={["onBlur", "onChange"]}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: 'email', message: "Email không hợp lệ" }
            ]}
          >
            <Input
              placeholder="Email của bạn"
              className={styles.input}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
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

          <Form.Item
            name="confirmPassword"
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
            <div className={styles.passwordWrapper}>
              <Input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className={styles.input}
                size="large"
              />
              <span className={styles.passwordToggle} onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản')) 
              },
            ]}
          >
            <Checkbox className={styles.checkbox}>
              Tôi đồng ý với <Link href="/terms" className={styles.termsLink}>Điều khoản dịch vụ</Link> và <Link href="/privacy" className={styles.termsLink}>Chính sách bảo mật</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className={styles.registerButton}
              size="large"
              block
              loading={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "ĐĂNG KÝ"}
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footerLinks}>
          <span className={styles.accountQuestion}>Đã có tài khoản?</span>
          <Link href={config.routes.login} className={styles.loginLink}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;