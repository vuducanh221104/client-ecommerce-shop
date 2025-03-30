"use client";
import React, { useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";
import CardProduct from "@/components/CardProduct";
import Link from "next/link";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

const cx = classNames.bind(styles);

// Mock data for products
const productData = [
  {
    id: 1,
    title: "Áo thun nữ chạy bộ Core Tee Slimfit",
    price: 179000,
    originalPrice: 199000,
    discount: 10,
    rating: 5,
    reviewCount: 2,
    link: "/products/ao-thun-nu-chay-bo-core-tee-slimfit",
    isNew: true,
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-11872-tim_85.jpg",
    hoverImage:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-12012-tim_7.jpg",
    colors: [
      {
        id: 1,
        name: "Tím",
        color: "purple",
        colorCode: "#a389d1",
        images: {
          main: "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-11872-tim_85.jpg",
          hover:
            "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-12012-tim_7.jpg",
        },
      },
      {
        id: 2,
        name: "Xanh lá",
        color: "green",
        colorCode: "#c5e0b4",
        images: {
          main: "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-10112-xanh_23.jpg",
          hover:
            "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-10322-xanh_51.jpg",
        },
      },
      {
        id: 3,
        name: "Đen",
        color: "black",
        colorCode: "#000000",
        images: {
          main: "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-10402-den_14.jpg",
          hover:
            "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/March2025/ao-thun-nu-chay-bo-core-tee-slimfit-10602-den_45.jpg",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Áo thun chạy bộ Advanced Vent Tech",
    price: 176000,
    originalPrice: 220000,
    discount: 20,
    rating: 4.8,
    reviewCount: 11,
    link: "/products/ao-thun-chay-bo-advanced-vent-tech",
    isNew: false,
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/October2023/DSC02379.jpg",
    hoverImage:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/December2023/DSC02380.jpg",
    colors: [
      {
        id: 1,
        name: "Đen",
        color: "black",
        colorCode: "#000000",
        images: {
          main: "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/October2023/DSC02379.jpg",
          hover:
            "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/December2023/DSC02380.jpg",
        },
      },
      {
        id: 2,
        name: "Xanh navy",
        color: "navy",
        colorCode: "#1B2963",
        images: {
          main: "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/October2023/DSC02407.jpg",
          hover:
            "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/December2023/DSC02408.jpg",
        },
      },
      {
        id: 3,
        name: "Vàng",
        color: "yellow",
        colorCode: "#F5D547",
        images: {
          main: "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/October2023/DSC02431.jpg",
          hover:
            "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/December2023/DSC02432.jpg",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Quần Shorts chạy bộ Advanced Vent Tech",
    price: 180000,
    originalPrice: 239000,
    discount: 25,
    rating: 4.7,
    reviewCount: 12,
    link: "/products/quan-shorts-chay-bo-advanced-vent-tech",
    isNew: false,
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/September2023/DSC02066-copysm.jpg",
    hoverImage:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/September2023/DSC02075-copyyyyyysm.jpg",
    colors: [
      { id: 1, name: "Xám", color: "gray", colorCode: "#9c9c9c" },
      { id: 2, name: "Trắng", color: "white", colorCode: "#ffffff" },
      { id: 3, name: "Xanh olive", color: "olive", colorCode: "#4D5645" },
      { id: 4, name: "Đen", color: "black", colorCode: "#000000" },
    ],
    sizes: ["M", "L", "2XL", "3XL"],
  },
  {
    id: 4,
    title: "Áo Singlet nữ chạy bộ Core Tank",
    price: 170000,
    originalPrice: 189000,
    discount: 10,
    rating: 4.8,
    reviewCount: 3,
    link: "/products/ao-singlet-nu-chay-bo-core-tank",
    isNew: true,
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2024/DSC00040-copysmall.jpg",
    hoverImage:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2024/DSC00117-copysmall.jpg",
    colors: [
      { id: 1, name: "Hồng nhạt", color: "pink", colorCode: "#f9dbdb" },
      { id: 2, name: "Tím nhạt", color: "lightpurple", colorCode: "#d6d3f2" },
      { id: 3, name: "Xanh mint", color: "mint", colorCode: "#b8e2e2" },
      { id: 4, name: "Xám nhạt", color: "lightgray", colorCode: "#e5e5e5" },
      { id: 5, name: "Đen", color: "black", colorCode: "#000000" },
    ],
  },
  {
    id: 5,
    title: "Áo Singlet Chạy Bộ Graphic Special",
    price: 142000,
    originalPrice: 189000,
    discount: 25,
    rating: 4.8,
    reviewCount: 15,
    link: "/products/ao-singlet-chay-bo-graphic-special",
    isNew: false,
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/July2023/DSC08595-copysm.jpg",
    hoverImage:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/July2023/DSC08602-copysm.jpg",
    colors: [
      { id: 1, name: "Xanh biển", color: "blue", colorCode: "#4C87CA" },
      { id: 2, name: "Tím", color: "purple", colorCode: "#8A0C9E" },
      { id: 3, name: "Xanh navy", color: "navy", colorCode: "#1B2963" },
    ],
  },
  {
    id: 6,
    title: "Quần Short chạy bộ Graphic Pattern",
    price: 159000,
    originalPrice: 219000,
    discount: 27,
    rating: 4.9,
    reviewCount: 8,
    link: "/products/quan-short-chay-bo-graphic-pattern",
    isNew: false,
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/DSC00099_69.jpg",
    hoverImage:
      "https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/DSC00103_51.jpg",
    colors: [
      { id: 1, name: "Xanh navy", color: "navy", colorCode: "#1B2963" },
      { id: 2, name: "Đen", color: "black", colorCode: "#000000" },
      { id: 3, name: "Xám", color: "gray", colorCode: "#9c9c9c" },
    ],
  },
];

interface ProductListProps {
  title?: string;
  linkToViewAll?: string;
  viewAllText?: string;
}

function ProductList({
  title = "SẢN PHẨM CHẠY BỘ",
  linkToViewAll = "/collections/chay-bo",
  viewAllText = "Xem Thêm",
}: ProductListProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // Effect to ensure loop mode is enabled after component mounts
  useEffect(() => {
    if (swiperRef.current) {
      // Need a small delay to ensure Swiper is fully initialized
      const timer = setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.update();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={cx("product-list-section")}>
      <div className={cx("product-list-container")}>
        <div className={cx("product-list-header")}>
          <h2 className={cx("section-title")}>{title}</h2>
          <Link href={linkToViewAll} className={cx("view-more-link")}>
            {viewAllText}
          </Link>
        </div>

        <div className={cx("product-list-slider")}>
          <Swiper
            navigation={{
              nextEl: `.${cx("custom-swiper-button-next")}`,
              prevEl: `.${cx("custom-swiper-button-prev")}`,
            }}
            modules={[Navigation, Autoplay]}
            loop={true}
            spaceBetween={20}
            speed={200}
            slidesPerView={"auto"}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 10,
              },
              400: {
                slidesPerView: 1.5,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 15,
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
            {productData.map((product) => (
              <SwiperSlide key={product.id} className={cx("swiper-slide")}>
                <CardProduct {...product} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={cx("custom-swiper-button-prev")}>
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
          <div className={cx("custom-swiper-button-next")}>
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
        </div>
      </div>
    </div>
  );
}

export default ProductList;
