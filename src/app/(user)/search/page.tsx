"use client";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Search.module.scss";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames/bind";
import CardProduct from "@/components/CardProduct/CardProduct";
import BannerPrivilege from "@/Layout/components/BannerPrivilege";
import { useSearchParams } from "next/navigation";
import { searchProductsGetAll } from "@/services/productServices";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);

function PageSearch() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const productsPerPage = 10; // 10 products per page

  // Custom loading icon for Ant Design Spin
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 36, color: "#2f5acf" }} spin />
  );

  // Fetch search results when queryParam changes
  useEffect(() => {
    if (queryParam) {
      setCurrentPage(1);
      fetchSearchResults(queryParam, 1);
    }
  }, [queryParam]);

  // Fetch search results from API
  const fetchSearchResults = async (
    query: string,
    page: number,
    append = false
  ) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await searchProductsGetAll(query, page, productsPerPage);

      if (append) {
        setSearchResults((prev) => [...prev, ...response.products]);
      } else {
        setSearchResults(response.products || []);
      }

      // Set pagination info from API response
      if (response.pagination) {
        setPagination(response.pagination);
      }

      // Update current page
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching search results:", error);
      if (!append) {
        setSearchResults([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "bestseller", label: "Bán chạy" },
    { value: "price-asc", label: "Giá thấp đến cao" },
    { value: "price-desc", label: "Giá cao đến thấp" },
    { value: "discount", label: "%Giảm giá nhiều" },
  ];

  // Current selected option label
  const selectedOption =
    sortOptions.find((option) => option.value === sortOption)?.label ||
    "Mới nhất";

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }

      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
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
    setIsSortDropdownOpen(false);

    // Sort the results
    let sortedResults = [...searchResults];
    switch (value) {
      case "price-asc":
        sortedResults.sort((a, b) => a.price.original - b.price.original);
        break;
      case "price-desc":
        sortedResults.sort((a, b) => b.price.original - a.price.original);
        break;
      case "discount":
        sortedResults.sort(
          (a, b) => b.price.discountQuantity - a.price.discountQuantity
        );
        break;
      // For newest and bestseller, use the default order from API
      default:
        break;
    }
    setSearchResults(sortedResults);
  };

  // Toggle dropdowns
  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle load more button click
  const handleLoadMore = () => {
    if (!loadingMore && currentPage < pagination.totalPages) {
      const nextPage = currentPage + 1;
      fetchSearchResults(queryParam, nextPage, true);
    }
  };

  // Calculate display stats
  const startItem = 1;
  const endItem = searchResults.length;
  const hasMorePages = currentPage < pagination.totalPages;

  return (
    <div className={cx("container-full")}>
      <div className={cx("search-header")}>
        <div className={cx("search-header-content")}>
          <h1 className={cx("search-title")}>Kết Quả Cho :</h1>
          <div className={cx("search-filters")}>
            <div className={cx("search-input-wrapper")}>
              <h3>{queryParam}</h3>
            </div>
            {/* <div className={cx("category-dropdown")} ref={categoryDropdownRef}>
              <button
                className={cx("category-button")}
                onClick={toggleCategoryDropdown}
              >
                Danh mục
                <svg
                  className={cx("select-arrow", {
                    "arrow-up": isCategoryDropdownOpen,
                  })}
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
              </button>
              {isCategoryDropdownOpen && (
                <div className={cx("category-dropdown-content")}>
                  <div
                    className={cx("category-item", {
                      active: categoryFilter === "",
                    })}
                    onClick={() => setCategoryFilter("")}
                  >
                    Tất cả
                  </div>
                  <div
                    className={cx("category-item", {
                      active: categoryFilter === "ao",
                    })}
                    onClick={() => setCategoryFilter("ao")}
                  >
                    Áo
                  </div>
                  <div
                    className={cx("category-item", {
                      active: categoryFilter === "quan",
                    })}
                    onClick={() => setCategoryFilter("quan")}
                  >
                    Quần
                  </div>
                  <div
                    className={cx("category-item", {
                      active: categoryFilter === "giay",
                    })}
                    onClick={() => setCategoryFilter("giay")}
                  >
                    Giày
                  </div>
                  <div
                    className={cx("category-item", {
                      active: categoryFilter === "phu-kien",
                    })}
                    onClick={() => setCategoryFilter("phu-kien")}
                  >
                    Phụ kiện
                  </div>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>

      <div className={cx("search-results")}>
        <div className={cx("results-header")}>
          <div className={cx("results-count")}>
            {loading ? "Đang tìm..." : `${pagination.total} kết quả`}
          </div>
          <div className={cx("sort-container")} ref={sortDropdownRef}>
            <span className={cx("sort-label")}>SẮP XẾP THEO</span>
            <div className={cx("custom-select")}>
              <div
                className={cx("select-selected")}
                onClick={toggleSortDropdown}
              >
                {selectedOption}
                <svg
                  className={cx("select-arrow", {
                    "arrow-up": isSortDropdownOpen,
                  })}
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
              {isSortDropdownOpen && (
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

        <Spin spinning={loading} indicator={antIcon}>
          {searchResults.length > 0 ? (
            <>
              <div className={cx("product-grid")}>
                {searchResults.map((product) => (
                  <CardProduct
                    key={product.id}
                    id={parseInt(product.id)}
                    title={product.name}
                    price={product.price.original}
                    originalPrice={product.price.discount}
                    discount={product.price.discountQuantity}
                    rating={4.8}
                    reviewCount={product.comment?.length || 0}
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
                ))}
              </div>
            </>
          ) : (
            !loading && (
              <div className={cx("no-results")}>
                <div className={cx("no-results-content")}>
                  <h2>Không tìm thấy sản phẩm nào</h2>
                  <p>
                    Vui lòng thử lại với từ khóa khác hoặc xem các sản phẩm nổi
                    bật của chúng tôi
                  </p>
                  <Link
                    href="/collections/all"
                    className={cx("browse-all-btn")}
                  >
                    Xem tất cả sản phẩm
                  </Link>
                </div>
              </div>
            )
          )}
        </Spin>
      </div>

      {/* Load More Section */}
      {searchResults.length > 0 && (
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
            Hiển thị {startItem} - {endItem} trên tổng số {pagination.total} sản
            phẩm
            {currentPage === pagination.totalPages && " (đã hiển thị tất cả)"}
          </div>
        </div>
      )}

      {/* Banner Privilege Section */}
      <div className={cx("banner-container")}>
        <BannerPrivilege />
      </div>
    </div>
  );
}

export default PageSearch;
