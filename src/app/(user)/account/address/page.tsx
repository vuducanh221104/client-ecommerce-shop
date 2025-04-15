"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Modal,
  Spin,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./page.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const { Option } = Select;
const { confirm } = Modal;

interface AddressData {
  id: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

function PageAddress() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(
    null
  );
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  // Mô phỏng dữ liệu địa chỉ
  useEffect(() => {
    // Giả lập việc lấy dữ liệu từ API
    setTimeout(() => {
      setAddresses([
        {
          id: "1",
          recipientName: "Nguyễn Văn A",
          phoneNumber: "0123456789",
          province: "Hà Nội",
          district: "Cầu Giấy",
          ward: "Dịch Vọng",
          detailAddress: "Số 14, ngõ 29, đường Thái Hà",
          isDefault: true,
        },
        {
          id: "2",
          recipientName: "Nguyễn Văn A",
          phoneNumber: "0987654321",
          province: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Bến Nghé",
          detailAddress: "123 Lê Lợi",
          isDefault: false,
        },
      ]);
      setLoading(false);
    }, 1000);

    // Dữ liệu mẫu cho tỉnh/thành phố
    setProvinces(["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"]);
  }, []);

  useEffect(() => {
    // Cập nhật quận/huyện khi thay đổi tỉnh/thành phố
    const province = form.getFieldValue("province");
    if (province) {
      if (province === "Hà Nội") {
        setDistricts([
          "Cầu Giấy",
          "Ba Đình",
          "Đống Đa",
          "Hai Bà Trưng",
          "Hoàn Kiếm",
        ]);
      } else if (province === "Hồ Chí Minh") {
        setDistricts(["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5"]);
      } else {
        setDistricts([]);
      }
    }
  }, [form.getFieldValue("province")]);

