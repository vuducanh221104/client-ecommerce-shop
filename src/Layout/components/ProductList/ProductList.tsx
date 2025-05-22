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
import { getProductsByCategory, productGetAll } from "@/services/productServices";
import Loading from "@/components/Loading";

const cx = classNames.bind(styles);

interface ProductListProps {
  title?: string;
  linkToViewAll?: string;
  viewAllText?: string;
  categorySlug?: string;
  limit?: number;
}

function ProductList({
  title = "SẢN PHẨM NỔI BẬT",
  linkToViewAll = "/collections/san-pham-noi-bat",
  viewAllText = "Xem Thêm",
  categorySlug,
  limit = 12
}: ProductListProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        
        if (categorySlug) {
          // If a category is specified, fetch products for that category
          response = await getProductsByCategory(categorySlug, limit);
        } else {
          // Otherwise fetch all products
          response = await productGetAll();
        }
        
        setProducts(response.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [categorySlug, limit]);

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

        {loading ? (
          <div className={cx("product-list-loading")}>
            <Loading />
          </div>
        ) : (
          <div className={cx("product-list-slider")}>
            <Swiper
              navigation={{
                nextEl: `.${cx("custom-swiper-button-next")}`,
                prevEl: `.${cx("custom-swiper-button-prev")}`,
              }}
              modules={[Navigation, Autoplay]}
              loop={true}
              loopAdditionalSlides={4}
              spaceBetween={20}
              speed={200}
              slidesPerGroup={4}
              slidesPerView={"auto"}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                320: {
                  slidesPerView: 1.5,
                  spaceBetween: 10,
                  slidesPerGroup: 1,
                },
                400: {
                  slidesPerView: 1.5,
                  spaceBetween: 10,
                  slidesPerGroup: 1,
                },
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 15,
                  slidesPerGroup: 2,
                },
                768: {
                  slidesPerView: 3.5,
                  spaceBetween: 15,
                  slidesPerGroup: 3,
                },
                1024: {
                  slidesPerView: 4.5,
                  spaceBetween: 20,
                  slidesPerGroup: 4,
                },
              }}
              className={cx("swiper-container")}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className={cx("swiper-slide")}>
                  <CardProduct
                    id={parseInt(product.id)}
                    title={product.name}
                    price={product.price.original}
                    priceDiscount={product.price.discount}
                    discountQuantity={product.price.discountQuantity}
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
        )}
      </div>
    </div>
  );
}

export default ProductList;
