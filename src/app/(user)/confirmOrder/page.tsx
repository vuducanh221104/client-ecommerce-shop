"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/services/AuthServices";
import { getCartItems, clearCart } from "@/services/CartServices";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./confirmOrder.module.scss";
import classNames from "classnames/bind";
import { format } from "date-fns";
import { createOrder } from "@/services/OrderServices";
import { toast } from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { User } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { clearCart as clearCartRedux } from "@/redux/cartSlice";
import { CheckOutlined } from "@ant-design/icons";
import PaymentServices from "@/services/PaymentServices";
import { getOrderById } from "@/services/OrderServices";
// import { resetCart } from "@/redux/features/cartSlice";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";
// import { formatCurrency } from "@/utils/helpers";

const cx = classNames.bind(styles);

// Extended CartItem interface to handle both local cart items and API response items
interface CartItem {
  _id?: string;
  product_id: string;
  name?: string;
  thumb?: string;
  image?: string;
  slug?: string;
  price?: {
    discount?: number;
    original?: number;
  };
  priceOrder?: number;
  quantity: number;
  colorOrder?: string;
  sizeOrder?: string;
  stock?: number;
}

interface OrderDetails {
  id: string;
  recipient: string;
  phoneNumber: string;
  address: string;
  email: string;
  orderDate: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
  city: string;
  district: string;
  ward: string;
}

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "Hồ Chí Minh",
    district: "",
    ward: "",
    notes: "",
  });
  console.log(orderDetails)
  console.log(cartItems)


  // Check for VNPay return parameters
  const orderId = searchParams.get("orderId");
  const paymentSuccess = searchParams.get("paymentSuccess") === "true";
  const paymentMethodParam = searchParams.get("paymentMethod");

  // Fetch order details if coming from VNPay payment
  useEffect(() => {
    const fetchData = async () => {
      // If we have an orderId parameter, fetch that specific order
      if (orderId) {
        try {
          setLoading(true);
          console.log("Fetching order details for orderId:", orderId);
          
          // Fetch order details from the API
          const orderResponse = await getOrderById(orderId);
          console.log("Order API response:", orderResponse);
          
          // Check if the response has the expected structure
          if (orderResponse) {
            // The order object might be in data.order instead of directly in data
            const order = orderResponse?.order || orderResponse.data?.order || orderResponse.data;
            
            if (!order) {
              console.error("Order object not found in response:", orderResponse);
              setError("Không thể tải thông tin đơn hàng. Cấu trúc dữ liệu không hợp lệ.");
              setLoading(false);
              return;
            }
            
            console.log("Order details fetched successfully:", order);
            
            // Set order details for display
            setOrderDetails({
              id: orderId,
              recipient: order.shipping_address?.full_name || "",
              phoneNumber: order.shipping_address?.phone_number || "",
              address: order.shipping_address?.street || "",
              email: order.customer_email || "",
              orderDate: order.createdAt || new Date().toISOString(),
              paymentMethod: order.payment?.method || "COD",
              items: order.items || [],
              total: order.total_amount || 0,
              city: order.shipping_address?.city || "",
              district: order.shipping_address?.district || "",
              ward: order.shipping_address?.ward || "",
            });
            
            setOrderSuccess(true);
            
            // Show toast for successful payment if VNPay payment was successful
            if (paymentSuccess && paymentMethodParam === "VNPAY") {
              toast.success("Thanh toán VNPay thành công!");
            } else {
              toast.success("Đặt hàng thành công!");
            }
            
            // Clear cart in Redux state
            dispatch(clearCartRedux());
          } else {
            console.error("Invalid order response:", orderResponse);
            setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
          }
          
          setLoading(false);
        } catch (err) {
          console.error("Error fetching order details:", err);
          setError("Đã xảy ra lỗi khi tải thông tin đơn hàng");
          setLoading(false);
        }
        return;
      }
      
      // If no orderId, load cart data for new order creation
      try {
        // Fetch cart data from API
        const response = await getCartItems();
        if (
          !response ||
          !response.cart ||
          !Array.isArray(response.cart) ||
          response.cart.length === 0
        ) {
          setError("Your cart is empty. Please add items to your cart.");
          setLoading(false);
          return;
        }

        // Filter only in-stock items
        const inStockItems = response.cart.filter(
          (item: any) => item.stock > 0
        );

        if (inStockItems.length === 0) {
          setError(
            "Không có sản phẩm nào có thể đặt hàng vì tất cả đều hết hàng."
          );
          setLoading(false);
          return;
        }

        setCartItems(inStockItems);

        // Calculate total price for in-stock items
        const total = inStockItems.reduce((sum: number, item: CartItem) => {
          const itemPrice = item.price?.discount || item.price?.original || 0;
          return sum + itemPrice * item.quantity;
        }, 0);

        setTotalPrice(total);
        
        // Attempt to set user data from current user
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUserData({
            fullName: currentUser.fullName || currentUser.name || "",
            phoneNumber: currentUser.phoneNumber || currentUser.phone || "",
            email: currentUser.email || "",
            address: currentUser.address?.street || currentUser.address || "",
            city: currentUser.address?.city || "Hồ Chí Minh",
            district: currentUser.address?.district || currentUser.district || "",
            ward: currentUser.address?.ward || currentUser.ward || "",
            notes: "",
          });
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load cart information. Please try again.");
        setLoading(false);
        console.error("Error fetching cart data:", err);
      }
    };

    fetchData();
  }, [orderId, paymentSuccess, paymentMethodParam, dispatch]);

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    try {
      setOrderProcessing(true);

      // Validate essential data
      if (
        !userData.fullName ||
        !userData.phoneNumber ||
        !userData.email ||
        !userData.address ||
        !userData.district ||
        !userData.ward
      ) {
        toast.error(
          "Thông tin giao hàng không đầy đủ. Vui lòng điền đầy đủ thông tin."
        );
        setOrderProcessing(false);
        return;
      }

      if (cartItems.length === 0) {
        toast.error("Không có sản phẩm nào trong đơn hàng.");
        setOrderProcessing(false);
        return;
      }

      // Format order data for submission
      const orderData = {
        customer_email: userData.email,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          priceOrder: item.price?.discount || item.price?.original || 0,
          quantity: item.quantity,
          colorOrder: item.colorOrder,
          sizeOrder: item.sizeOrder,
        })),
        shipping_address: {
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
          street: userData.address,
          ward: userData.ward,
          district: userData.district,
          city: userData.city,
          country: "Vietnam",
        },
        payment: {
          method: paymentMethod,
          status: "PENDING",
        },
        total_amount: totalPrice,
        notes: userData.notes || "",
      };

      console.log("Creating order with data:", orderData);
      // Create order
      const response = await createOrder(orderData);
      console.log("Order creation response:", response);
      
      if (response && response.status === "success" && response.data) {
        // Get the order ID from the response - the server returns it as order.id not order._id
        const orderId = response.data.order?.id || 
                       response.data.order?._id || 
                       response.data._id;
        
        console.log("Order response data:", response.data);
        
        if (!orderId) {
          console.error("Order ID not found in response:", response);
          throw new Error("Không nhận được mã đơn hàng từ server. Vui lòng thử lại.");
        }
        
        console.log("Created order with ID:", orderId);
        
        // Clear cart in backend
        await clearCart();
        
        // Clear cart in Redux state
        dispatch(clearCartRedux());

        // If payment method is COD, redirect to confirmOrder with orderId
        if (paymentMethod === "COD") {
          // Redirect to confirmOrder page with order ID
          router.push(`/confirmOrder?orderId=${orderId}`);
        } 
        // If payment method is VNPAY, redirect to VNPay payment page
        else if (paymentMethod === "VNPAY") {
          try {
            // Initialize VNPay payment
            console.log("Initializing VNPay payment for order:", orderId);
            const paymentResponse = await PaymentServices.initializePayment(
              orderId,
              "VNPAY",
              `${window.location.origin}/confirmOrder`,
              `${window.location.origin}/payment/failure`
            );
            
            console.log("VNPay payment initialization response:", paymentResponse);
            
            if (paymentResponse.status === "success" && paymentResponse.data?.redirectUrl) {
              // Redirect to VNPay payment page
              console.log("Redirecting to VNPay URL:", paymentResponse.data.redirectUrl);
              window.location.href = paymentResponse.data.redirectUrl;
            } else {
              throw new Error("Không thể khởi tạo thanh toán VNPay");
            }
          } catch (paymentError) {
            console.error("Payment initialization error:", paymentError);
            toast.error("Lỗi khởi tạo thanh toán. Vui lòng thử lại.");
            setOrderProcessing(false);
          }
        }
      } else {
        console.error("Invalid order response:", response);
        throw new Error("Đã xảy ra lỗi khi tạo đơn hàng");
      }
    } catch (err: any) {
      console.error("Error creating order:", err);
      toast.error(
        err.message || "Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setOrderProcessing(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className={cx("loading-container")}>
        <div className={cx("loading-spinner")} />
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx("error-container")}>
        <h1>Lỗi</h1>
        <p>{error}</p>
        <Link href="/cart" className={cx("back-link")}>
          Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  if (orderSuccess && orderDetails) {
    return (
      <div className={cx("confirm-order-container")}>
        <div className={cx("success-header")}>
          <div className={cx("success-icon")}>
            <CheckOutlined  width={40} height={40} color="#2f855a" style={{fontSize:"3rem" , color:"#2f855a"}} />
          </div>
          <h1 className={cx("success-title")}>Đặt hàng thành công!</h1>
          <p className={cx("success-message")}>
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang
            được xử lý. Bạn sẽ nhận được email xác nhận trong thời gian sớm
            nhất.
          </p>
        </div>

        <div className={cx("order-details-container")}>
          <h2 className={cx("details-heading")}>Chi tiết đơn hàng</h2>
          <div className={cx("details-grid")}>
            <div className={cx("detail-column")}>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Mã đơn hàng</span>
                <span className={cx("detail-value")}>{orderDetails.id}</span>
              </div>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Ngày đặt hàng</span>
                <span className={cx("detail-value")}>
                  {formatDate(orderDetails.orderDate)}
                </span>
              </div>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Trạng thái</span>
                <span className={cx("detail-value", "status-pending")}>
                  Chờ xác nhận
                </span>
              </div>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>
                  Phương thức thanh toán
                </span>
                <span className={cx("detail-value")}>
                  {orderDetails.paymentMethod === "COD"
                    ? "Thanh toán khi nhận hàng"
                    : orderDetails.paymentMethod === "VNPAY"
                    ? "Thanh toán qua VNPAY"
                    : orderDetails.paymentMethod === "MOMO"
                    ? "Ví MoMo"
                    : orderDetails.paymentMethod}
                </span>
              </div>
            </div>
            <div className={cx("detail-column")}>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Người nhận</span>
                <span className={cx("detail-value")}>
                  {orderDetails.recipient}
                </span>
              </div>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Số điện thoại</span>
                <span className={cx("detail-value")}>
                  {orderDetails.phoneNumber}
                </span>
              </div>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Email</span>
                <span className={cx("detail-value")}>{orderDetails.email}</span>
              </div>
              <div className={cx("detail-item")}>
                <span className={cx("detail-label")}>Địa chỉ giao hàng</span>
                <span className={cx("detail-value", "address-value")}>
                  {orderDetails.address}, {orderDetails.ward},{" "}
                  {orderDetails.district}, {orderDetails.city}
                </span>
              </div>
            </div>
          </div>

          <div className={cx("order-items")}>
            <h3 className={cx("details-heading")}>Sản phẩm đã đặt</h3>
            <div className={cx("order-items-list")}>
              {orderDetails.items.map((item, index) => (
                <div key={index} className={cx("order-item")}>
                  <div className={cx("item-image")}>
                    <Image
                      src={item.thumb || item.image || "/placeholder-image.jpg"}
                      alt={item.name || `Sản phẩm ${index + 1}`}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={cx("item-details")}>
                    <h4 className={cx("item-name")}>{item.name || `Sản phẩm ${index + 1}`}</h4>
                    <div className={cx("item-variant")}>
                      {item.colorOrder && `Màu: ${item.colorOrder}`}
                      {item.colorOrder && item.sizeOrder && " | "}
                      {item.sizeOrder && `Size: ${item.sizeOrder}`}
                    </div>
                    <div className={cx("item-quantity")}>
                      Số lượng: {item.quantity}
                    </div>
                  </div>
                  <div className={cx("item-price")}>
                    {formatPrice(
                      (item.price?.discount || item.price?.original || item.priceOrder || 0) *
                        item.quantity
                    )}
                    đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cx("order-total")}>
            <div className={cx("total-line")}>
              <span className={cx("total-label")}>Tạm tính:</span>
              <span className={cx("total-value")}>
                {formatPrice(orderDetails.total)}đ
              </span>
            </div>
            <div className={cx("total-line")}>
              <span className={cx("total-label")}>Phí vận chuyển:</span>
              <span className={cx("total-value")}>Miễn phí</span>
            </div>
            <div className={cx("total-line", "final-total")}>
              <strong className={cx("total-label")}>Tổng cộng:</strong>
              <span className={cx("total-amount")}>
                {formatPrice(orderDetails.total)}đ
              </span>
            </div>
          </div>
        </div>

        <div className={cx("action-buttons")}>
          <Link href="/" className={cx("continue-shopping")}>
            Tiếp tục mua sắm
          </Link>
          <Link href="/account/order" className={cx("view-orders")}>
            Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("confirm-order-container")}>
      <h1 className={cx("page-title")}>Xác nhận đơn hàng</h1>

      <div className={cx("confirm-content")}>
        <div className={cx("order-review")}>
          <h2 className={cx("section-title")}>Thông tin giao hàng</h2>
          <div className={cx("review-section")}>
            <div className={cx("info-row")}>
              <span className={cx("info-label")}>Người nhận:</span>
              <span className={cx("info-value")}>{userData.fullName}</span>
            </div>
            <div className={cx("info-row")}>
              <span className={cx("info-label")}>Số điện thoại:</span>
              <span className={cx("info-value")}>{userData.phoneNumber}</span>
            </div>
            <div className={cx("info-row")}>
              <span className={cx("info-label")}>Email:</span>
              <span className={cx("info-value")}>{userData.email}</span>
            </div>
            <div className={cx("info-row")}>
              <span className={cx("info-label")}>Địa chỉ:</span>
              <span className={cx("info-value")}>
                {userData.address}, {userData.ward}, {userData.district},{" "}
                {userData.city}
              </span>
            </div>
            {userData.notes && (
              <div className={cx("info-row")}>
                <span className={cx("info-label")}>Ghi chú:</span>
                <span className={cx("info-value")}>{userData.notes}</span>
              </div>
            )}
          </div>

          <h2 className={cx("section-title", "payment-title")}>
            Phương thức thanh toán
          </h2>
          <div className={cx("payment-methods")}>
            <div className={cx("payment-method-display")}>
              {paymentMethod === "COD" && (
                <div className={cx("selected-payment")}>
                  <Image
                    src="https://mcdn.coolmate.me/image/October2024/mceclip2_42.png"
                    alt="COD"
                    width={24}
                    height={24}
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </div>
              )}

              {paymentMethod === "VNPAY" && (
                <div className={cx("selected-payment")}>
                  <Image
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                    alt="VNPAY"
                    width={24}
                    height={24}
                  />
                  <span>Thanh toán qua VNPAY</span>
                </div>
              )}

              {paymentMethod === "MOMO" && (
                <div className={cx("selected-payment")}>
                  <Image
                    src="https://mcdn.coolmate.me/image/October2024/mceclip3_6.png"
                    alt="MoMo"
                    width={24}
                    height={24}
                  />
                  <span>Ví điện tử MoMo</span>
                </div>
              )}

              <div className={cx("payment-note")}>
                Phương thức thanh toán không thể thay đổi sau khi xác nhận đơn
                hàng.
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className={cx("place-order-button")}
            disabled={orderProcessing}
          >
            {orderProcessing ? "Đang xử lý đơn hàng..." : "Đặt hàng"}
          </button>

          <div className={cx("back-link-container")}>
            <Link href="/cart" className={cx("back-to-cart")}>
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>

        <div className={cx("order-summary")}>
          <h2 className={cx("section-title")}>Tóm tắt đơn hàng</h2>
          <div className={cx("cart-items")}>
            {cartItems.map((item, index) => (
              <div key={index} className={cx("cart-item")}>
                <div className={cx("item-image")}>
                  <Image
                    src={item.thumb || "/placeholder-image.jpg"}
                    alt={item.name || `Sản phẩm ${index + 1}`}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={cx("item-details")}>
                  <h3>{item.name || `Sản phẩm ${index + 1}`}</h3>
                  <div className={cx("item-variants")}>
                    {item.colorOrder && `Màu: ${item.colorOrder}`}
                    {item.sizeOrder && item.colorOrder && " | "}
                    {item.sizeOrder && `Size: ${item.sizeOrder}`}
                    <div className={cx("item-quantity")}>
                      SL: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className={cx("item-price")}>
                  {formatPrice(
                    (item.price?.discount || item.price?.original || item.priceOrder || 0) *
                      item.quantity
                  )}
                  đ
                </div>
              </div>
            ))}
          </div>

          <div className={cx("summary-totals")}>
            <div className={cx("total-line")}>
              <span>Tạm tính:</span>
              <span>{formatPrice(totalPrice)}đ</span>
            </div>
            <div className={cx("total-line")}>
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className={`${cx("total-line")} ${cx("final")}`}>
              <span>Tổng cộng:</span>
              <span>{formatPrice(totalPrice)}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
