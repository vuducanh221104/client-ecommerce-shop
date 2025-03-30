"use client";
import React, { useState } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { BiShare } from "react-icons/bi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

import styles from "@/styles/ProductDetail.module.scss";
import classNames from "classnames/bind";
import ProductDescription from "../../../../Layout/components/ProductDescription/ProductDescription";
import ProductPreviewFabric from "../../../../Layout/components/ProductPreviewFabric";
const cx = classNames.bind(styles);

function PageProductDetail({ params }: { params: { slug: string } }) {
  const [activeSize, setActiveSize] = useState("M");
  const [activeColor, setActiveColor] = useState("Tím Purple Rose");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGiftInfo, setShowGiftInfo] = useState(false);

  // Product images from params
  const productImages = [
    "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-11872-tim_85.jpg",
    "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-12012-tim_7.jpg",
    "https://media3.coolmate.me/cdn-cgi/image/width=80,height=80,quality=80,format=auto/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1174-tim.jpg",
  ];

  // Sample product data
  const product = {
    name: "Áo thun nữ chạy bộ Core Tee Slimfit",
    price: 199000,
    salePrice: 179000,
    rating: 5,
    reviews: 5,
    description:
      "Được thiết kế dành riêng cho những cô nàng năng động, Áo thun chạy bộ Core Tee Slimfit với chất liệu siêu co giãn, thoáng khí cùng kiểu dáng thon gọn giúp bạn tự tin chinh phục mọi cung đường.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Tím Purple Rose", code: "#D8D2EA" },
      { name: "Xanh Mint", code: "#E5EBD7" },
      { name: "Đen", code: "#212121" },
    ],
    promotion: "Freeship đơn trên 200K",
    extraPromotion: "Mua 3 được giảm thêm 10%",
    voucherCode: "Giảm 50k",
    gift: "Set Sticker - Mừng sinh nhật Coolmate 6 tuổi",
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      const currentValue =
        typeof prev === "string" ? parseInt(prev) || 1 : prev;
      return currentValue + 1;
    });
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      const currentValue =
        typeof prev === "string" ? parseInt(prev) || 1 : prev;
      return currentValue > 1 ? currentValue - 1 : 1;
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0) {
        setQuantity(numValue);
      }
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleGiftInfo = () => {
    setShowGiftInfo(!showGiftInfo);
  };

  const handleColorSelect = (colorName: string) => {
    setActiveColor(colorName);
  };

  return (
    <div className={cx("product-detail-wrapper")}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={cx("breadcrumb")}>
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <Link href="/do-nu">Đồ Nữ</Link>
          <span>/</span>
          <Link href="/ao-nu">Áo Nữ</Link>
          <span>/</span>
          <span>Áo Thun Nữ</span>
        </div>

        <div className={cx("product-detail-container")}>
          <div className={cx("product-detail-grid")}>
            {/* Product Images Section */}
            <div className={cx("product-images-section")}>
              <div className={cx("vertical-gallery")}>
                <div className={cx("thumbnails-column")}>
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={cx("thumbnail-item", {
                        active: index === currentImageIndex,
                      })}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={cx("thumbnail-image")}
                      />
                    </div>
                  ))}
                </div>

                <div className={cx("main-image-wrapper")}>
                  <div className={cx("brand-logo")}>
                    <img
                      src="https://www.coolmate.me/images/footer/coolmate-for-woman.svg"
                      alt="Coolmate for Women"
                    />
                  </div>

                  <div className={cx("main-image-container")}>
                    <img
                      src={productImages[currentImageIndex]}
                      alt={`Product view ${currentImageIndex + 1}`}
                      className={cx("product-image")}
                    />
                  </div>

                  <div className={cx("birthday-promotion")}>
                    <img
                      src="https://media3.coolmate.me/cdn-cgi/image/width=713,height=1050,quality=85,format=auto/uploads/March2025/Footer_-_Mua_3_giam_10_1_(1).jpg"
                      alt="Mua 3 giảm thêm 10%"
                      className={cx("promotion-image")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className={cx("product-info-section")}>
              <h1 className={cx("product-title")}>{product.name}</h1>

              <div className={cx("product-rating")}>
                <div className={cx("stars")}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={cx("star", {
                        filled: i < product.rating,
                      })}
                    />
                  ))}
                  <span className={cx("rating-count")}>
                    ({product.reviews})
                  </span>
                </div>
                <div className={cx("share-btn")}>
                  <BiShare />
                  <span>Chia sẻ</span>
                </div>
              </div>

              <div className={cx("price-section")}>
                <div className={cx("price-container")}>
                  <div className={cx("prices")}>
                    <span className={cx("original-price")}>
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className={cx("current-price")}>
                      {product.salePrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className={cx("discount-tag")}>-10%</div>
                </div>
              </div>

              <div className={cx("promotions-section")}>
                <div className={cx("promotion-item")}>
                  <TbTruckDelivery className={cx("promotion-icon")} />
                  <span>{product.promotion}</span>
                </div>
                <div className={cx("promotion-item")}>
                  <div className={cx("promotion-badge")}>
                    {product.extraPromotion}
                  </div>
                </div>
              </div>

              <div className={cx("discount-code")}>
                <div className={cx("discount-label")}>Mã giảm giá</div>
                <div className={cx("discount-tag")}>{product.voucherCode}</div>
              </div>

              <div className={cx("gift-section")}>
                <div className={cx("gift-header")}>
                  <div className={cx("gift-icon")}>🎁</div>
                  <h3 className={cx("gift-title")}>Khuyến mãi 0đ</h3>
                  <button
                    className={cx("info-button")}
                    onClick={toggleGiftInfo}
                  >
                    <IoIosInformationCircleOutline />
                  </button>
                </div>

                {showGiftInfo && (
                  <div className={cx("gift-info")}>
                    <p>Quà tặng kèm khi mua sản phẩm</p>
                  </div>
                )}

                <div className={cx("gift-options")}>
                  <label className={cx("gift-option")}>
                    <input
                      type="radio"
                      name="gift"
                      checked
                      readOnly
                      className={cx("gift-radio")}
                    />
                    <div className={cx("gift-option-content")}>
                      <div className={cx("gift-img")}>
                        <img
                          src="https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/June2023/mung-sinh-nhat-6-tuoi-popup.jpg"
                          alt="Quà tặng"
                        />
                      </div>
                      <div className={cx("gift-name")}>{product.gift}</div>
                      <div className={cx("gift-price")}>0đ</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className={cx("quantity-and-cart-section")}>
                <div className={cx("product-actions")}>
                  <button className={cx("buy-now-btn")}>
                    <div className={cx("quantity-control")}>
                      <div
                        className={cx("quantity-btn", "decrease")}
                        onClick={handleDecreaseQuantity}
                      >
                        <FiMinus />
                      </div>
                      <input
                        type="number"
                        className={cx("quantity-value")}
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={() => {
                          if (
                            quantity === "" ||
                            quantity === 0 ||
                            quantity === "0"
                          ) {
                            setQuantity(1);
                          }
                        }}
                        min="1"
                      />
                      <div
                        className={cx("quantity-btn", "increase")}
                        onClick={handleIncreaseQuantity}
                      >
                        <FiPlus />
                      </div>
                    </div>
                    <FiShoppingCart />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                </div>
              </div>

              <div className={cx("product-options")}>
                <div className={cx("option-section")}>
                  <h3 className={cx("option-title")}>
                    Màu sắc: <span>{activeColor}</span>
                  </h3>
                  <div className={cx("color-options")}>
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        className={cx("color-option", {
                          active: color.name === activeColor,
                        })}
                        style={{ backgroundColor: color.code }}
                        onClick={() => handleColorSelect(color.name)}
                        title={color.name}
                      >
                        {color.name === activeColor && (
                          <span className={cx("color-check")}></span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={cx("option-section")}>
                  <div className={cx("size-header")}>
                    <h3 className={cx("option-title")}>
                      Kích thước: <span>{activeSize}</span>
                    </h3>
                    <a href="#" className={cx("size-guide")}>
                      Hướng dẫn chọn size
                    </a>
                  </div>
                  <div className={cx("size-options")}>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={cx("size-option", {
                          active: size === activeSize,
                        })}
                        onClick={() => setActiveSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cx("product-description-tab")}>
                <button className={cx("tab-button", "active")}>
                  Mô tả sản phẩm
                </button>
              </div>

              <div className={cx("customer-benefits")}>
                <div className={cx("coolcash-benefit")}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8021 0.0161133H3.19787C1.43133 0.0161133 0 1.44212 0 3.20866V12.7916C0 14.5529 1.43133 15.9842 3.19787 15.9842H12.8021C14.5687 15.9842 16 14.5582 16 12.7916V3.20866C15.9947 1.44212 14.5687 0.0161133 12.8021 0.0161133ZM14.9305 12.7863C14.9305 13.9569 13.9727 14.9147 12.8021 14.9147H3.19787C2.02195 14.9147 1.0695 13.9622 1.0695 12.7863V3.20334C1.0695 2.03274 2.02727 1.07498 3.19787 1.07498H12.8021C13.9781 1.07498 14.9305 2.02742 14.9305 3.20334V12.7863Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M8.53963 4.74634H7.39032H7.37967C7.37435 5.72007 6.84758 6.32133 6.00156 6.32133C5.15553 6.32133 4.62876 5.72007 4.62344 4.74634H3.47412C3.47412 6.30537 4.44253 7.43872 6.00156 7.43872C6.8529 7.43872 7.52866 7.1035 7.9703 6.54481C8.32148 6.1035 8.51835 5.52851 8.53963 4.86872C8.53963 4.82615 8.53963 4.78891 8.53963 4.74634Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M11.3595 4.74634C11.3542 5.72007 10.7955 6.32133 9.94945 6.32133C9.13535 6.32133 8.59261 5.76795 8.5394 4.86872C8.5394 4.83147 8.53408 4.78891 8.53408 4.74634H7.38477C7.38477 5.45402 7.59228 6.07657 7.96474 6.54481C8.4117 7.1035 9.09278 7.43872 9.94413 7.43872C11.5032 7.43872 12.5195 6.30537 12.5195 4.74634H11.3595Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M4.62344 4.74634H3.47412C3.47412 4.75698 3.6976 10.1151 3.6976 10.1205H4.84691C4.84691 10.1098 4.62344 4.75698 4.62344 4.74634Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M11.3748 4.74634H12.5242C12.5242 4.75698 12.3007 10.1151 12.3007 10.1205H11.1514C11.1514 10.1098 11.3748 4.75698 11.3748 4.74634Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M12.3075 10.1206H3.69824V11.2433H12.3075V10.1206Z"
                      fill="#2F5ACF"
                    ></path>
                  </svg>
                  <span>
                    Được hoàn lên đến <strong>13.000</strong> CoolCash.
                  </span>
                  <button className={cx("detail-btn")}>
                    Chi tiết
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#444"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                </div>

                <div className={cx("zalo-chat")}>
                  <img
                    src="https://page.widget.zalo.me/static/images/2.0/Logo.svg"
                    alt="Zalo"
                  />
                  <span>Chat để được Coolmate tư vấn ngay (8:30 - 22:00)</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19"
                      stroke="#444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="#444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>

                <div className={cx("service-benefits")}>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/return.svg"
                      alt="Đổi trả"
                    />
                    <span>Đổi trả cực dễ chỉ cần số điện thoại</span>
                  </div>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/return-60.svg"
                      alt="60 ngày đổi trả"
                    />
                    <span>
                      60 ngày đổi trả (sản phẩm chưa qua sử dụng, nguyên nhãn
                      mác)
                    </span>
                  </div>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/phone.svg"
                      alt="Hotline"
                    />
                    <span>
                      Hotline 1900.27.27.37 hỗ trợ từ 8h30 - 22h mỗi ngày
                    </span>
                  </div>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/location.svg"
                      alt="Địa điểm"
                    />
                    <span>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProductDescription />
        <ProductPreviewFabric />
      </div>
    </div>
  );
}

export default PageProductDetail;
