"use client";

import { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateProfile } from "@/redux/apiRequest";

const { Title } = Typography;
const { Option } = Select;
const cx = classNames.bind(styles);

interface UserProfileData {
  _id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  [key: string]: any; // Allow for additional properties for backward compatibility
}

export default function AccountInfoPage() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user data from Redux store with proper typing
  const currentUser = useSelector<RootState, UserProfileData | null>(
    (state) => state.auth.login.currentUser
  );



  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }

    // Format date for DatePicker
    const birthday = currentUser.dateOfBirth;

    form.setFieldsValue({
      fullName: currentUser.fullName || currentUser.full_name, // For backward compatibility
      email: currentUser.email,
      phoneNumber: currentUser.phoneNumber || currentUser.phone_number, // For backward compatibility
      gender: currentUser.gender,
      dateOfBirth: birthday ? dayjs(birthday) : null,
    });

    setLoading(false);
  }, [form, router, currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Format date before sending to API
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : undefined,
      };

      // Call API and update Redux store
      await updateProfile(formattedValues, dispatch);

      // Show success message
      message.success("Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật thông tin thất bại");
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({
      fullName: currentUser?.fullName || currentUser?.full_name,
      email: currentUser?.email,
      phoneNumber: currentUser?.phoneNumber || currentUser?.phone_number,
      gender: currentUser?.gender,
      dateOfBirth: currentUser?.dateOfBirth
        ? dayjs(currentUser.dateOfBirth)
        : null,
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
              name="fullName"
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
              name="phoneNumber"
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
              name="dateOfBirth"
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
