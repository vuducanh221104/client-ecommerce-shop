"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Card,
  Typography,
  Tag,
  Avatar,
  Row,
  Col,
  Tooltip,
  Modal,
  Form,
  Select,
  Spin,
  Tabs,
  Divider,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
} from "@/services/adminServices";
import RefreshButton from "@/components/admin/RefreshButton";

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Address {
  _id?: string;
  street: string;
  city: string;
  country: string;
  district: string;
  ward: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  _id?: string;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  type: string;
  role: number;
  gender: string;
  status: number;
  dateOfBirth?: string;
  phoneNumber?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Fetch users data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      console.log("API Response:", response); // Debug log

      // Check the actual response structure
      const usersData = response?.data?.users || response?.users || [];
      console.log("Users data:", usersData); // Debug log

      if (usersData && usersData.length > 0) {
        // Map the users data to match our interface
        const mappedUsers = usersData.map((user: any) => ({
          id: user._id || "",
          _id: user._id || "",
          username: user.username || "",
          fullName: user.fullName || user.full_name || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || user.phone_number || "",
          type: user.type || "WEBSITE",
          role: typeof user.role === 'number' ? user.role : 0,
          gender: user.gender || "other",
          status: typeof user.status === 'number' ? user.status : 1,
          dateOfBirth: user.dateOfBirth || user.date_of_birth || "",
          addresses: Array.isArray(user.addresses) ? user.addresses : [],
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        }));

        console.log("Mapped users:", mappedUsers); // Debug log
        setUsers(mappedUsers);
      } else {
        console.log("No users data found"); // Debug log
        setUsers([]);
        message.error("Không có dữ liệu người dùng");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Không thể tải danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setRefreshLoading(true);
      await fetchData();
      message.success("Dữ liệu đã được làm mới");
    } catch (error) {
      console.error("Error refreshing data:", error);
      message.error("Không thể làm mới dữ liệu");
    } finally {
      setRefreshLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Handle edit button click
  const handleEditClick = (user: User) => {
    setEditingUser(user);

    // Reset and initialize form fields
    editForm.resetFields();

    // Format date of birth if exists
    const formattedDateOfBirth = user.dateOfBirth
      ? user.dateOfBirth.split("T")[0]
      : undefined;

    // Get values for form
    const formValues = {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      gender: user.gender,
      status: user.status,
      role: user.role,
      type: user.type,
      dateOfBirth: formattedDateOfBirth,
      addresses: user.addresses || [],
    };


    // Set initial form values
    editForm.setFieldsValue(formValues);

    setEditModalVisible(true);
  };

  // Handle modal cancel
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingUser(null);
  };

  // Handle create modal cancel
  const handleCreateCancel = () => {
    setCreateModalVisible(false);
    createForm.resetFields();
  };

  // Handle form submission for editing
  const handleEditSubmit = async (values: any) => {
    if (!editingUser) return;

    try {
      setEditLoading(true);

      // Prepare data for update
      const userData = {
        username: values.username,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        status: values.status,
        role: values.role,
        type: values.type,
        dateOfBirth: values.dateOfBirth,
        addresses: values.addresses,
      };

      // Call API to update user
      const response = await updateUser(editingUser.id, userData);

      if (response) {
        // Update users list
        const updatedUsers = users.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        );
        setUsers(updatedUsers);

        message.success("User updated successfully");
        setEditModalVisible(false);
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle form submission for creating
  const handleCreateSubmit = async (values: any) => {
    try {
      setCreateLoading(true);

      if (!values.password) {
        message.error("Password is required");
        setCreateLoading(false);
        return;
      }

      // Prepare data for creating a new user
      const userData = {
        username: values.username,
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        status: values.status,
        role: values.role,
        type: values.type,
        dateOfBirth: values.dateOfBirth,
        addresses: values.addresses || [],
      };

      // Call API to create user
      const response = await createUser(userData);

      if (response) {
        // Refresh users list
        const usersData = await getAllUsers();
        if (usersData && usersData.users) {
          // Map MongoDB _id to id for proper functionality
          const mappedUsers = usersData.users.map((user: any) => ({
            ...user,
            id: user._id,
            // Ensure all needed fields exist
            fullName: user.fullName || user.username,
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
            addresses: user.addresses || [],
          }));
          setUsers(mappedUsers);
        }

        message.success("User created successfully");
        setCreateModalVisible(false);
        createForm.resetFields();
      }
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle toggle user status (active/inactive)
  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 1 ? 0 : 1;

      // Call API to update user status
      await updateUser(user.id, { status: newStatus });

      // Update users list
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      );
      setUsers(updatedUsers);

      message.success(
        `User ${newStatus === 1 ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Failed to update user status");
    }
  };

  // Filter users based on search text
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get role label
  const getRoleLabel = (role: number) => {
    switch (role) {
      case 0:
        return { label: "User", color: "blue" };
      case 1:
        return { label: "Admin", color: "red" };
      case 2:
        return { label: "Staff", color: "orange" };
      default:
        return { label: "Unknown", color: "default" };
    }
  };

  // Get status label
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Active", color: "green" };
      case 0:
        return { label: "Inactive", color: "red" };
      default:
        return { label: "Unknown", color: "default" };
    }
  };

  // Table columns
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: User, b: User) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      key: "phoneNumber",
      render: (_: unknown, record: User) => (
        <span>{record.phoneNumber || "N/A"}</span>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (_: unknown, record: User) => {
        const { label, color } = getRoleLabel(record.role);
        return <Tag color={color}>{label}</Tag>;
      },
      sorter: (a: User, b: User) => a.role - b.role,
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: User) => {
        const { label, color } = getStatusLabel(record.status);
        return <Tag color={color}>{label}</Tag>;
      },
      sorter: (a: User, b: User) => a.status - b.status,
    },
    {
      title: "Created Date",
      key: "createdAt",
      render: (_: unknown, record: User) => (
        <div>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {formatDate(record.createdAt)}
        </div>
      ),
      sorter: (a: User, b: User) => {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={`Are you sure you want to ${
              record.status === 1 ? "deactivate" : "activate"
            } this user?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type={record.status === 1 ? "default" : "primary"}
              icon={record.status === 1 ? <LockOutlined /> : <UnlockOutlined />}
              style={{
                backgroundColor: record.status === 1 ? "#fff" : "#52c41a",
                borderColor: record.status === 1 ? "#d9d9d9" : "#52c41a",
                color: record.status === 1 ? "rgba(0, 0, 0, 0.85)" : "#fff",
              }}
              danger={record.status === 1}
            >
              {record.status === 1 ? "Deactivate" : "Activate"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-users-page">
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2}>Quản lý người dùng</Title>
          </Col>
          <Col>
            <Space>
              <RefreshButton 
                onClick={handleRefresh} 
                isLoading={refreshLoading} 
              />
              <Input
                placeholder="Tìm kiếm người dùng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Add New User
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={handleEditCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={editLoading}
            onClick={() => editForm.submit()}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Spin spinning={editLoading}>
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              gender: "other",
              status: 1,
              role: 0,
              type: "WEBSITE",
            }}
          >
            <Tabs defaultActiveKey="basic">
              <TabPane tab="Basic Information" key="basic">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter username",
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter full name",
                        },
                      ]}
                    >
                      <Input placeholder="Full Name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter email",
                          type: "email",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phoneNumber" label="Phone Number">
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Phone Number"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="gender" label="Gender">
                      <Select placeholder="Select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="status" label="Status">
                      <Select placeholder="Select status">
                        <Option value={1}>Active</Option>
                        <Option value={0}>Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="role" label="Role">
                      <Select placeholder="Select role">
                        <Option value={0}>User</Option>
                        <Option value={1}>Admin</Option>
                        <Option value={2}>Staff</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="dateOfBirth" label="Date of Birth">
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="type" label="Account Type">
                      <Select placeholder="Select account type">
                        <Option value="WEBSITE">Website</Option>
                        <Option value="GOOGLE">Google</Option>
                        <Option value="FACEBOOK">Facebook</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Addresses" key="addresses">
                <Form.List name="addresses">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div
                          key={key}
                          style={{
                            marginBottom: 24,
                            border: "1px solid #f0f0f0",
                            padding: 16,
                            borderRadius: 8,
                          }}
                        >
                          <Row gutter={16} align="middle">
                            <Col span={22}>
                              <Title level={5}>Address {name + 1}</Title>
                            </Col>
                            <Col span={2} style={{ textAlign: "right" }}>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                name={[name, "street"]}
                                label="Street"
                                rules={[
                                  {
                                    required: true,
                                    message: "Street is required",
                                  },
                                ]}
                              >
                                <Input
                                  prefix={<HomeOutlined />}
                                  placeholder="Street address"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name={[name, "district"]}
                                label="District"
                                rules={[
                                  {
                                    required: true,
                                    message: "District is required",
                                  },
                                ]}
                              >
                                <Input placeholder="District" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item
                                name={[name, "ward"]}
                                label="Ward"
                                rules={[
                                  {
                                    required: true,
                                    message: "Ward is required",
                                  },
                                ]}
                              >
                                <Input placeholder="Ward" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={[name, "city"]}
                                label="City"
                                rules={[
                                  {
                                    required: true,
                                    message: "City is required",
                                  },
                                ]}
                              >
                                <Input placeholder="City" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={[name, "country"]}
                                label="Country"
                                rules={[
                                  {
                                    required: true,
                                    message: "Country is required",
                                  },
                                ]}
                              >
                                <Input placeholder="Country" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            name={[name, "isDefault"]}
                            valuePropName="checked"
                          >
                            <Select>
                              <Option key="true" value={true}>
                                Default Address
                              </Option>
                              <Option key="false" value={false}>
                                Not Default
                              </Option>
                            </Select>
                          </Form.Item>
                        </div>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() =>
                            add({
                              street: "",
                              city: "",
                              country: "Vietnam",
                              district: "",
                              ward: "",
                              isDefault: false,
                            })
                          }
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Address
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </TabPane>
            </Tabs>
          </Form>
        </Spin>
      </Modal>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={createModalVisible}
        onCancel={handleCreateCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCreateCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={createLoading}
            onClick={() => createForm.submit()}
          >
            Create User
          </Button>,
        ]}
      >
        <Spin spinning={createLoading}>
          <Form
            form={createForm}
            layout="vertical"
            onFinish={handleCreateSubmit}
            initialValues={{
              gender: "other",
              status: 1,
              role: 0,
              type: "WEBSITE",
              addresses: [],
            }}
          >
            <Tabs defaultActiveKey="basic">
              <TabPane tab="Basic Information" key="basic">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        {
                          required: true,
                          message: "Please enter username",
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter full name",
                        },
                      ]}
                    >
                      <Input placeholder="Full Name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          message: "Please enter email",
                          type: "email",
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter password",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="phoneNumber" label="Phone Number">
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Phone Number"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="dateOfBirth" label="Date of Birth">
                      <Input type="date" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="gender" label="Gender">
                      <Select placeholder="Select gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="status" label="Status">
                      <Select placeholder="Select status">
                        <Option value={1}>Active</Option>
                        <Option value={0}>Inactive</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="role" label="Role">
                      <Select placeholder="Select role">
                        <Option value={0}>User</Option>
                        <Option value={1}>Admin</Option>
                        <Option value={2}>Staff</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="type" label="Account Type">
                  <Select placeholder="Select account type">
                    <Option value="WEBSITE">Website</Option>
                    <Option value="GOOGLE">Google</Option>
                    <Option value="FACEBOOK">Facebook</Option>
                  </Select>
                </Form.Item>
              </TabPane>

              <TabPane tab="Addresses" key="addresses">
                <Form.List name="addresses">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div
                          key={key}
                          style={{
                            marginBottom: 24,
                            border: "1px solid #f0f0f0",
                            padding: 16,
                            borderRadius: 8,
                          }}
                        >
                          <Row gutter={16} align="middle">
                            <Col span={22}>
                              <Title level={5}>Address {name + 1}</Title>
                            </Col>
                            <Col span={2} style={{ textAlign: "right" }}>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                name={[name, "street"]}
                                label="Street"
                                rules={[
                                  {
                                    required: true,
                                    message: "Street is required",
                                  },
                                ]}
                              >
                                <Input
                                  prefix={<HomeOutlined />}
                                  placeholder="Street address"
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name={[name, "district"]}
                                label="District"
                                rules={[
                                  {
                                    required: true,
                                    message: "District is required",
                                  },
                                ]}
                              >
                                <Input placeholder="District" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row gutter={16}>
                            <Col span={8}>
                              <Form.Item
                                name={[name, "ward"]}
                                label="Ward"
                                rules={[
                                  {
                                    required: true,
                                    message: "Ward is required",
                                  },
                                ]}
                              >
                                <Input placeholder="Ward" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={[name, "city"]}
                                label="City"
                                rules={[
                                  {
                                    required: true,
                                    message: "City is required",
                                  },
                                ]}
                              >
                                <Input placeholder="City" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                name={[name, "country"]}
                                label="Country"
                                rules={[
                                  {
                                    required: true,
                                    message: "Country is required",
                                  },
                                ]}
                              >
                                <Input placeholder="Country" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            name={[name, "isDefault"]}
                            valuePropName="checked"
                          >
                            <Select>
                              <Option key="true" value={true}>
                                Default Address
                              </Option>
                              <Option key="false" value={false}>
                                Not Default
                              </Option>
                            </Select>
                          </Form.Item>
                        </div>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() =>
                            add({
                              street: "",
                              city: "",
                              country: "Vietnam",
                              district: "",
                              ward: "",
                              isDefault: false,
                            })
                          }
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Address
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </TabPane>
            </Tabs>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default UsersPage;
