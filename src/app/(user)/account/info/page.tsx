"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/AuthServices";
import styles from "./page.module.scss";
import classNames from "classnames/bind";
import {
  Form,
  Input,
  Button,
  Select, 
  DatePicker,
  Card,
  Typography,
  message,
  Space,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Option } = Select;
const cx = classNames.bind(styles);

interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  gender?: string;
  birthday?: string;
}

export default function AccountInfoPage() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/");
      return;
    }

    // Giả lập dữ liệu người dùng
    const profileData = {
      id: user.id || "1",
      full_name: user.full_name || "Nguyễn Văn A",
      email: user.email || "example@gmail.com",
      phone: user.phone || "0987654321",
      gender: user.gender || "male",
      birthday: user.birthday || "1990-01-01",
    };

    setUserData(profileData);
    form.setFieldsValue({
      ...profileData,
      birthday: profileData.birthday ? dayjs(profileData.birthday) : null,
    });

    setLoading(false);
  }, [form, router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Trong thực tế, đây là nơi bạn sẽ gọi API cập nhật thông tin người dùng
      console.log("Submit values:", values);

      // Hiển thị thông báo thành công
      message.success("Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      full_name: userData?.full_name,
      email: userData?.email,
      phone: userData?.phone,
      gender: userData?.gender,
      birthday: userData?.birthday ? dayjs(userData?.birthday) : null,
    });
    setIsEditing(false);
  };

  if (loading) {
    return <div className={cx("loading")}>Đang tải...</div>;
  }

  return (
    <div className={cx("account-info-container")}>
      <Title level={4} className={cx("page-title")}>
        Thông tin tài khoản
      </Title>
      <Divider />

      <Card bordered={false} className={cx("info-card")}>
        <Form
          form={form}
          layout="vertical"
          disabled={!isEditing}
          className={cx("user-form")}
        >
          <div className={cx("form-row")}>
            <Form.Item
              name="full_name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              className={cx("form-item")}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Họ và tên"
                className={cx("form-input")}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
              className={cx("form-item")}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                disabled={true}
                className={cx("form-input")}
              />
            </Form.Item>
          </div>

          <div className={cx("form-row")}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
              className={cx("form-item")}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Số điện thoại"
                className={cx("form-input")}
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              className={cx("form-item")}
            >
              <Select
                placeholder="Chọn giới tính"
                className={cx("form-select")}
              >
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </div>

          <div className={cx("form-row")}>
            <Form.Item
              name="birthday"
              label="Ngày sinh"
              className={cx("form-item")}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
                style={{ width: "100%" }}
                suffixIcon={<CalendarOutlined />}
                className={cx("form-input")}
              />
            </Form.Item>
          </div>
        </Form>

        <div className={cx("form-actions")}>
          {!isEditing ? (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className={cx("edit-button")}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                Lưu thông tin
              </Button>
            </Space>
          )}
        </div>
      </Card>
    </div>
  );
}
