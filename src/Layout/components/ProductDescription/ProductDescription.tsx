import React from "react";
import styles from "./ProductDescription.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function ProductDescription() {
  return (
    <div className={cx("product-description")}>
      <h2 className={cx("description-title")}>MÔ TẢ SẢN PHẨM</h2>

      <div className={cx("product-content")}>
        <div className={cx("product-features")}>
          <div className={cx("feature-item")}>
            <img
              src="https://mcdn.coolmate.me//image/January2025/mceclip8_9.png"
              alt="Siêu nhẹ"
            />
            <span>Siêu nhẹ</span>
          </div>
          <div className={cx("feature-item")}>
            <img
              src="https://mcdn.coolmate.me//image/January2025/mceclip18.png"
              alt="Thoải mái"
            />
            <span>Thoải mái</span>
          </div>
          <div className={cx("feature-item")}>
            <img
              src="https://mcdn.coolmate.me//image/January2025/mceclip12_62.png"
              alt="Nhanh khô"
            />
            <span>Nhanh khô</span>
          </div>
        </div>

        <div className={cx("product-main-content")}>
          <div className={cx("specs-column")}>
            <div className={cx("spec-group")}>
              <div className={cx("spec-label")}>HỖ TRỢ VẬN ĐỘNG:</div>
              <div className={cx("spec-scale")}>
                <div className={cx("scale-bar")}>
                  <div className={cx("scale-fill")}></div>
                </div>
                <div className={cx("scale-labels")}>
                  <span>NHẸ</span>
                  <span>VỪA</span>
                  <span>MẠNH</span>
                </div>
              </div>
            </div>

            <div className={cx("spec-item")}>
              <div className={cx("spec-label")}>CÔNG NGHỆ:</div>
              <div className={cx("spec-value")}>Ex-Dry</div>
            </div>

            <div className={cx("spec-item")}>
              <div className={cx("spec-label")}>CHẤT LIỆU:</div>
              <div className={cx("spec-value")}>
                <p>Vải chính: 100% Polyester</p>
                <p>Vải phối: 90% Polyester 10% Spandex</p>
              </div>
            </div>

            <div className={cx("spec-item")}>
              <div className={cx("spec-label")}>KIỂU DÁNG:</div>
              <div className={cx("spec-value")}>
                <p>Slim Fit</p>
                <p>Mẫu cao 168cm, nặng 47kg, áo cỡ: 78-60-90cm - Size S</p>
              </div>
            </div>

            <div className={cx("spec-item")}>
              <div className={cx("spec-label")}>PHÙ HỢP:</div>
              <div className={cx("spec-value")}>
                <p>Chạy bộ, thể thao, tập luyện ngoài trời</p>
                <p>Vận động cường độ cao</p>
              </div>
            </div>

            <div className={cx("spec-item")}>
              <div className={cx("spec-label")}>TÍNH NĂNG:</div>
              <div className={cx("spec-value")}>
                Thoáng khí - Siêu nhẹ - Nhanh khô - Giảm mùi mồ hôi
              </div>
            </div>

            <div className={cx("spec-item")}>
              <div className={cx("spec-label")}>BẢO QUẢN:</div>
              <div className={cx("spec-value")}>
                <p>Giặt máy nhẹ - Sấy nhiệt thấp</p>
                <p>Không dùng chất tẩy - Không giặt khô</p>
              </div>
            </div>

            <div className={cx("made-in")}>
              <strong>★ Proudly Made In Vietnam</strong>
            </div>
          </div>

          <div className={cx("main-image")}>
            <img
              src="https://mcdn.coolmate.me//image/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1-thumb-1.png"
              alt="Product main image"
            />
          </div>
        </div>
      </div>

      <div className={cx("product-features-grid")}>
        <div className={cx("feature-card")}>
          <img
            src="https://mcdn.coolmate.me//image/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1-thumb-1.png"
            alt="Vải nhẹ, khô thoáng"
          />
          <h3>Vải nhẹ, khô thoáng</h3>
          <p>
            Exdry thấm hút mồ hôi, vải siêu nhẹ giúp thoáng khí và khô nhanh khi
            vận động
          </p>
        </div>

        <div className={cx("feature-card")}>
          <img
            src="https://mcdn.coolmate.me//image/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1-thumb-1.jpg"
            alt="Mesh thoáng khí sau lưng"
          />
          <h3>Mesh thoáng khí sau lưng</h3>
          <p>
            Thiết kế phối mesh sau lưng giúp thoáng khí, giảm bí bách khi vận
            động mạnh
          </p>
        </div>

        <div className={cx("feature-card")}>
          <img
            src="https://mcdn.coolmate.me//image/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1-thumb-1.jpg"
            alt="Logo phản quang"
          />
          <h3>Logo phản quang</h3>
          <p>
            Tăng nhận diện khi đi chuyển ban đêm hoặc trong điều kiện ánh sáng
            yếu
          </p>
        </div>

        <div className={cx("feature-card")}>
          <img
            src="https://mcdn.coolmate.me//image/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1-thumb-1.jpg"
            alt="Thoải mái khi vận động mạnh"
          />
          <h3>Thoải mái khi vận động mạnh</h3>
          <p>
            Màu đá phối, form ôm vừa nhẹ tôn dáng. Thoải mái khi chạy bộ, tập
            luyện cường độ cao
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDescription;
