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
  Row,
  Col,
  Modal,
  Form,
  Select,
  Spin,
  Divider,
  Descriptions,
  List,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "@/services/adminServices";
import * as httpRequest from "@/utils/httpRequest";

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderItem {
  _id: string;
  product_id: string;
  priceOrder: number;
  quantity: number;
  colorOrder: string;
  sizeOrder: string;
  createdAt: string;
  updatedAt: string;
  productName?: string;
  productImage?: string;
}

interface ShippingAddress {
  full_name: string;
  phone_number: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  user_id: string;
  customer_email: string;
  items: OrderItem[];
  total_amount: number;
  payment: Payment;
  status: string;
  shipping_address: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState<boolean>(false);

  // Fetch orders data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();

        if (response?.data?.orders) {
          setOrders(response.data.orders);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to load orders");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle order deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order.id !== id));
      message.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Failed to delete order");
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Handle view button click
  const handleViewClick = (order: Order) => {
    setViewingOrder(order);
    setViewModalVisible(true);
  };

  // Handle edit button click
  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
    editForm.setFieldsValue({
      status: order.status,
      notes: order.notes || "",
      paymentStatus: order.payment.status,
    });
    setEditModalVisible(true);
  };

  // Handle modal cancel
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingOrder(null);
  };

  // Handle view modal cancel
  const handleViewCancel = () => {
    setViewModalVisible(false);
    setViewingOrder(null);
  };

  // Handle form submission for editing
  const handleEditSubmit = async (values: any) => {
    if (!editingOrder) return;

    try {
      setEditLoading(true);
      console.log("Updating order with values:", values);

      // Update order status
      const statusResponse = await updateOrderStatus(
        editingOrder.id,
        values.status
      );
      console.log("Status update response:", statusResponse);

      // Also update payment status if changed
      let paymentResponse = null;
      if (values.paymentStatus !== editingOrder.payment.status) {
        console.log("Updating payment status to:", values.paymentStatus);
        paymentResponse = await httpRequest.put(
          `api/v1/orders/${editingOrder.id}/payment`,
          { paymentStatus: values.paymentStatus }
        );
        console.log("Payment update response:", paymentResponse);
      }

      // Update notes if changed
      let notesResponse = null;
      if (values.notes !== editingOrder.notes) {
        console.log("Updating order notes");
        notesResponse = await httpRequest.put(
          `api/v1/orders/${editingOrder.id}`,
          { notes: values.notes }
        );
        console.log("Notes update response:", notesResponse);
      }

      // Update orders list
      const updatedOrders = orders.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              status: values.status,
              notes: values.notes,
              payment: { ...order.payment, status: values.paymentStatus },
            }
          : order
      );
      setOrders(updatedOrders);

      message.success("Order updated successfully");
      setEditModalVisible(false);
      setEditingOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      message.error("Failed to update order");
    } finally {
      setEditLoading(false);
    }
  };

  // Filter orders based on search text
  const filteredOrders = orders.filter(
    (order) =>
      (order?.customer_email?.toLowerCase() || "").includes(
        searchText.toLowerCase()
      ) ||
      (order?.status?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (order?.shipping_address?.full_name?.toLowerCase() || "").includes(
        searchText.toLowerCase()
      )
  );

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { label: "Pending", color: "blue" };
      case "processing":
        return { label: "Processing", color: "orange" };
      case "shipped":
        return { label: "Shipped", color: "cyan" };
      case "delivered":
        return { label: "Delivered", color: "green" };
      case "cancelled":
        return { label: "Cancelled", color: "red" };
      case "refunded":
        return { label: "Refunded", color: "purple" };
      default:
        return { label: status || "Unknown", color: "default" };
    }
  };

  // Table columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 220,
      render: (_: unknown, record: Order) => <Text copyable>{record.id}</Text>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: unknown, record: Order) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.shipping_address.full_name}</Text>
          <Text type="secondary">{record.customer_email}</Text>
        </Space>
      ),
    },
    {
      title: "Total Items",
      key: "totalItems",
      width: 100,
      render: (_: unknown, record: Order) => {
        const totalQuantity = record.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        return (
          <Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
            {totalQuantity} items
          </Tag>
        );
      },
      sorter: (a: Order, b: Order) => {
        const totalA = a.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalB = b.items.reduce((sum, item) => sum + item.quantity, 0);
        return totalA - totalB;
      },
    },
    {
      title: "Total Amount",
      key: "total_amount",
      render: (_: unknown, record: Order) => (
        <span>{formatCurrency(record.total_amount)}</span>
      ),
      sorter: (a: Order, b: Order) => a.total_amount - b.total_amount,
    },
    {
      title: "Payment",
      key: "payment",
      render: (_: unknown, record: Order) => (
        <Space direction="vertical" size="small">
          <Text>{record.payment.method}</Text>
          <Tag color={record.payment.status === "PENDING" ? "gold" : "green"}>
            {record.payment.status}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: unknown, record: Order) => {
        const { label, color } = getStatusLabel(record.status);
        return <Tag color={color}>{label}</Tag>;
      },
      filters: [
        { text: "Pending", value: "PENDING" },
        { text: "Processing", value: "PROCESSING" },
        { text: "Shipped", value: "SHIPPED" },
        { text: "Delivered", value: "DELIVERED" },
        { text: "Cancelled", value: "CANCELLED" },
      ],
      onFilter: (value: any, record: Order) =>
        record.status.toUpperCase() === value,
    },
    {
      title: "Created Date",
      key: "createdAt",
      render: (_: unknown, record: Order) => (
        <div>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {formatDate(record.createdAt)}
        </div>
      ),
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewClick(record)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this order?"
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
    <div className="admin-orders-page">
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2}>Orders Management</Title>
          </Col>
          <Col>
            <Input
              placeholder="Search by customer email or name"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* Edit Order Modal */}
      <Modal
        title="Update Order Status"
        open={editModalVisible}
        onCancel={handleEditCancel}
        width={600}
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
            Update Order
          </Button>,
        ]}
      >
        <Spin spinning={editLoading}>
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              status: "PENDING",
              paymentStatus: "PENDING",
            }}
          >
            <Form.Item
              name="status"
              label="Order Status"
              rules={[
                { required: true, message: "Please select order status" },
              ]}
            >
              <Select placeholder="Select status">
                <Option value="PENDING">Pending</Option>
                <Option value="PROCESSING">Processing</Option>
                <Option value="SHIPPED">Shipped</Option>
                <Option value="DELIVERED">Delivered</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
            </Form.Item>

            <Form.Item name="paymentStatus" label="Payment Status">
              <Select placeholder="Select payment status">
                <Option value="PENDING">Pending</Option>
                <Option value="PAID">Paid</Option>
                <Option value="COMPLETED">Completed</Option>
                <Option value="FAILED">Failed</Option>
                <Option value="REFUNDED">Refunded</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea
                rows={4}
                placeholder="Add notes about this order"
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* View Order Modal */}
      <Modal
        title="Order Details"
        open={viewModalVisible}
        onCancel={handleViewCancel}
        width={800}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              handleViewCancel();
              if (viewingOrder) handleEditClick(viewingOrder);
            }}
          >
            Edit Order
          </Button>,
        ]}
      >
        {viewingOrder && (
          <div>
            <Descriptions title="Basic Information" bordered column={2}>
              <Descriptions.Item label="Order ID">
                <Text strong>{viewingOrder.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {(() => {
                  const { label, color } = getStatusLabel(viewingOrder.status);
                  return <Tag color={color}>{label}</Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {viewingOrder.customer_email}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text type="danger" strong>
                  {formatCurrency(viewingOrder.total_amount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {viewingOrder.payment.method}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag
                  color={
                    viewingOrder.payment.status === "PENDING" ? "gold" : "green"
                  }
                >
                  {viewingOrder.payment.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {formatDate(viewingOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Updated Date">
                {formatDate(viewingOrder.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Notes" span={2}>
                {viewingOrder.notes || "No notes"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={5}>Shipping Address</Title>
            <Card>
              <Descriptions column={2}>
                <Descriptions.Item label="Full Name">
                  {viewingOrder.shipping_address.full_name}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {viewingOrder.shipping_address.phone_number}
                </Descriptions.Item>
                <Descriptions.Item label="Street">
                  {viewingOrder.shipping_address.street}
                </Descriptions.Item>
                <Descriptions.Item label="Ward">
                  {viewingOrder.shipping_address.ward}
                </Descriptions.Item>
                <Descriptions.Item label="District">
                  {viewingOrder.shipping_address.district}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {viewingOrder.shipping_address.city}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {viewingOrder.shipping_address.country}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Divider />

            <Title level={5}>Order Items</Title>
            <List
              itemLayout="vertical"
              dataSource={viewingOrder.items}
              renderItem={(item: OrderItem) => (
                <List.Item
                  key={item._id}
                  style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "8px",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={4}>
                      {item.productImage ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "100%",
                          }}
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                              border: "1px solid #f0f0f0",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            paddingTop: "100%",
                            position: "relative",
                            background: "#f5f5f5",
                            borderRadius: "4px",
                          }}
                        >
                          <ShoppingCartOutlined
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              fontSize: 24,
                              color: "#bfbfbf",
                            }}
                          />
                        </div>
                      )}
                    </Col>
                    <Col span={20}>
                      <Row gutter={[0, 8]}>
                        <Col span={24}>
                          <Text strong style={{ fontSize: "16px" }}>
                            {item.productName}
                          </Text>
                        </Col>
                        <Col span={24}>
                          <Space size={16}>
                            <Tag color="blue">Color: {item.colorOrder}</Tag>
                            <Tag color="purple">Size: {item.sizeOrder}</Tag>
                            <Tag color="orange">Qty: {item.quantity}</Tag>
                          </Space>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Space direction="vertical" size={4}>
                                <Text type="secondary">Unit Price:</Text>
                                <Text>{formatCurrency(item.priceOrder)}</Text>
                              </Space>
                            </Col>
                            <Col>
                              <Space direction="vertical" size={4} align="end">
                                <Text type="secondary">Subtotal:</Text>
                                <Text
                                  strong
                                  style={{ fontSize: "16px", color: "#f50" }}
                                >
                                  {formatCurrency(
                                    item.priceOrder * item.quantity
                                  )}
                                </Text>
                              </Space>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </List.Item>
              )}
              footer={
                <div
                  style={{
                    background: "#f8f8f8",
                    padding: "16px",
                    borderRadius: "8px",
                    marginTop: "16px",
                  }}
                >
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong style={{ fontSize: "16px" }}>
                        Total Items: {viewingOrder.items.length}
                      </Text>
                    </Col>
                    <Col>
                      <Space direction="vertical" size={4} align="end">
                        <Text type="secondary">Order Total:</Text>
                        <Text
                          strong
                          style={{ fontSize: "20px", color: "#f50" }}
                        >
                          {formatCurrency(viewingOrder.total_amount)}
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                </div>
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