  useEffect(() => {
    // Cập nhật phường/xã khi thay đổi quận/huyện
    const district = form.getFieldValue("district");
    if (district) {
      if (district === "Cầu Giấy") {
        setWards([
          "Dịch Vọng",
          "Dịch Vọng Hậu",
          "Mai Dịch",
          "Nghĩa Đô",
          "Quan Hoa",
          "Trung Hòa",
        ]);
      } else if (district === "Quận 1") {
        setWards([
          "Bến Nghé",
          "Bến Thành",
          "Cầu Kho",
          "Cầu Ông Lãnh",
          "Đa Kao",
        ]);
      } else {
        setWards([]);
      }
    }
  }, [form.getFieldValue("district")]);

  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditAddress = (address: AddressData) => {
    setEditingAddress(address);
    form.setFieldsValue(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      icon: <ExclamationCircleOutlined />,
      content: "Địa chỉ sẽ bị xóa vĩnh viễn và không thể khôi phục.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        // Xóa địa chỉ
        setAddresses(addresses.filter((item) => item.id !== addressId));
        message.success("Đã xóa địa chỉ thành công");
      },
    });
  };

  const handleSubmit = (values: any) => {
    if (editingAddress) {
      // Cập nhật địa chỉ hiện có
      const updatedAddresses = addresses.map((item) => {
        if (item.id === editingAddress.id) {
          return { ...values, id: item.id };
        }
        // Nếu địa chỉ mới là mặc định, cập nhật các địa chỉ khác
        if (values.isDefault && item.id !== editingAddress.id) {
          return { ...item, isDefault: false };
        }
        return item;
      });
      setAddresses(updatedAddresses);
      message.success("Cập nhật địa chỉ thành công");
    } else {
      // Thêm địa chỉ mới
      const newAddress: AddressData = {
        ...values,
        id: Date.now().toString(), // Tạo ID đơn giản
      };

      // Nếu địa chỉ mới là mặc định, cập nhật các địa chỉ khác
      if (newAddress.isDefault) {
        setAddresses([
          newAddress,
          ...addresses.map((item) => ({ ...item, isDefault: false })),
        ]);
      } else {
        setAddresses([newAddress, ...addresses]);
      }
      message.success("Thêm địa chỉ mới thành công");
    }
    setModalVisible(false);
  };

  const handleProvinceChange = (value: string) => {
    form.setFieldsValue({ district: undefined, ward: undefined });
    if (value === "Hà Nội") {
      setDistricts([
        "Cầu Giấy",
        "Ba Đình",
        "Đống Đa",
        "Hai Bà Trưng",
        "Hoàn Kiếm",
      ]);
    } else if (value === "Hồ Chí Minh") {
      setDistricts(["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5"]);
    } else {
      setDistricts([]);
    }
    setWards([]);
  };

  const handleDistrictChange = (value: string) => {
    form.setFieldsValue({ ward: undefined });
    if (value === "Cầu Giấy") {
      setWards([
        "Dịch Vọng",
        "Dịch Vọng Hậu",
        "Mai Dịch",
        "Nghĩa Đô",
        "Quan Hoa",
        "Trung Hòa",
      ]);
    } else if (value === "Quận 1") {
      setWards(["Bến Nghé", "Bến Thành", "Cầu Kho", "Cầu Ông Lãnh", "Đa Kao"]);
    } else {
      setWards([]);
    }
  };

  return (
    <div className={cx("address-container")}>
      <h1 className={cx("page-title")}>Địa chỉ của tôi</h1>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        className={cx("add-button")}
        onClick={handleAddAddress}
      >
        Thêm địa chỉ mới
      </Button>

      {loading ? (
        <div className={cx("loading")}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={cx("address-list")}>
          {addresses.map((address) => (
            <div key={address.id} className={cx("address-item")}>
              {address.isDefault && (
                <div className={cx("default-badge")}>Mặc định</div>
              )}
              <div className={cx("address-header")}>
                <div>
                  <span className={cx("recipient-name")}>
                    {address.recipientName}
                  </span>
                  <span className={cx("phone-number")}>
                    {address.phoneNumber}
                  </span>
                </div>
              </div>
              <div className={cx("address-content")}>
                {`${address.detailAddress}, ${address.ward}, ${address.district}, ${address.province}`}
              </div>
              <div className={cx("address-actions")}>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  className={cx("edit-button")}
                  onClick={() => handleEditAddress(address)}
                >
                  Sửa
                </Button>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  className={cx("delete-button")}
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={address.isDefault}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          className={cx("address-form")}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="recipientName"
            label="Họ và tên"
            className={cx("form-item")}
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              className={cx("form-input")}
              placeholder="Nhập họ và tên người nhận"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            className={cx("form-item")}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ" },
            ]}
          >
            <Input
              className={cx("form-input")}
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="province"
            label="Tỉnh/Thành phố"
            className={cx("form-item")}
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
            ]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
              className={cx("form-select")}
              onChange={handleProvinceChange}
            >
              {provinces.map((province) => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            className={cx("form-item")}
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
          >
            <Select
              placeholder="Chọn quận/huyện"
              className={cx("form-select")}
              onChange={handleDistrictChange}
              disabled={districts.length === 0}
            >
              {districts.map((district) => (
                <Option key={district} value={district}>
                  {district}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ward"
            label="Phường/Xã"
            className={cx("form-item")}
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select
              placeholder="Chọn phường/xã"
              className={cx("form-select")}
              disabled={wards.length === 0}
            >
              {wards.map((ward) => (
                <Option key={ward} value={ward}>
                  {ward}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="detailAddress"
            label="Địa chỉ chi tiết"
            className={cx("form-item")}
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
            ]}
          >
            <Input
              className={cx("form-input")}
              placeholder="Nhập số nhà, tên đường, tòa nhà,..."
            />
          </Form.Item>

          <Form.Item
            name="isDefault"
            valuePropName="checked"
            className={cx("form-checkbox")}
          >
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>

          <div className={cx("form-actions")}>
            <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingAddress ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default PageAddress;
