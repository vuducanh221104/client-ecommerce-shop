import React from "react";
import styles from "./ProductPreviewFabric.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function ProductPreviewFabric() {
  const fabricTypes = [
    {
      id: 1,
      name: "CoolSoft",
      subtitle: "MỀM MỊN NHƯ LÀN DA THỨ HAI",
      composition: "81% Nylon66, 19% Lycra",
      usage: "Yoga & Pilates, mặc hằng ngày Hoạt động cường độ thấp",
      benefits:
        "Mềm mại, dễ chịu, mượt mà Thoải mái vận động nhờ khả năng co giãn hoàn hảo",
      image: "https://mcdn.coolmate.me//image/March2025/mceclip4_63.jpg",
      productUrl: "/san-pham-coolsoft",
    },
    {
      id: 2,
      name: "CoolDry",
      subtitle: "KHÔ THOÁNG MỌI LÚC",
      composition: "89% RECPolyester, 11% Spandex",
      usage: "Chạy bộ và các môn thể thao chung",
      benefits:
        "Làm hoạt và thoải mái, hỗ trợ chuyển động tự nhiên Khô nhanh và thoáng khí, duy trì làm chạm chống áp ngoài",
      image: "https://mcdn.coolmate.me//image/March2025/mceclip5_45.jpg",
      productUrl: "/san-pham-cooldry",
    },
    {
      id: 3,
      name: "CoolRib",
      subtitle: "ÔM DÁNG, THOÁNG KHÍ",
      composition: "79% Nylon, 21% Spandex",
      usage: "Yoga & Pilates, các bộ môn thể thao hoặc mặc hằng ngày",
      benefits:
        "Co giãn tốt hoạt, ôm sát cơ thể và tôn dáng Mềm mỏng, thoáng khí, thoải mái vận động cả ngày",
      image: "https://mcdn.coolmate.me//image/March2025/mceclip2_32.jpg",
      productUrl: "/san-pham-coolrib",
    },
    {
      id: 4,
      name: "CoolFlex",
      subtitle: "LINH HOẠT VẬN ĐỘNG",
      composition: "69% Nylon Hồi Full Dull, 31% Spandex",
      usage: "Yoga & Pilates và các môn thể thao chung",
      benefits:
        "Co giãn tuyệt vời, hỗ trợ động tác mà không bị giới hạn Êm ái cơ thể, thoải mái và không bị bó cứng",
      image: "https://mcdn.coolmate.me//image/March2025/mceclip3_93.jpg",
      productUrl: "/san-pham-coolflex",
    },
  ];

  return (
    <div className="container">
      <div className={cx("fabric-preview")}>
        <h2 className={cx("section-title")}>CÔNG NGHỆ VẢI NỔI BẬT</h2>

        <div className={cx("fabric-grid")}>
          {fabricTypes.map((fabric) => (
            <div className={cx("fabric-card")} key={fabric.id}>
              <div className={cx("fabric-image")}>
                <img src={fabric.image} alt={fabric.name} />
              </div>
              <div className={cx("fabric-content")}>
                <h3 className={cx("fabric-name")}>{fabric.name}</h3>
                <div className={cx("fabric-subtitle")}>{fabric.subtitle}</div>

                <div className={cx("fabric-details")}>
                  <div className={cx("detail-composition")}>
                    {fabric.composition}
                  </div>

                  <div className={cx("detail-item")}>
                    <div className={cx("detail-label")}>Dành cho:</div>
                    <div className={cx("detail-text")}>{fabric.usage}</div>
                  </div>

                  <div className={cx("detail-item")}>
                    <div className={cx("detail-label")}>Cảm giác khi mặc:</div>
                    <div className={cx("detail-text")}>{fabric.benefits}</div>
                  </div>
                </div>

                <a href={fabric.productUrl} className={cx("fabric-button")}>
                  SẢN PHẨM {fabric.name.toUpperCase()}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductPreviewFabric;
