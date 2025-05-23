"use client";
import React, { useEffect, useState } from "react";
import styles from "./Cart.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import Link from "next/link";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/services/CartServices";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/services/AuthServices";
import { useRouter } from "next/navigation";
// Import pc-vn library for location data
import pcVN, { Province, District, Ward } from "pc-vn";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import config from "@/config";
import { removeProduct } from "@/redux/cartSlice";

const cx = classNames.bind(styles);

// User interface
interface UserData {
  _id?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  phoneNumber?: string;
  phone_number?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    ward?: string;
    country?: string;
  };
  [key: string]: any;
}

// Location interface types
interface CartItem {
  _id: string;
  product_id: string;
  name: string;
  thumb: string;
  slug: string;
  price: {
    discount?: number;
    original?: number;
  };
  quantity: number;
  colorOrder: string;
  sizeOrder: string;
  stock: number;
}

function PageCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);
  const [blinkItems, setBlinkItems] = useState<{ [key: string]: boolean }>({});

  // Get user from Redux store
  const currentUser = useSelector<RootState, UserData | null>(
    (state) => state.auth.login.currentUser
  );
  const isLoggedIn = Boolean(currentUser);

  // Location state management
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    address: "",
    phoneNumber: "",
    city: "Hồ Chí Minh", // Default city
    district: "",
    ward: "",
    notes: "",
  });

  const router = useRouter();

  // Add state to track selected values
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Add state to control the loading spinner
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const dispatch = useDispatch();

  // Load location data on component mount
  useEffect(() => {
    try {
      // Get all provinces
      const allProvinces = pcVN.getProvinces();
      setProvinces(allProvinces);

      // If user has a city set, find and load its districts
      if (userData.city) {
        const userProvince = allProvinces.find((p) => p.name === userData.city);
        if (userProvince) {
          setSelectedProvince(userProvince.code);
          const userDistricts = pcVN.getDistrictsByProvinceCode(
            userProvince.code
          );
          setDistricts(userDistricts);

          // If user has a district set, find and load its wards
          if (userData.district) {
            const userDistrict = userDistricts.find(
              (d) => d.name === userData.district
            );
            if (userDistrict) {
              setSelectedDistrict(userDistrict.code);
              const userWards = pcVN.getWardsByDistrictCode(userDistrict.code);
              setWards(userWards);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading location data:", error);
    }
  }, [userData.city, userData.district]);

  // Set user data from Redux store when logged in
  useEffect(() => {
    if (currentUser) {
      // Set user data
      setUserData({
        fullName: currentUser.fullName || currentUser.full_name || "",
        email: currentUser.email || "",
        address: currentUser.address?.street || "",
        phoneNumber: currentUser.phoneNumber || currentUser.phone_number || "",
        city: currentUser.address?.city || "Hồ Chí Minh",
        district: currentUser.address?.district || "",
        ward: currentUser.address?.ward || "",
        notes: "",
      });
    }
  }, [currentUser]);

  // Load cart data from API
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // Handle province change
  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceCode = event.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict(""); // Reset district selection
    setWards([]); // Clear wards

    const selectedProvince = provinces.find((p) => p.code === provinceCode);
    if (selectedProvince) {
      // Update user data with selected province
      setUserData({
        ...userData,
        city: selectedProvince.name,
        district: "", // Reset district
        ward: "", // Reset ward
      });

      // Load districts for selected province
      const provinceDistricts = pcVN.getDistrictsByProvinceCode(provinceCode);
      setDistricts(provinceDistricts);
    } else {
      // If no province selected, clear districts and wards
      setDistricts([]);
      setUserData({
        ...userData,
        city: "",
        district: "",
        ward: "",
      });
    }
  };

  // Handle district change
  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtCode = event.target.value;
    setSelectedDistrict(districtCode);

    const selectedDistrict = districts.find((d) => d.code === districtCode);
    if (selectedDistrict) {
      // Update user data with selected district
      setUserData({
        ...userData,
        district: selectedDistrict.name,
        ward: "", // Reset ward
      });

      // Load wards for selected district
      const districtWards = pcVN.getWardsByDistrictCode(districtCode);
      setWards(districtWards);
    } else {
      // If no district selected, clear wards
      setWards([]);
      setUserData({
        ...userData,
        district: "",
        ward: "",
      });
    }
  };

  // Handle ward change
  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const wardCode = event.target.value;
    const selectedWard = wards.find((w) => w.code === wardCode);

    if (selectedWard) {
      // Update user data with selected ward
      setUserData({
        ...userData,
        ward: selectedWard.name,
      });
    }
  };

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching cart items from API...");
      const response = await getCartItems();
      console.log("Cart API response:", response);

      if (response && response.cart) {
        console.log("Cart items from API:", response.cart);
        if (Array.isArray(response.cart)) {
          setCartItems(response.cart);

          // Calculate total price
          const total = response.cart.reduce((sum: number, item: CartItem) => {
            const itemPrice = item.price?.discount || item.price?.original || 0;
            return sum + itemPrice * item.quantity;
          }, 0);

          setTotalPrice(total);
        } else {
          console.error("Cart is not an array:", response.cart);
          setCartItems([]);
        }
      } else {
        console.error("No cart property in response:", response);
        setCartItems([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Không thể tải giỏ hàng");
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    // Find the item
    const item = cartItems.find((item) => item._id === cartItemId);

    // Check if item exists
    if (!item) return;

    // Check if item is out of stock
    if (item.stock <= 0) {
      toast.error(`Sản phẩm ${item.name} đã hết hàng`);
      return;
    }

    // Check if quantity exceeds available stock
    if (newQuantity > item.stock) {
      toast.error(`Số lượng vượt quá hàng có sẵn (còn ${item.stock} sản phẩm)`);
      return;
    }

    try {
      // Update API first
      await updateCartItem(cartItemId, newQuantity);

      // Then update local state
      const updatedItems = cartItems.map((item) => {
        if (item._id === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCartItems(updatedItems);

      // Recalculate total
      const newTotal = updatedItems.reduce((sum, item) => {
        // Skip out of stock items in total calculation
        if (item.stock <= 0) return sum;

        const itemPrice = item.price?.discount || item.price?.original || 0;
        return sum + itemPrice * item.quantity;
      }, 0);

      setTotalPrice(newTotal);

      toast.success("Đã cập nhật số lượng");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Lỗi khi cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (cartItemId: string, productId: string) => {
    try {
      // Update API first
      await removeCartItem(cartItemId);

      // Then update local state
      const updatedItems = cartItems.filter((item) => item._id !== cartItemId);
      setCartItems(updatedItems);

      // Recalculate total
      const newTotal = updatedItems.reduce((sum, item) => {
        const itemPrice = item.price?.discount || item.price?.original || 0;
        return sum + itemPrice * item.quantity;
      }, 0);

      setTotalPrice(newTotal);

      // Update Redux store to sync with header dropdown
      dispatch(removeProduct({ id: productId }));

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const handleRemoveAllOutOfStock = async () => {
    try {
      // Lọc ra các sản phẩm còn hàng
      const inStockItems = cartItems.filter((item) => item.stock > 0);

      // Xóa từng sản phẩm hết hàng
      const outOfStockItems = cartItems.filter((item) => item.stock <= 0);

      for (const item of outOfStockItems) {
        await removeCartItem(item._id);
        // Update Redux store for each removed item
        dispatch(removeProduct({ id: item.product_id }));
      }

      // Cập nhật state
      setCartItems(inStockItems);

      // Tính lại tổng giá
      const newTotal = inStockItems.reduce((sum, item) => {
        const itemPrice = item.price?.discount || item.price?.original || 0;
        return sum + itemPrice * item.quantity;
      }, 0);

      setTotalPrice(newTotal);

      toast.success("Đã xóa tất cả sản phẩm hết hàng");
    } catch (error) {
      console.error("Error removing out-of-stock items:", error);
      toast.error("Lỗi khi xóa sản phẩm hết hàng");
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để đặt hàng");
      return;
    }

    // Filter out out-of-stock items for checkout
    const inStockItems = cartItems.filter((item) => item.stock > 0);

    if (inStockItems.length === 0) {
      toast.error("Không có sản phẩm nào có thể đặt hàng");
      return;
    }

    // Validate address information
    if (
      !userData.fullName ||
      !userData.phoneNumber ||
      !userData.address ||
      !userData.district ||
      !userData.ward
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    // Store current user data for confirmation page
    try {
      const checkoutData = {
        name: userData.fullName,
        email: userData.email,
        address: userData.address,
        phone: userData.phoneNumber,
        city: userData.city,
        district: userData.district,
        ward: userData.ward,
        notes: userData.notes,
      };

      // Only send in-stock items to checkout
      localStorage.setItem("checkoutUserData", JSON.stringify(checkoutData));
      localStorage.setItem("checkoutCartItems", JSON.stringify(inStockItems));

      // Calculate total price for only in-stock items
      const inStockTotal = inStockItems.reduce((sum, item) => {
        const itemPrice = item.price?.discount || item.price?.original || 0;
        return sum + itemPrice * item.quantity;
      }, 0);

      localStorage.setItem("checkoutTotalPrice", inStockTotal.toString());

      router.push("/confirmOrder");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Đã xảy ra lỗi khi tiến hành đặt hàng");
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Calculate total price considering stock availability
  useEffect(() => {
    if (cartItems.length > 0) {
      // Cập nhật số lượng để đảm bảo không vượt quá stock
      const updatedItems = cartItems.map((item) => {
        if (item.quantity > item.stock && item.stock > 0) {
          // Tự động giảm số lượng xuống bằng với stock nếu vượt quá
          toast.error(
            `Số lượng sản phẩm "${item.name}" đã được điều chỉnh do kho hàng không đủ`
          );
          return { ...item, quantity: item.stock };
        }
        return item;
      });

      // Nếu có thay đổi, cập nhật danh sách cart
      if (JSON.stringify(updatedItems) !== JSON.stringify(cartItems)) {
        setCartItems(updatedItems);
      }

      // Tính lại tổng tiền
      const total = updatedItems.reduce((sum, item) => {
        // Skip out of stock items
        if (item.stock <= 0) return sum;

        const itemPrice = item.price?.discount || item.price?.original || 0;
        return sum + itemPrice * item.quantity;
      }, 0);

      setTotalPrice(total);
    }
  }, [cartItems]);

  // Kiểm tra xem có sản phẩm hết hàng không sau mỗi lần cập nhật danh sách giỏ hàng
  useEffect(() => {
    const outOfStockItems = cartItems.some((item) => item.stock <= 0);
    setHasOutOfStockItems(outOfStockItems);
  }, [cartItems]);

  // Thêm hiệu ứng nhấp nháy cho các sản phẩm còn ít trong kho
  useEffect(() => {
    // Tạo danh sách các sản phẩm có stock thấp (1-5)
    const lowStockItems: { [key: string]: boolean } = {};
    cartItems.forEach((item) => {
      if (item.stock > 0 && item.stock < 5) {
        lowStockItems[item._id] = true;
      }
    });

    // Thiết lập hiệu ứng nhấp nháy
    const blinkInterval = setInterval(() => {
      setBlinkItems((prev) => {
        const newState = { ...prev };
        Object.keys(lowStockItems).forEach((id) => {
          newState[id] = !newState[id];
        });
        return newState;
      });
    }, 1000); // Nhấp nháy mỗi giây

    return () => clearInterval(blinkInterval);
  }, [cartItems]);

  // Update handleCheckout to reflect loading state
  const handleCheckoutWithLoading = async () => {
    setLoadingCheckout(true);
    try {
      await handleCheckout();
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cx("cart-page")}>
        <div className={cx("container")}>
          <div className={cx("loading-cart")}>
            <div className={cx("loading-spinner")} />
            <h2>Đang tải giỏ hàng...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={cx("cart-page")}>
        <div className={cx("container")}>
          <div className={cx("empty-cart")}>
            <h1>Vui lòng đăng nhập để xem giỏ hàng</h1>
            <Link href={config.routes.login} className={cx("continue-shopping")}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={cx("cart-page")}>
        <div className={cx("container")}>
          <div className={cx("empty-cart")}>
            <h1>Giỏ hàng của bạn trống</h1>
            <Link href="/" className={cx("continue-shopping")}>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("cart-page")}>
      <div className={cx("container")}>
        <div className={cx("cart-content")}>
          {/* Left Column - Order Information */}
          <div className={cx("order-info")}>
            <h1 className={cx("section-title")}>Thông tin đặt hàng</h1>
            <div className={cx("form-group")}>
              <div className={cx("input-group")}>
                <label>Họ và tên</label>
                <div className={cx("input-wrapper")}>
                  <select className={cx("title-select")}>
                    <option>Anh/Chị</option>
                  </select>
                  <input
                    type="text"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>
              </div>
              <div className={cx("input-group")}>
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div className={cx("input-group")}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Theo dõi đơn hàng sẽ được gửi qua Email và ZNS"
                />
              </div>
              <div className={cx("input-group")}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ (Ví dụ: 103 Vạn Phúc, phường Vạn Phúc)"
                />
                <div className={cx("address-selects")}>
                  {/* City/Province Select */}
                  <select
                    className={cx("city-select")}
                    onChange={handleProvinceChange}
                    value={selectedProvince}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>

                  {/* District Select */}
                  <select
                    className={cx("district-select")}
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                    disabled={!selectedProvince} // Disable if no province selected
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>

                  {/* Ward Select */}
                  <select
                    className={cx("ward-select")}
                    onChange={handleWardChange}
                    value={
                      wards.find((w) => w.name === userData.ward)?.code || ""
                    }
                    disabled={!selectedDistrict} // Disable if no district selected
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={cx("input-group")}>
                <label>Ghi chú</label>
                <input
                  type="text"
                  name="notes"
                  value={userData.notes}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                />
              </div>
              <div className={cx("checkbox-group")}>
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">
                  Gói cho người khác nhận hàng (nếu có)
                </label>
              </div>
            </div>

            <div className={cx("payment-methods")}>
              <h2 className={cx("section-title")}>Hình thức thanh toán</h2>
              <div className={cx("payment-options")}>
                <div className={cx("payment-option", "active")}>
                  <input type="radio" name="payment" id="cod" defaultChecked />
                  <label htmlFor="cod">
                    <Image
                      src="https://mcdn.coolmate.me/image/October2024/mceclip2_42.png"
                      alt="COD"
                      width={24}
                      height={24}
                    />
                    <span>Thanh toán khi nhận hàng</span>
                  </label>
                </div>
                {/* <div className={cx("payment-option")}>
                  <input type="radio" name="payment" id="momo" />
                  <label htmlFor="momo">
                    <Image
                      src="https://mcdn.coolmate.me/image/October2024/mceclip3_6.png"
                      alt="MoMo"
                      width={24}
                      height={24}
                    />
                    <span>Ví MoMo</span>
                  </label>
                </div>
                <div className={cx("payment-option")}>
                  <input type="radio" name="payment" id="vnpay" />
                  <label htmlFor="vnpay">
                    <Image
                      src="https://mcdn.coolmate.me/image/October2024/mceclip0_81.png"
                      alt="VNPay"
                      width={24}
                      height={24}
                    />
                    <span>Ví điện tử VNPAY</span>
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className={cx("cart-summary")}>
            <div className={cx("summary-header")}>
              <h2>Giỏ hàng của bạn</h2>
              {hasOutOfStockItems && (
                <button
                  onClick={handleRemoveAllOutOfStock}
                  className={cx("remove-out-of-stock-button")}
                  style={{
                    backgroundColor: "#ff3b30",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  Xóa tất cả sản phẩm hết hàng
                </button>
              )}
              <div className={cx("promo-banner")}>
                <span className={cx("promo-icon")}>!</span>
                <span>Mua thêm 2 sản phẩm để được giảm thêm 10%</span>
                <Link href="/products" className={cx("buy-now")}>
                  Mua ngay
                </Link>
              </div>
            </div>

            {/* Display cart items */}
            <div className={cx("cart-items")}>
              {cartItems.map((item) => {
                const isOutOfStock = item.stock <= 0;
                const isLowStock = item.stock > 0 && item.stock < 5;

                return (
                  <div
                    key={item._id}
                    className={cx("cart-item", {
                      "out-of-stock": isOutOfStock,
                      "low-stock-blink": isLowStock && blinkItems[item._id],
                    })}
                  >
                    <div className={cx("item-image")}>
                      <Image
                        src={item.thumb || "/placeholder-product.jpg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={cx("item-details")}>
                      <Link href={`/product/${item.slug}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      <div className={cx("item-variant")}>
                        <p>
                          {item.colorOrder && `Màu: ${item.colorOrder}`}
                          {item.colorOrder && item.sizeOrder && " - "}
                          {item.sizeOrder && `Size: ${item.sizeOrder}`}
                        </p>
                      </div>
                      <div className={cx("stock-info")}>
                        {isOutOfStock ? (
                          <span className={cx("out-of-stock-label")}>
                            Hết hàng
                          </span>
                        ) : isLowStock ? (
                          <span className={cx("low-stock-label")}>
                            Chỉ còn {item.stock} sản phẩm
                          </span>
                        ) : null}
                      </div>
                      <div className={cx("item-actions")}>
                        <div className={cx("quantity-controls")}>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || isOutOfStock}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={
                              isOutOfStock || item.quantity >= item.stock
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id, item.product_id)}
                          className={cx("remove-button")}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                    <div className={cx("item-price")}>
                      <div className={cx("current-price")}>
                        {formatPrice(
                          (item.price?.discount || item.price?.original || 0) *
                            item.quantity
                        )}
                        đ
                      </div>
                      {item.price?.discount && item.price?.original && (
                        <div className={cx("original-price")}>
                          {formatPrice(item.price.original * item.quantity)}đ
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={cx("order-summary")}>
              <div className={cx("summary-item")}>
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}đ</span>
              </div>
              <div className={cx("summary-item")}>
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className={cx("total")}>
                <span>Tổng cộng:</span>
                <span>{formatPrice(totalPrice)}đ</span>
              </div>
              <button
                onClick={handleCheckoutWithLoading}
                className={cx("checkout-button")}
                disabled={
                  loadingCheckout ||
                  cartItems.filter((item) => item.stock > 0).length === 0 ||
                  !userData.fullName ||
                  !userData.phoneNumber ||
                  !userData.address ||
                  !userData.district ||
                  !userData.ward
                }
                style={{
                  opacity:
                    loadingCheckout ||
                    cartItems.filter((item) => item.stock > 0).length === 0 ||
                    !userData.fullName ||
                    !userData.phoneNumber ||
                    !userData.address ||
                    !userData.district ||
                    !userData.ward
                      ? 0.7
                      : 1,
                  cursor:
                    loadingCheckout ||
                    cartItems.filter((item) => item.stock > 0).length === 0 ||
                    !userData.fullName ||
                    !userData.phoneNumber ||
                    !userData.address ||
                    !userData.district ||
                    !userData.ward
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loadingCheckout ? (
                  <span>Đang xử lý...</span>
                ) : (
                  <span>Đặt hàng ngay</span>
                )}
              </button>
              {!userData.fullName ||
              !userData.phoneNumber ||
              !userData.address ||
              !userData.district ||
              !userData.ward ? (
                <div
                  style={{
                    color: "#ff3b30",
                    fontSize: "13px",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  Vui lòng điền đầy đủ thông tin giao hàng
                </div>
              ) : cartItems.filter((item) => item.stock > 0).length === 0 ? (
                <div
                  style={{
                    color: "#ff3b30",
                    fontSize: "13px",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  Không thể đặt hàng vì tất cả sản phẩm đều hết hàng
                </div>
              ) : cartItems.some((item) => item.stock <= 0) ? (
                <div
                  style={{
                    color: "#ff9500",
                    fontSize: "13px",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  Lưu ý: Các sản phẩm hết hàng sẽ không được đưa vào đơn hàng
                </div>
              ) : null}

              {/* Display count of orderable items */}
              {cartItems.some((item) => item.stock <= 0) &&
                cartItems.some((item) => item.stock > 0) && (
                  <div
                    style={{
                      fontSize: "13px",
                      marginTop: "5px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    Đặt hàng với{" "}
                    {cartItems.filter((item) => item.stock > 0).length} sản phẩm
                    có sẵn
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageCart;
