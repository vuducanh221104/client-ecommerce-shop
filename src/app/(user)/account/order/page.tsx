"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/AuthServices";
import styles from "./page.module.scss";
import classNames from "classnames/bind";
import {
  Table,
  Tag,
  Button,
  Empty,
  Typography,
  Divider,
  Space,
  Badge,
  Tabs,
} from "antd";
import {
  FileTextOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";

const { Title } = Typography;
const cx = classNames.bind(styles);

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipping" | "delivered" | "cancelled";
  total: number;
  payment: {
    method: string;
    status: "paid" | "unpaid";
  };
  items: number;
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/");
      return;
    }

    // Tạo dữ liệu đơn hàng mẫu
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2023-001",
        date: "2023-05-15",
        status: "delivered",
        total: 980000,
        payment: {
          method: "COD",
          status: "paid",
        },
        items: 3,
      },
      {
        id: "2",
        orderNumber: "ORD-2023-002",
        date: "2023-06-20",
        status: "shipping",
        total: 450000,
        payment: {
          method: "VNPay",
          status: "paid",
        },
        items: 1,
      },
      {
        id: "3",
        orderNumber: "ORD-2023-003",
        date: "2023-07-05",
        status: "processing",
        total: 1250000,
        payment: {
          method: "Banking",
          status: "paid",
        },
        items: 2,
      },
      {
        id: "4",
        orderNumber: "ORD-2023-004",
        date: "2023-07-10",
        status: "cancelled",
        total: 720000,
        payment: {
          method: "COD",
          status: "unpaid",
        },
        items: 2,
      },
      {
        id: "5",
        orderNumber: "ORD-2023-005",
        date: "2023-08-01",
        status: "pending",
        total: 520000,
        payment: {
          method: "Banking",
          status: "unpaid",
        },
        items: 1,
      },
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, [router]);

  // Lọc đơn hàng theo trạng thái cho tab
  const filteredOrders =
    currentTab === "all"
      ? orders
      : orders.filter((order) => order.status === currentTab);

  // Các tab cho trạng thái đơn hàng
  const tabs = [
    {
      key: "all",
      label: "Tất cả",
      icon: <ShoppingOutlined />,
    },
    {
      key: "pending",
      label: "Chờ xác nhận",
      icon: <ClockCircleOutlined />,
    },
    {
      key: "processing",
      label: "Đang xử lý",
      icon: <FileTextOutlined />,
    },
    {
      key: "shipping",
      label: "Đang giao",
      icon: <ShoppingOutlined />,
    },
    {
      key: "delivered",
      label: "Đã giao",
      icon: <CheckCircleOutlined />,
    },
    {
      key: "cancelled",
      label: "Đã hủy",
      icon: <CloseCircleOutlined />,
    },
  ];

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipping":
        return "cyan";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Hàm lấy tên trạng thái
  const getStatusName = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Cấu hình cột cho bảng đơn hàng
  const columns: TableColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString("vi-VN");
        return formattedDate;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"]) => (
        <Tag color={getStatusColor(status)}>{getStatusName(status)}</Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "payment",
      key: "payment",
      render: (payment) => (
        <Space size="small">
          <span>{payment.method}</span>
          <Badge
            status={payment.status === "paid" ? "success" : "warning"}
            text={
              payment.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
            }
          />
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <span className={cx("order-total")}>{total.toLocaleString()}đ</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="primary" size="small">
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={cx("orders-container")}>
      <Title level={4} className={cx("page-title")}>
        Đơn hàng của tôi
      </Title>
      <Divider />

      <Tabs
        activeKey={currentTab}
        onChange={setCurrentTab}
        items={tabs.map((tab) => ({
          key: tab.key,
          label: (
            <span>
              {tab.icon}
              <span className={cx("tab-text")}>{tab.label}</span>
            </span>
          ),
        }))}
        className={cx("order-tabs")}
      />

      {filteredOrders.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
          className={cx("orders-table")}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>Bạn chưa có đơn hàng nào</span>}
        >
          <Button type="primary" onClick={() => router.push("/category/nam")}>
            Mua sắm ngay
          </Button>
        </Empty>
      )}
    </div>
  );
}
