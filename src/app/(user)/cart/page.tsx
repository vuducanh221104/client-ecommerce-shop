import React from "react";
import styles from "./Cart.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

function PageCart() {
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
                  <input type="text" placeholder="Nhập họ tên của bạn" />
                </div>
              </div>
              <div className={cx("input-group")}>
                <label>Số điện thoại</label>
                <input type="tel" placeholder="Nhập số điện thoại của bạn" />
              </div>
              <div className={cx("input-group")}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Theo dõi đơn hàng sẽ được gửi qua Email và ZNS"
                />
              </div>
              <div className={cx("input-group")}>
                <label>Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Địa chỉ (Ví dụ: 103 Vạn Phúc, phường Vạn Phúc)"
                />
                <div className={cx("address-selects")}>
                  <select className={cx("city-select")}>
                    <option>Hồ Chí Minh</option>
                  </select>
                  <select className={cx("district-select")}>
                    <option>Chọn Quận/Huyện</option>
                  </select>
                  <select className={cx("ward-select")}>
                    <option>Chọn Phường/Xã</option>
                  </select>
                </div>
              </div>
              <div className={cx("input-group")}>
                <label>Ghi chú</label>
                <input
                  type="text"
                  placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"
                />
              </div>
              <div className={cx("checkbox-group")}>
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">
                  Gói cho người khác nhận hàng(nếu có)
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
                <div className={cx("payment-option")}>
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
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className={cx("cart-summary")}>
            <div className={cx("summary-header")}>
              <h2>Giỏ hàng</h2>
              <div className={cx("promo-banner")}>
                <span className={cx("promo-icon")}>!</span>
                <span>Mua thêm 2 sản phẩm để được giảm thêm 10%</span>
                <button className={cx("buy-now")}>Mua ngay</button>
              </div>
            </div>

            <div className={cx("cart-items")}>
              <div className={cx("cart-item")}>
                <div className={cx("item-image")}>
                  <Image
                    src="https://media3.coolmate.me/cdn-cgi/image/width=320,height=362,quality=80/uploads/March2025/quan-nam-travel-short-7-inch-Xam_1.jpg"
                    alt="Quần nam Travel Shorts 7inch"
                    width={80}
                    height={80}
                  />
                </div>
                <div className={cx("item-details")}>
                  <h3>Quần nam Travel Shorts 7inch</h3>
                  <div className={cx("item-variants")}>
                    <select className={cx("color-select")}>
                      <option>Xám</option>
                    </select>
                    <select className={cx("size-select")}>
                      <option>M</option>
                    </select>
                  </div>
                  <div className={cx("item-quantity")}>
                    <button>-</button>
                    <input type="number" value="1" readOnly />
                    <button>+</button>
                  </div>
                  <button className={cx("remove-item")}>Xóa</button>
                </div>
                <div className={cx("item-price")}>297.000đ</div>
              </div>

              <div className={cx("gift-item")}>
                <div className={cx("item-image")}>
                  <Image
                    src="https://media3.coolmate.me/cdn-cgi/image/width=320,height=362,quality=80/uploads/March2025/set-sticker-mung-sinh-nhat-coolmate-2.jpg"
                    alt="Set Sticker - Mừng sinh nhật Coolmate 6 tuổi"
                    width={80}
                    height={80}
                  />
                </div>
                <div className={cx("item-details")}>
                  <div className={cx("gift-label")}>Quà tặng</div>
                  <h3>Set Sticker - Mừng sinh nhật Coolmate 6 tuổi</h3>
                  <div className={cx("item-variants")}>
                    <select className={cx("variant-select")}>
                      <option>Mix</option>
                    </select>
                  </div>
                  <div className={cx("item-quantity")}>x1</div>
                </div>
                <div className={cx("item-price")}>0đ</div>
              </div>
            </div>

            <div className={cx("summary-footer")}>
              <div className={cx("voucher-input")}>
                <input type="text" placeholder="Nhập mã giảm giá" />
                <button>Áp dụng Voucher</button>
              </div>
              <div className={cx("summary-totals")}>
                <div className={cx("total-line")}>
                  <span>Tạm tính</span>
                  <span>297.000đ</span>
                </div>
                <div className={cx("total-line")}>
                  <span>Giảm giá</span>
                  <span>0đ</span>
                </div>
                <div className={cx("total-line", "final")}>
                  <span>Thành tiền</span>
                  <span>297.000đ</span>
                </div>
              </div>
              <button className={cx("checkout-button")}>ĐẶT HÀNG</button>
              <div className={cx("coolpoint-info")}>
                <span>Đăng nhập để hoàn 3.000 CoolPoints</span>
                <span>Tích thêm 52.000đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageCart;
