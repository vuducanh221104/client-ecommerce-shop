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
  HomeOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import styles from "./page.module.scss";
import classNames from "classnames/bind";
import {
  Address,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const cx = classNames.bind(styles);
const { Option } = Select;

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [deletingAddress, setDeletingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const router = useRouter();
  const currentUser = useSelector(
    (state: RootState) => state.auth.login.currentUser
  );

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }

    fetchAddresses();
    // Set sample provinces data
    setProvinces(["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ"]);
  }, [currentUser, router]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      message.error("Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.setFieldsValue({
      street: address.street,
      city: address.city,
      district: address.district,
      ward: address.ward || "",
      country: address.country || "Vietnam",
      isDefault: address.isDefault,
    });

    handleProvinceChange(address.city);
    handleDistrictChange(address.district);

    setModalVisible(true);
  };

  // Open confirmation dialog for address deletion
  const handleDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteModalVisible(true);
  };

  // Confirm address deletion
  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      setDeletingAddress(true);
      await deleteUserAddress(addressToDelete);

      message.success("Đã xóa địa chỉ thành công");
      await fetchAddresses();

      setDeleteModalVisible(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error("Failed to delete address:", error);
      message.error("Không thể xóa địa chỉ");
    } finally {
      setDeletingAddress(false);
    }
  };

  // Cancel address deletion
  const cancelDeleteAddress = () => {
    setDeleteModalVisible(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      await fetchAddresses();
      message.success("Đã đặt địa chỉ mặc định thành công");
    } catch (error) {
      console.error("Failed to set default address:", error);
      message.error("Không thể đặt địa chỉ mặc định");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAddress && editingAddress._id) {
        await updateUserAddress(editingAddress._id, values);
        message.success("Cập nhật địa chỉ thành công");
      } else {
        await addUserAddress(values);
        message.success("Thêm địa chỉ mới thành công");
      }

      await fetchAddresses();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleProvinceChange = (value: string) => {
    form.setFieldsValue({ district: undefined, ward: undefined });
    if (value === "Hà Nội") {
      setDistricts([
        "Ba Đình",
        "Hoàn Kiếm",
        "Hai Bà Trưng",
        "Đống Đa",
        "Tây Hồ",
        "Cầu Giấy",
        "Thanh Xuân",
        "Hoàng Mai",
      ]);
    } else if (value === "Hồ Chí Minh") {
      setDistricts([
        "Quận 1",
        "Quận 2",
        "Quận 3",
        "Quận 4",
        "Quận 5",
        "Quận 6",
        "Quận 7",
        "Quận 8",
      ]);
    } else if (value === "Đà Nẵng") {
      setDistricts([
        "Hải Châu",
        "Thanh Khê",
        "Sơn Trà",
        "Ngũ Hành Sơn",
        "Liên Chiểu",
        "Cẩm Lệ",
      ]);
    } else {
      setDistricts([]);
    }
    setWards([]);
  };

  const handleDistrictChange = (value: string) => {
    form.setFieldsValue({ ward: undefined });

    // Set sample wards based on district
    if (["Cầu Giấy", "Ba Đình", "Đống Đa"].includes(value)) {
      setWards([
        "Phường 1",
        "Phường 2",
        "Phường 3",
        "Phường 4",
        "Phường 5",
        "Phường 6",
      ]);
    } else if (["Quận 1", "Quận 2", "Quận 3"].includes(value)) {
      setWards([
        "Phường 1",
        "Phường 2",
        "Phường 3",
        "Phường 4",
        "Phường 5",
        "Phường 6",
      ]);
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
          {addresses.length === 0 ? (
            <div className={cx("no-address")}>
              <EnvironmentOutlined className={cx("no-address-icon")} />
              <p>Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
            </div>
          ) : (
            addresses.map((address) => (
              <Card key={address._id} className={cx("address-card")}>
                <div className={cx("address-header")}>
                  <div className={cx("address-title")}>
                    <HomeOutlined className={cx("address-icon")} />
                    <span className={cx("title-text")}>Địa chỉ</span>
                    {address.isDefault && (
                      <span className={cx("default-badge")}>
                        <CheckCircleOutlined />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className={cx("address-actions")}>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditAddress(address)}
                      className={cx("action-button")}
                    >
                      Sửa
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDeleteAddress(address._id as string)}
                      className={cx("action-button")}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>

                <div className={cx("address-content")}>
                  <p className={cx("street")}>{address.street}</p>
                  <p className={cx("location")}>
                    {address.ward && `${address.ward}, `}
                    {address.district}, {address.city}
                    {address.country ? `, ${address.country}` : ""}
                  </p>
                </div>

                {!address.isDefault && (
                  <Button
                    type="link"
                    onClick={() => handleSetDefault(address._id as string)}
                    className={cx("set-default-button")}
                  >
                    Đặt làm địa chỉ mặc định
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit/Add Address Modal */}
      <Modal
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        className={cx("address-modal")}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ country: "Vietnam" }}
        >
          <Form.Item
            name="street"
            label="Địa chỉ cụ thể"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ cụ thể" },
            ]}
          >
            <Input placeholder="Số nhà, tên đường, tòa nhà, ..." />
          </Form.Item>

          <Form.Item
            name="city"
            label="Tỉnh/Thành phố"
            rules={[
              { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
            ]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
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
            rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
          >
            <Select
              placeholder="Chọn quận/huyện"
              onChange={handleDistrictChange}
              disabled={!form.getFieldValue("city")}
            >
              {districts.map((district) => (
                <Option key={district} value={district}>
                  {district}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="ward" label="Phường/Xã">
            <Select
              placeholder="Chọn phường/xã"
              disabled={!form.getFieldValue("district")}
            >
              {wards.map((ward) => (
                <Option key={ward} value={ward}>
                  {ward}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="country" label="Quốc gia" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked">
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

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <WarningOutlined
              style={{
                color: "#ff4d4f",
                marginRight: "10px",
                fontSize: "22px",
              }}
            />
            <span>Xác nhận xóa địa chỉ</span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={cancelDeleteAddress}
        confirmLoading={deletingAddress}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        onOk={confirmDeleteAddress}
      >
        <p>Bạn có chắc chắn muốn xóa địa chỉ này?</p>
        <p>Địa chỉ sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
      </Modal>
    </div>
  );
}
