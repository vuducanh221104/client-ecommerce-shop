"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import {
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function PageChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Các điều kiện mật khẩu
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const hasMinLength = newPassword.length >= 8;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (values: any) => {
    setLoading(true);
    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      message.success("Mật khẩu đã được cập nhật thành công");

      // Reset form sau khi thành công
      form.resetFields();
      setNewPassword("");

      // Ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className={cx("change-password-container")}>
      <h1 className={cx("page-title")}>Đổi mật khẩu</h1>

      <Card className={cx("password-card")}>
        {loading ? (
          <div className={cx("loading")}>
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            className={cx("password-form")}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              className={cx("form-item")}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                className={cx("form-input")}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              className={cx("form-item")}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                {
                  validator: (_, value) => {
                    if (
                      value &&
                      hasLowerCase &&
                      hasUpperCase &&
                      hasNumber &&
                      hasSpecialChar &&
                      hasMinLength
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu không đáp ứng các yêu cầu");
                  },
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                className={cx("form-input")}
                placeholder="Nhập mật khẩu mới"
                onChange={handlePasswordChange}
              />
            </Form.Item>

            <div className={cx("password-requirements")}>
              <div>Mật khẩu mới phải có:</div>
              <ul className={cx("requirement-list")}>
                <li className={cx("requirement-item")}>
                  {hasMinLength ? (
                    <CheckCircleFilled className={cx("check-icon")} />
                  ) : (
                    <CloseCircleFilled className={cx("cross-icon")} />
                  )}
                  Ít nhất 8 ký tự
                </li>
                <li className={cx("requirement-item")}>
                  {hasLowerCase ? (
                    <CheckCircleFilled className={cx("check-icon")} />
                  ) : (
                    <CloseCircleFilled className={cx("cross-icon")} />
                  )}
                  Ít nhất một chữ cái thường (a-z)
                </li>
                <li className={cx("requirement-item")}>
                  {hasUpperCase ? (
                    <CheckCircleFilled className={cx("check-icon")} />
                  ) : (
                    <CloseCircleFilled className={cx("cross-icon")} />
                  )}
                  Ít nhất một chữ cái hoa (A-Z)
                </li>
                <li className={cx("requirement-item")}>
                  {hasNumber ? (
                    <CheckCircleFilled className={cx("check-icon")} />
                  ) : (
                    <CloseCircleFilled className={cx("cross-icon")} />
                  )}
                  Ít nhất một chữ số (0-9)
                </li>
                <li className={cx("requirement-item")}>
                  {hasSpecialChar ? (
                    <CheckCircleFilled className={cx("check-icon")} />
                  ) : (
                    <CloseCircleFilled className={cx("cross-icon")} />
                  )}
                  Ít nhất một ký tự đặc biệt (!@#$%^&*...)
                </li>
              </ul>
            </div>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              className={cx("form-item")}
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Mật khẩu xác nhận không khớp với mật khẩu mới"
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                className={cx("form-input")}
                placeholder="Xác nhận mật khẩu mới"
              />
            </Form.Item>

            {success && (
              <div className={cx("success-message")}>
                Mật khẩu đã được cập nhật thành công!
              </div>
            )}

            <div className={cx("form-actions")}>
              <Button
                type="primary"
                htmlType="submit"
                className={cx("update-button")}
                disabled={loading}
              >
                Cập nhật mật khẩu
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}

export default PageChangePassword;
