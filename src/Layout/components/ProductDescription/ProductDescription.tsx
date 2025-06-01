import React from "react";
import styles from "./ProductDescription.module.scss";
import classNames from "classnames/bind";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

const cx = classNames.bind(styles);

interface DescriptionHeader {
  material: string;
  style: string;
  responsible: string;
  features: string;
  image: string;
}

interface DescriptionBody {
  content: string;
}

interface ProductDescriptionProps {
  dataDescription: {
    header: DescriptionHeader;
    body: DescriptionBody;
  };
}

function ProductDescription({ dataDescription }: ProductDescriptionProps) {
  return (
    <div className={cx("product-description")}>
      <div className={cx("product-description-wrapper")}>
        <div className={cx("container-product-description-wrapper")}>
          <h2 className={cx("description-title")}>MÔ TẢ SẢN PHẨM</h2>

          <div className={cx("product-main-content")}>
            <div className={cx("specs-column")}>
              <div className={cx("product-features")}>
                <div className={cx("feature-item")}>
                  <Image
                    src="https://mcdn.coolmate.me//image/January2025/mceclip8_9.png"
                    alt="Siêu nhẹ"
                    width={64}
                    height={64}
                  />
                  <span>Siêu nhẹ</span>
                </div>
                <div className={cx("feature-item")}>
                  <Image
                    src="https://mcdn.coolmate.me//image/January2025/mceclip18.png"
                    alt="Thoải mái"
                    width={64}
                    height={64}
                  />
                  <span>Thoải mái</span>
                </div>
                <div className={cx("feature-item")}>
                  <Image
                    src="https://mcdn.coolmate.me//image/January2025/mceclip12_62.png"
                    alt="Nhanh khô"
                    width={64}
                    height={64}
                  />
                  <span>Nhanh khô</span>
                </div>
              </div>

              <div className={cx("spec-group")}>
                <div className={cx("spec-scale")}>
                  <div className={cx("spec-sup")}>HỖ TRỢ VẬN ĐỘNG:</div>
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

              <div className={cx("specs-grid")}>
                {/* <div className={cx("spec-item")}>
                  <div className={cx("spec-label")}>CÔNG NGHỆ:</div>
                  <div className={cx("spec-value")}>
                    {dataDescription.header.material}
                  </div>
                </div> */}

                <div className={cx("spec-item")}>
                  <div className={cx("spec-label")}>CHẤT LIỆU:</div>
                  <div className={cx("spec-value")}>
                    <p>{dataDescription.header.material}</p>
                  </div>
                </div>

                <div className={cx("spec-item")}>
                  <div className={cx("spec-label")}>KIỂU DÁNG:</div>
                  <div className={cx("spec-value")}>
                    <p>{dataDescription.header.style}</p>
                  </div>
                </div>

                <div className={cx("spec-item")}>
                  <div className={cx("spec-label")}>PHÙ HỢP:</div>
                  <div className={cx("spec-value")}>
                    <p>{dataDescription.header.responsible}</p>
                  </div>
                </div>

                <div className={cx("spec-item")}>
                  <div className={cx("spec-label")}>TÍNH NĂNG:</div>
                  <div className={cx("spec-value")}>
                    <p>{dataDescription.header.features}</p>
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
            </div>

            <div className={cx("main-image")}>
              <Image
                src={dataDescription.header.image|| "/images/gobal/no-image-ao.png"}
                alt="Product main image"
                width={889}
                height={800}
              />
            </div>
          </div>

          {/* 
          <div className={cx("product-features-grid")}>
            <div className={cx("feature-card")}>
              <img
                src="https://mcdn.coolmate.me//image/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-1-thumb-1.png"
                alt="Vải nhẹ, khô thoáng"
              />
              <h3>Vải nhẹ, khô thoáng</h3>
              <p>
                Exdry thấm hút mồ hôi, vải siêu nhẹ giúp thoáng khí và khô nhanh
                khi vận động
              </p>
            </div>
          </div> */}
        </div>
        <div className={cx("container-product-description-wrapper")}>
          <div className={cx("product-description-body")}>
            <div style={{margin:"30px 0 40px 0"}}>
            <strong >Chi Tiết Sản Phẩm</strong>

            </div>
            {dataDescription?.body?.content && (
              <ReactMarkdown>{dataDescription.body.content}</ReactMarkdown>
            )}
            {/* <Image
              src="https://mcdn.coolmate.me/image/August2023/mceclip0_66.jpg"
              alt="Product main image"
              width={1200}
              height={1250}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDescription;
