"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import styles from "./CategoryCollectionSlider.module.scss";
import classNames from "classnames/bind";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cx = classNames.bind(styles);

// Define category data
const categories = [
  {
    id: 1,
    title: "COOLMATE ACTIVE",
    categoryType: "active",
    children: [
      {
        id: 1,
        title: "Áo thể thao",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/November2023/comboactivef.3.png",
        link: "/category/ao-the-thao",
      },
      {
        id: 2,
        title: "Quần thể thao",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/February2024/filter24CMAW.QS008_1.jpg",
        link: "/category/quan-the-thao",
      },
 
      {
        id: 4,
        title: "Tập Gym",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/November2023/comboactivef.2.png",
        link: "/category/all",
      },
      {
        id: 5,
        title: "Ngoài trời",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/August2024/24CMAW.QJ002.26_(1).jpg",
        link: "/category/ao-thun-nam",
      },
      {
        id: 6,
        title: "Thể thao dụng cụ",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/September2024/24CMAW.AT034.22.jpg",
        link: "/category/phu-kien-nam",
      },
      {
        id: 7,
        title: "Tất cả",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=80,format=auto/uploads/April2024/filterbowiMask_group_copy.jpg",
        link: "/category/all",
      },
    ],
  },
  {
    id: 2,
    title: "COOLMATE NỮ",
    categoryType: "nu",
    children: [
      {
        id: 1,
        title: "BRA & LEGGINGS",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Legging_-_Brarr.jpg",
        link: "/category/ao-sport-bra",
      },
      {
        id: 2,
        title: "Áo Thể Thao",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Aorr.jpg",
        link: "/category/ao-the-thao-nu",
      },
      {
        id: 3,
        title: "QUẦN THỂ THAO",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Shortrr.jpg",
        link: "/category/quan-the-thao-nu",
      },
      {
        id: 4,
        title: "PHỤ KIỆN",
        image:
          "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2025/Phu_kienrr.jpg",
        link: "/category/phu-kien-nu",
      },
    ],
  },
];

interface CategoryCollectionSliderProps {
  categoryType?: string;
}

function CategoryCollectionSlider({
  categoryType = "active",
}: CategoryCollectionSliderProps) {
  const swiperRef = useRef(null);

  // Xác định danh mục hiển thị dựa trên categoryType
  const getCategoryData = () => {
    // Nếu categoryType là "nu", hiển thị danh mục "COOLMATE NỮ"
    if (categoryType === "nu") {
      return (
        categories.find((cat) => cat.categoryType === "nu") || categories[0]
      );
    }

    // Mặc định hiển thị "COOLMATE ACTIVE"
    return (
      categories.find((cat) => cat.categoryType === "active") || categories[0]
    );
  };

  const categoryData = getCategoryData();
  const isNuCategory = categoryType === "nu";

  // Render các slide cho danh mục nữ (hiển thị 4 ảnh căn giữa)
  const renderNuCategoryItems = () => {
    return (
      <div className={cx("centered-slides")}>
        {categoryData.children.map((category) => (
          <div key={category.id} className={cx("category-slide")}>
            <Link href={category.link} className={cx("category-item")}>
              <div className={cx("category-image-container")}>
                <Image
                  src={category.image}
                  alt={category.title}
                  width={220}
                  height={330}
                  className={cx("category-image")}
                />
              </div>
              <div className={cx("category-name")}>{category.title}</div>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  // Render các slide cho danh mục khác (sử dụng Swiper)
  const renderActiveCategorySlider = () => {
    return (
      <>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1.5}
          centeredSlides={false}
          loop={false}
          navigation={{
            nextEl: `.${cx("swiper-button-next")}`,
            prevEl: `.${cx("swiper-button-prev")}`,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2.5,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className={cx("category-swiper")}
        >
          {categoryData.children.map((category: any) => (
            <SwiperSlide key={category.id} className={cx("category-slide")}>
              <Link href={category.link} className={cx("category-item")}>
                <div className={cx("category-image-container")}>
                  <Image
                    src={category.image}
                    alt={category.title}
                    width={176}
                    height={260}
                    className={cx("category-image")}
                  />
                </div>
                <div className={cx("category-name")}>{category.title}</div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={cx("swiper-button-prev")}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L8 12L15 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={cx("swiper-button-next")}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L16 12L9 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </>
    );
  };

  return (
    <div className={cx("category-slider-container")}>
      <h2 className={cx("category-title")}>{categoryData.title}</h2>

      <div className={cx("slider-wrapper")}>
        {isNuCategory ? renderNuCategoryItems() : renderActiveCategorySlider()}
      </div>
    </div>
  );
}

export default CategoryCollectionSlider;
