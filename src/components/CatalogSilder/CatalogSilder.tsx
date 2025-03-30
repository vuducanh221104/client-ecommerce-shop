"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./CatalogSilder.module.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cx = classNames.bind(styles);

// Dữ liệu cho đồ nam
const menCatalogItems = [
  {
    id: 1,
    title: "ÁO KHOÁC",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Thun_4.jpg",
    link: "/collections/ao-khoac",
  },
  {
    id: 2,
    title: "QUẦN DÀI",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/So_mi.jpg",
    link: "/collections/quan-dai",
  },
  {
    id: 3,
    title: "QUẦN SHORT",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Khoac_52.jpg",
    link: "/collections/quan-short",
  },
  {
    id: 4,
    title: "QUẦN LÓT",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Short_29.jpg",
    link: "/collections/quan-lot",
  },
  {
    id: 5,
    title: "PHỤ KIỆN",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Do_lot.jpg",
    link: "/collections/phu-kien-nam",
  },
];

// Dữ liệu cho đồ nữ
const womenCatalogItems = [
  {
    id: 1,
    title: "BRA & LEGGINGS",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Frame_img.jpg",
    link: "/collections/bra-leggings",
  },
  {
    id: 2,
    title: "ÁO THỂ THAO",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Frame_img_(1).jpg",
    link: "/collections/ao-the-thao-nu",
  },
  {
    id: 3,
    title: "QUẦN THỂ THAO",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/image_(3).jpg",
    link: "/collections/quan-the-thao-nu",
  },
  {
    id: 4,
    title: "PHỤ KIỆN",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/image_96.png",
    link: "/collections/phu-kien-nu",
  },
];

type CatalogCategory = "men" | "women";

function CatalogSilder() {
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>("men");

  const catalogItems =
    activeCategory === "men" ? menCatalogItems : womenCatalogItems;

  return (
    <div className={cx("catalog-section")}>
      <h2 className={cx("section-title")}>Danh mục nổi bật</h2>

      <div className={cx("catalog-tabs")}>
        <button
          className={cx("catalog-tab", { active: activeCategory === "men" })}
          onClick={() => setActiveCategory("men")}
        >
          ĐỒ NAM
        </button>
        <button
          className={cx("catalog-tab", { active: activeCategory === "women" })}
          onClick={() => setActiveCategory("women")}
        >
          ĐỒ NỮ
        </button>
      </div>

      <div className={cx("catalog-slider")}>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          speed={400}
          slidesPerView="auto"
          navigation
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            400: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3.5,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
          }}
          className={cx("swiper-container")}
        >
          {catalogItems.map((item) => (
            <SwiperSlide key={item.id} className={cx("catalog-item")}>
              <Link href={item.link} className={cx("catalog-link")}>
                <div className={cx("catalog-image-wrapper")}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={400}
                    className={cx("catalog-image")}
                  />
                </div>
                <h3 className={cx("catalog-title")}>{item.title}</h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default CatalogSilder;
