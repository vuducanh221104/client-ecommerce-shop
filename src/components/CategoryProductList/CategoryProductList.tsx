"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryProductList.module.scss";
import classNames from "classnames/bind";
import CardProduct from "../CardProduct/CardProduct";
import BannerPrivilege from "@/Layout/components/BannerPrivilege";
import { categoryGetBySlug } from "@/services/categoryServices";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import NotFound from "../NotFound";

const cx = classNames.bind(styles);

interface CategoryProductListProps {
  slug: string;
  initialProducts: any[];
  category: any;
  initialPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  loadingMore: boolean;
  onLoadMore: (page: number) => Promise<void>;
  onSortProducts: (option: string) => void;
  currentSortOption?: string;
}

function CategoryProductList({
  slug,
  initialProducts,
  category,
  initialPagination,
  loadingMore,
  onLoadMore,
  onSortProducts,
  currentSortOption = "newest",
}: CategoryProductListProps) {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [sortOption, setSortOption] = useState(currentSortOption);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom loading icon for Ant Design Spin
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 36, color: "#2f5acf" }} spin />
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSortSelection = (value: string) => {
    setSortOption(value);
    setIsDropdownOpen(false);
    onSortProducts(value);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle mouse enter/leave for hover effects
  const handleMouseEnter = (productId: number) => {
    setHoveredProductId(productId);
  };

  const handleMouseLeave = () => {
    setHoveredProductId(null);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && currentPage < initialPagination.totalPages) {
      const nextPage = currentPage + 1;
      onLoadMore(nextPage).then(() => {
        setCurrentPage(nextPage);
      });
    }
  };

  // Calculate display stats for pagination info
  const startItem = 1;
  const endItem = initialProducts.length;
  const hasMorePages = currentPage < initialPagination.totalPages;

  return (
    <div className={cx("container-full")}>
      <div className={cx("product-list-header")}>
        <div className={cx("product-count")}>
          {initialPagination.total} kết quả
        </div>
        <div className={cx("sort-container")} ref={dropdownRef}>
          <span className={cx("sort-label")}>SẮP XẾP THEO</span>
          <div className={cx("custom-select")}>
            <div className={cx("select-selected")} onClick={toggleDropdown}>
              {sortOptions.find((option) => option.value === sortOption)
                ?.label || "Mới nhất"}
              <svg
                className={cx("select-arrow", { "arrow-up": isDropdownOpen })}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {isDropdownOpen && (
              <div className={cx("select-items")}>
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cx("select-item", {
                      active: option.value === sortOption,
                    })}
                    onClick={() => handleSortSelection(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Spin spinning={loadingMore} indicator={antIcon}>
        <div className={cx("product-grid")}>
          {initialProducts.length > 0 ? (
            initialProducts.map((product) => (
              <CardProduct
                key={product.id}
                id={parseInt(product.id)}
                title={product.name}
                price={product.price.original}
                priceDiscount={product.price.discount}
                discountQuantity={product.price.discountQuantity}
                rating={4.8}
                reviewCount={product.comment?.length || 0}
                link={`/product/${product.slug}`}
                isNew={product.tagIsNew}
                image={product.variants[0]?.images[0]}
                hoverImage={
                  product.variants[0]?.images[1] ||
                  product.variants[0]?.images[0]
                }
                colors={product.variants.map((variant: any, index: any) => {
                  return {
                    id: index + 1,
                    name: variant.name,
                    color: variant.name,
                    images: {
                      main: variant.images[0],
                      hover: variant.images[1] || variant.images[0],
                    },
                    colorThumbnail: variant.colorThumbnail,
                  };
                })}
              />
            ))
          ) : (
            <></>
            // <div className={cx("no-products")} style={{ width: "100%" }}>
            //   <h2 style={{ textAlign: "center" }}>Không tìm thấy sản phẩm</h2>
            //   <p>
            //     Vui lòng thử danh mục khác hoặc liên hệ với chúng tôi để được hỗ
            //     trợ.
            //   </p>
            // </div>
          )}
        </div>
      </Spin>

      {/* Load More Section */}
      {initialProducts.length > 0 && (
        <div className={cx("load-more-container")}>
          {hasMorePages && (
            <button
              className={cx("load-more-button")}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "ĐANG TẢI..." : "XEM THÊM"}
            </button>
          )}
          <div className={cx("pagination-info")}>
            Hiển thị {startItem} - {endItem} trên tổng số{" "}
            {initialPagination.total} sản phẩm
            {currentPage === initialPagination.totalPages &&
              " (đã hiển thị tất cả)"}
          </div>
        </div>
      )}

      <div className="container">
        <BannerPrivilege />
      </div>
    </div>
  );
}

// Sort options
const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "bestseller", label: "Bán chạy" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "discount", label: "%Giảm giá nhiều" },
];

export default CategoryProductList;
