"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tag,
  Button,
  Empty,
  Typography,
  Divider,
  Badge,
  Tabs,
  Skeleton,
  message,
} from "antd";
import {
  FileTextOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import httpRequest from "@/utils/httpRequest";

const { Title, Text } = Typography;
const cx = classNames.bind(styles);

interface OrderItem {
  _id: string;
  product_id: string;
  priceOrder: number;
  quantity: number;
  colorOrder?: string;
  sizeOrder?: string;
  createdAt: string;
  updatedAt: string;
  productName: string;
  productSlug: string;
  thumb: string;
}

interface ShippingAddress {
  full_name: string;
  phone_number: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  method: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id?: string;
  id: string;
  user_id: string;
  customer_email: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  payment: Payment;
  total_amount: number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  status: string;
}

// Services to fetch and cancel orders
const getUserOrders = async (): Promise<OrdersResponse> => {
  try {
    const response = await httpRequest.get("api/v1/orders/my-orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const cancelOrder = async (orderId: string) => {
  try {
    const response = await httpRequest.patch(`api/v1/orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const router = useRouter();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrders();
        console.log("API response:", response);

        if (response && response.status === "success") {
          setOrders(response.data.orders || []);
        } else {
          message.error(response?.message || "Không thể tải đơn hàng");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Không thể tải danh sách đơn hàng");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  console.log(orders);

  // Lọc đơn hàng theo trạng thái cho tab
  const filteredOrders =
    currentTab === "all"
      ? orders || []
      : (orders || []).filter((order) => order.status === currentTab);

  // Hàm format giá tiền
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Hàm format ngày tháng
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "PROCESSING":
        return "blue";
      case "SHIPPED":
        return "cyan";
      case "DELIVERED":
        return "green";
      case "CANCELLED":
        return "red";
      case "RETURNED":
        return "volcano";
      default:
        return "default";
    }
  };

  // Hàm lấy tên trạng thái
  const getStatusName = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      case "RETURNED":
        return "Đã trả hàng";
      default:
        return status;
    }
  };

  // Các tab cho trạng thái đơn hàng
  const tabs = [
    {
      key: "all",
      label: "Tất cả",
      icon: <ShoppingOutlined />,
    },
    {
      key: "PENDING",
      label: "Chờ xác nhận",
      icon: <ClockCircleOutlined />,
    },
    {
      key: "PROCESSING",
      label: "Đang xử lý",
      icon: <FileTextOutlined />,
    },
    {
      key: "SHIPPED",
      label: "Đang giao",
      icon: <ShoppingOutlined />,
    },
    {
      key: "DELIVERED",
      label: "Đã giao",
      icon: <CheckCircleOutlined />,
    },
    {
      key: "CANCELLED",
      label: "Đã hủy",
      icon: <CloseCircleOutlined />,
    },
  ];

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Hàm lấy trạng thái thanh toán
  const getPaymentStatusText = (method: string, status: string) => {
    if (status === "COMPLETED") {
      return "Đã thanh toán";
    } else if (method === "COD" && status === "PENDING") {
      return "Thanh toán khi nhận hàng";
    } else {
      return "Chưa thanh toán";
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      case "CREDIT_CARD":
        return "Thẻ tín dụng";
      case "MOMO":
        return "Ví MoMo";
      case "ZALOPAY":
        return "ZaloPay";
      default:
        return method;
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrder(orderId);
      const response = await cancelOrder(orderId);

      if (response && response.status === "success") {
        // Update order status in the UI
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, status: "CANCELLED" as const }
              : order
          )
        );

        message.success("Đơn hàng đã được hủy thành công");
      } else {
        message.error(
          response?.message || "Không thể hủy đơn hàng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      message.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
    } finally {
      setCancellingOrder(null);
    }
  };

  return (
    <div className={cx("orders-container")}>
      <Title level={2} className={cx("page-title")}>
        Đơn hàng của tôi
      </Title>

      {loading ? (
        <div className={cx("loading-container")}>
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      ) : orders.length === 0 ? (
        <Empty
          description="Bạn chưa có đơn hàng nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => router.push("/products")}>
            Mua sắm ngay
          </Button>
        </Empty>
      ) : (
        <>
          <Tabs
            className={cx("order-tabs")}
            activeKey={currentTab}
            onChange={(activeKey) => setCurrentTab(activeKey)}
            items={tabs.map((tab) => ({
              key: tab.key,
              label: (
                <span>
                  {tab.icon}
                  <span className={cx("tab-text")}>{tab.label}</span>
                </span>
              ),
            }))}
          />

          <div className={cx("orders-list")}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={cx("order-card")}>
                <div className={cx("order-header")}>
                  <div className={cx("order-info")}>
                    <div className={cx("order-id")}>
                      <span className={cx("label")}>Mã đơn hàng:</span>
                      <span className={cx("value")}>{order.id}</span>
                    </div>
                    <div className={cx("order-date")}>
                      <span className={cx("label")}>Ngày đặt:</span>
                      <span className={cx("value")}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className={cx("order-status")}>
                    <Tag color={getStatusColor(order.status)}>
                      {getStatusName(order.status)}
                    </Tag>
                  </div>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <div className={cx("order-summary")}>
                  <div className={cx("order-items-preview")}>
                    {order.items.slice(0, 1).map((item) => (
                      <div
                        key={item._id || `item-${Math.random()}`}
                        className={cx("item-preview")}
                      >
                        <div className={cx("item-image")}>
                          {item.thumb ? (
                            <Image
                              src={item.thumb}
                              alt={item.productName || "Sản phẩm"}
                              width={60}
                              height={60}
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className={cx("placeholder-image")}>
                              <ShoppingOutlined />
                            </div>
                          )}
                        </div>
                        <div className={cx("item-info")}>
                          <Text className={cx("item-name")}>
                            {item.productName || "Sản phẩm đã đặt"}
                          </Text>
                          <Text className={cx("item-variant")}>
                            {item.colorOrder && `Màu: ${item.colorOrder}`}
                            {item.colorOrder && item.sizeOrder && " | "}
                            {item.sizeOrder && `Size: ${item.sizeOrder}`}
                          </Text>
                          <Text className={cx("item-quantity")}>
                            SL: {item.quantity} x {formatPrice(item.priceOrder)}
                            đ
                          </Text>
                        </div>
                      </div>
                    ))}

                    {order.items.length > 1 && (
                      <div className={cx("more-items")}>
                        + {order.items.length - 1} sản phẩm khác
                      </div>
                    )}
                  </div>

                  <div className={cx("order-total-amount")}>
                    <div className={cx("total-label")}>Tổng tiền:</div>
                    <div className={cx("total-value")}>
                      {formatPrice(order.total_amount)}đ
                    </div>
                  </div>
                </div>

                <div className={cx("order-actions")}>
                  <Button
                    type="text"
                    onClick={() => toggleOrderDetails(order.id)}
                    className={cx("detail-button")}
                  >
                    {expandedOrderId === order.id ? (
                      <>
                        Ẩn chi tiết <UpOutlined />
                      </>
                    ) : (
                      <>
                        Xem chi tiết <DownOutlined />
                      </>
                    )}
                  </Button>

                  {order.status === "PENDING" && (
                    <Button
                      danger
                      type="text"
                      className={cx("cancel-button")}
                      onClick={() => handleCancelOrder(order.id)}
                      loading={cancellingOrder === order.id}
                    >
                      Hủy đơn hàng
                    </Button>
                  )}

                  {order.status === "DELIVERED" && (
                    <Button type="primary" className={cx("review-button")}>
                      Đánh giá
                    </Button>
                  )}
                </div>

                {expandedOrderId === order.id && (
                  <div className={cx("order-details")}>
                    <Divider orientation="left">Chi tiết đơn hàng</Divider>

                    <div className={cx("details-grid")}>
                      <div className={cx("details-section")}>
                        <Title level={5}>Thông tin giao hàng</Title>
                        <div className={cx("address-info")}>
                          <p>
                            <UserOutlined /> {order.shipping_address.full_name}
                          </p>
                          <p>
                            <PhoneOutlined />{" "}
                            {order.shipping_address.phone_number}
                          </p>
                          <p>
                            <MailOutlined /> {order.customer_email}
                          </p>
                          <p>
                            <HomeOutlined />{" "}
                            {`${order.shipping_address.street}, ${order.shipping_address.ward}, ${order.shipping_address.district}, ${order.shipping_address.city}, ${order.shipping_address.country}`}
                          </p>
                        </div>
                      </div>

                      <div className={cx("details-section")}>
                        <Title level={5}>Thông tin thanh toán</Title>
                        <div className={cx("payment-info")}>
                          <p>
                            <span className={cx("label")}>Phương thức:</span>{" "}
                            {getPaymentMethodText(order.payment.method)}
                          </p>
                          <p>
                            <span className={cx("label")}>Trạng thái:</span>{" "}
                            <Badge
                              status={
                                order.payment.status === "COMPLETED"
                                  ? "success"
                                  : "warning"
                              }
                              text={getPaymentStatusText(
                                order.payment.method,
                                order.payment.status
                              )}
                            />
                          </p>
                        </div>
                      </div>
                    </div>

                    <Divider orientation="left">Danh sách sản phẩm</Divider>

                    <div className={cx("full-items-list")}>
                      {order.items.map((item) => (
                        <div
                          key={item._id || `full-item-${Math.random()}`}
                          className={cx("full-item")}
                        >
                          <div className={cx("item-image")}>
                            {item.thumb ? (
                              <Image
                                src={item.thumb}
                                alt={item.productName || "Sản phẩm"}
                                width={80}
                                height={80}
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div className={cx("placeholder-image", "large")}>
                                <ShoppingOutlined />
                              </div>
                            )}
                          </div>
                          <div className={cx("item-info")}>
                            {item.productSlug ? (
                              <Link href={`/product/${item.productSlug}`}>
                                <Text strong className={cx("item-name")}>
                                  {item.productName || "Sản phẩm"}
                                </Text>
                              </Link>
                            ) : (
                              <Text strong className={cx("item-name")}>
                                Sản phẩm đã đặt
                              </Text>
                            )}
                            {(item.colorOrder || item.sizeOrder) && (
                              <Text className={cx("item-variant")}>
                                {item.colorOrder && `Màu: ${item.colorOrder}`}
                                {item.colorOrder && item.sizeOrder && " | "}
                                {item.sizeOrder && `Size: ${item.sizeOrder}`}
                              </Text>
                            )}
                          </div>
                          <div className={cx("item-pricing")}>
                            <Text className={cx("item-price")}>
                              {formatPrice(item.priceOrder)}đ
                            </Text>
                            <Text className={cx("item-quantity")}>
                              x{item.quantity}
                            </Text>
                            <Text className={cx("item-subtotal")}>
                              {formatPrice(item.priceOrder * item.quantity)}đ
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={cx("order-totals")}>
                      <div className={cx("total-row")}>
                        <span>Tạm tính:</span>
                        <span>{formatPrice(order.total_amount)}đ</span>
                      </div>
                      <div className={cx("total-row")}>
                        <span>Phí vận chuyển:</span>
                        <span>Miễn phí</span>
                      </div>
                      <div className={cx("total-row", "final-total")}>
                        <span>Tổng cộng:</span>
                        <span>{formatPrice(order.total_amount)}đ</span>
                      </div>
                    </div>

                    {order.notes && (
                      <>
                        <Divider orientation="left">Ghi chú</Divider>
                        <div className={cx("order-notes")}>{order.notes}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
