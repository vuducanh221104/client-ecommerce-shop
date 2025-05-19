"use client";
import React, { useRef, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProductList.module.scss";
import CardProduct from "@/components/CardProduct/CardProduct";
import Link from "next/link";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { productGetAll } from "@/services/productServices";

const cx = classNames.bind(styles);

interface ProductListProps {
  title?: string;
  linkToViewAll?: string;
  viewAllText?: string;
}

function ProductList({
  title = "SẢN PHẨM NỔI BẬT",
  linkToViewAll = "/collections/san-pham-noi-bat",
  viewAllText = "Xem Thêm",
}: ProductListProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  console.log(products);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productGetAll();
        setProducts(response.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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
            modules={[Navigation, Autoplay, Pagination]}
            loop={true}
            spaceBetween={20}
            speed={200}
            slidesPerView={"auto"}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            pagination={{ clickable: true }}
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
            {products.map((product) => (
              <SwiperSlide key={product.id} className={cx("swiper-slide")}>
                <CardProduct
                  id={parseInt(product.id)}
                  title={product.name}
                  price={product.price}
                  discount={product.price.discountQuantity}
                  rating={4.8}
                  reviewCount={12}
                  link={`/product/${product.slug}`}
                  isNew={product.tagIsNew}
                  image={product.variants[0]?.images[0]}
                  hoverImage={product.variants[0]?.images[1]}
                  colors={product.variants.map((variant: any, index: any) => {
                    return {
                      id: index + 1,
                      name: variant.name,
                      color: variant.name,
                      images: {
                        main: variant.images[0],
                        hover: variant.images[1],
                      },
                      colorThumbnail: variant.colorThumbnail,
                    };
                  })}
                />
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
