"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/services/AuthServices";
import { getCartItems, clearCart } from "@/services/CartServices";
import { useRouter } from "next/navigation";
import styles from "./confirmOrder.module.scss";
import classNames from "classnames/bind";
import { format } from "date-fns";
import { createOrder } from "@/services/OrderServices";
import { toast } from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import { User, CartItem } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { clearCart as clearCartRedux } from "@/redux/cartSlice";
// import { resetCart } from "@/redux/features/cartSlice";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";
// import { formatCurrency } from "@/utils/helpers";

const cx = classNames.bind(styles);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        // const userData = await getCurrentUser();
        // if (!userData) {
        //   router.push("/login?redirect=/confirmOrder");
        //   return;
        // }
        // setUser(userData);

        // Get checkout data from localStorage
        const storedCheckoutData = localStorage.getItem("checkoutUserData");
        const storedCartItems = localStorage.getItem("checkoutCartItems");
        const storedTotalPrice = localStorage.getItem("checkoutTotalPrice");

        if (!storedCheckoutData || !storedCartItems || !storedTotalPrice) {
          // If no checkout data exists in localStorage, fetch from cart API
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

          // Set user data from API
          setUserData({
            fullName: userData.name || "",
            phoneNumber: userData.phoneNumber || "",
            email: userData.email || "",
            address: userData.address || "",
            city: userData.city || "Hồ Chí Minh",
            district: userData.state || "",
            ward: userData.zip || "",
            notes: "",
          });
        } else {
          // Use localStorage data if available
          try {
            const checkoutData = JSON.parse(storedCheckoutData);
            const cartData = JSON.parse(storedCartItems);
            const totalPrice = parseFloat(storedTotalPrice);

            if (!Array.isArray(cartData) || cartData.length === 0) {
              setError("Không có sản phẩm nào trong đơn hàng.");
              setLoading(false);
              return;
            }

            setCartItems(cartData);
            setTotalPrice(totalPrice);

            // Set user data from localStorage
            setUserData({
              fullName: checkoutData.name || userData.name || "",
              phoneNumber: checkoutData.phone || userData.phoneNumber || "",
              email: checkoutData.email || userData.email || "",
              address: checkoutData.address || userData.address || "",
              city: checkoutData.city || userData.city || "Hồ Chí Minh",
              district: checkoutData.district || userData.state || "",
              ward: checkoutData.ward || userData.zip || "",
              notes: checkoutData.notes || "",
            });
          } catch (e) {
            console.error("Error parsing checkout data:", e);
            setError(
              "Đã xảy ra lỗi khi xử lý thông tin đặt hàng. Vui lòng thử lại."
            );
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load order information. Please try again.");
        setLoading(false);
        console.error("Error fetching order data:", err);
      }
    };

    fetchData();
  }, [router]);

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

      // Create order
      const response = await createOrder(orderData);
      if (response && response.data && response.data.order) {
        // Clear cart in backend
        await clearCart();
        
        // Clear cart in Redux state
        dispatch(clearCartRedux());

        // Clear stored checkout data
        localStorage.removeItem("checkoutUserData");
        localStorage.removeItem("checkoutCartItems");
        localStorage.removeItem("checkoutTotalPrice");

        // Set order details for display
        setOrderDetails({
          id: response.data.order.id,
          recipient: userData.fullName,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          email: userData.email,
          orderDate: response.data.order.createdAt || new Date().toISOString(),
          paymentMethod: paymentMethod,
          items: cartItems,
          total: totalPrice,
          city: userData.city,
          district: userData.district,
          ward: userData.ward,
        });

        setOrderSuccess(true);
        toast.success("Đặt hàng thành công!");
      } else {
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
            {/* <CheckCircleIcon width={40} height={40} color="#2f855a" /> */}OK
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
                    : orderDetails.paymentMethod === "MOMO"
                    ? "Ví MoMo"
                    : orderDetails.paymentMethod === "ZALOPAY"
                    ? "ZaloPay"
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
                      src={item.thumb || "/placeholder-image.jpg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={cx("item-details")}>
                    <h4 className={cx("item-name")}>{item.name}</h4>
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
                      (item.price?.discount || item.price?.original || 0) *
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
          <Link href="/products" className={cx("continue-shopping")}>
            Tiếp tục mua sắm
          </Link>
          <Link href="/user/orders" className={cx("view-orders")}>
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

              {paymentMethod === "MOMO" && (
                <div className={cx("selected-payment")}>
                  <Image
                    src="https://mcdn.coolmate.me/image/October2024/mceclip3_6.png"
                    alt="MoMo"
                    width={24}
                    height={24}
                  />
                  <span>Ví MoMo</span>
                </div>
              )}

              {paymentMethod === "ZALOPAY" && (
                <div className={cx("selected-payment")}>
                  <Image
                    src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
                    alt="ZaloPay"
                    width={24}
                    height={24}
                  />
                  <span>Ví điện tử ZaloPay</span>
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
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={cx("item-details")}>
                  <h3>{item.name}</h3>
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
                    (item.price?.discount || item.price?.original || 0) *
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
