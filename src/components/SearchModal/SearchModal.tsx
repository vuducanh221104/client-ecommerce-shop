"use client";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./SearchModal.module.scss";
import Image from "next/image";
import Link from "next/link";
import CardProduct from "../CardProduct/CardProduct";
import { searchProducts, ProductOutstanding } from "@/services/productServices";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const cx = classNames.bind(styles);

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const router = useRouter();

  // Custom loading icon for Ant Design Spin
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 36, color: "#2f5acf" }} spin />
  );

  // Fetch featured products when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFeaturedProducts();
    }
  }, [isOpen]);

  // Fetch featured products using the ProductOutstanding API
  const fetchFeaturedProducts = async () => {
    if (featuredProducts.length > 0) return; // Don't fetch if we already have data

    setFeaturedLoading(true);
    try {
      const response = await ProductOutstanding("");
      setFeaturedProducts(response.products || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  // Focus on input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search requests to avoid too many API calls
    if (query.trim().length > 0) {
      setLoading(true); // Show loading immediately when typing
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 500);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      // Navigate to search results page and close modal
      navigateToSearchResults();
    }
  };

  const navigateToSearchResults = () => {
    if (searchQuery.trim().length > 0) {
      onClose(); // Close the modal
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleViewAllClick = () => {
    onClose(); // Close the modal when clicking "View All"
  };

  const performSearch = async (query: string) => {
    if (query.trim() === "") {
      setLoading(false);
      return;
    }

    setHasSearched(true);

    try {
      const response = await searchProducts(query);
      setSearchResults(response.products || []);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderProductGrid = (products: any[], isSearchResults = false) => {
    return (
      <>
        <div
          className={cx(
            "grid",
            "spotlight-header-search__wrapper",
            "grid--four-columns",
            "large-grid--four-columns",
            "tablet-grid--three-columns",
            "mobile-grid--two-columns",
            "is-active"
          )}
        >
          {products.map((product) => (
            <div className={cx("grid__column")} key={product.id}>
              <CardProduct
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
            </div>
          ))}
        </div>
        <div className={cx("spotlight-header-search__viewmore", "is-active")}>
          <Link
            href={
              isSearchResults
                ? `/search?q=${encodeURIComponent(searchQuery)}`
                : "/collections/all"
            }
            className={cx("btn", "btn-primary")}
            onClick={handleViewAllClick}
          >
            Xem tất cả
          </Link>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={cx("header-search", "mobile--hidden", "is-active")}>
        <form onSubmit={handleSearchSubmit}>
          <div className={cx("header-search__wrapper")}>
            <label className={cx("header-search__field")}>
              <input
                placeholder="Tìm Kiếm Sản Phẩm"
                type="text"
                className={cx("header-search__control", "one-whole")}
                value={searchQuery}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
              <button
                type="button"
                className={cx("homepage-search__submit")}
                style={{
                  top: "13px",
                  right: "30px",
                  width: "unset",
                  height: "unset",
                  zIndex: 10,
                }}
                onClick={navigateToSearchResults}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.8002 19.6905L17.9213 16.5856C19.5193 14.6641 20.3123 12.1989 20.1342 9.70609C19.9561 7.21325 18.8208 4.88587 16.9659 3.21104C15.1109 1.5362 12.68 0.643744 10.182 0.720377C7.68398 0.79701 5.31241 1.83678 3.56359 3.62217C1.81477 5.40756 0.824241 7.80016 0.79931 10.2992C0.774379 12.7983 1.71695 15.2102 3.4298 17.0301C5.14266 18.8501 7.49307 19.9369 9.98907 20.0634C12.4851 20.1898 14.9332 19.346 16.8212 17.7085L19.6462 20.7575C19.7892 20.9041 19.9838 20.9889 20.1884 20.9941C20.3931 20.9992 20.5916 20.9242 20.7418 20.785C20.8919 20.6458 20.9818 20.4535 20.9921 20.2491C21.0025 20.0446 20.9325 19.8442 20.7972 19.6905H20.8002ZM2.57025 10.5415C2.57025 8.96444 3.03792 7.42275 3.91412 6.11143C4.79031 4.80011 6.03567 3.77807 7.49273 3.17454C8.94979 2.57101 10.5531 2.41306 12.0999 2.72074C13.6467 3.02842 15.0675 3.78787 16.1827 4.90306C17.2979 6.01824 18.0574 7.43908 18.365 8.98588C18.6727 10.5327 18.5148 12.136 17.9112 13.5931C17.3077 15.0501 16.2857 16.2955 14.9744 17.1717C13.663 18.0479 12.1214 18.5155 10.5442 18.5155C8.42997 18.5134 6.40288 17.6726 4.90777 16.1777C3.41265 14.6828 2.57159 12.6558 2.56921 10.5415H2.57025Z"
                    fill="#80949D"
                  ></path>
                </svg>
              </button>
            </label>
            <button
              className={cx("homepage-search__submit", "is-active")}
              style={{
                top: "13px",
                right: "-75px",
                width: "unset",
                height: "unset",
                zIndex: 10,
              }}
              onClick={onClose}
              type="button"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.6">
                  <path
                    d="M0.710153 1.39081C1.10215 0.719768 1.8828 0.603147 2.4538 1.13033L20.9665 18.2226C21.5375 18.7498 21.6826 19.7211 21.2906 20.3922V20.3922C20.8986 21.0632 20.118 21.1798 19.547 20.6526L1.03426 3.56039C0.463267 3.0332 0.318158 2.06185 0.710153 1.39081V1.39081Z"
                    fill="black"
                  ></path>
                  <path
                    d="M0.821701 20.5854C0.421822 19.9218 0.552504 18.9506 1.11359 18.4163L19.4354 0.967765C19.9965 0.433427 20.7755 0.538253 21.1754 1.2019V1.2019C21.5753 1.86555 21.4446 2.83671 20.8835 3.37105L2.56168 20.8196C2.00059 21.3539 1.22158 21.2491 0.821701 20.5854V20.5854Z"
                    fill="black"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </form>

        <div className={cx("spotlight-header-search__float")}>
          <div
            className={cx(
              "spotlight-search-content",
              "mobile--hidden",
              "tablet--hidden",
              "is-active"
            )}
          >
            <div className={cx("spotlight-search-content__wrapper")}>
              <div className={cx("spotlight-header-search", "is-active")}>
                {searchQuery.trim().length > 0 && (
                  <div className={cx("spotlight-header-search__suggestions")}>
                    <ul className={cx("search-suggestions")}>
                      <li className={cx("search-suggestions__item")}>
                        <strong>Tìm Kiếm: {searchQuery}</strong>
                      </li>
                    </ul>
                  </div>
                )}

                <Spin
                  indicator={antIcon}
                  spinning={loading}
                  className={cx("search-spinner")}
                >
                  {hasSearched && (
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        marginTop: "10px",
                        padding: "0px 95px",
                      }}
                    >
                      {searchResults.length > 0
                        ? `Tìm thấy ${searchResults.length} sản phẩm`
                        : ""}
                    </p>
                  )}

                  {/* Search results */}
                  {hasSearched ? (
                    searchResults.length > 0 ? (
                      renderProductGrid(searchResults, true)
                    ) : (
                      <div className={cx("no-results-container")}>
                        <p className={cx("no-results-text")}>
                          Không tìm thấy sản phẩm phù hợp với từ khóa "
                          {searchQuery}"
                        </p>
                        <p className={cx("no-results-suggestion")}>
                          Vui lòng thử lại với từ khóa khác hoặc xem các sản
                          phẩm nổi bật của chúng tôi
                        </p>
                        <Link
                          href="/collections/all"
                          className={cx("btn", "btn-primary", "no-results-btn")}
                          onClick={handleViewAllClick}
                        >
                          Xem tất cả sản phẩm
                        </Link>
                      </div>
                    )
                  ) : (
                    // Featured products section when not searching
                    <div className={cx("featured-products-section")}>
                      <p className={cx("section-title")}>Sản phẩm nổi bật</p>
                      {featuredLoading ? (
                        <div className={cx("featured-loading")}>
                          <Spin indicator={antIcon} />
                        </div>
                      ) : (
                        featuredProducts.length > 0 &&
                        renderProductGrid(featuredProducts)
                      )}
                    </div>
                  )}
                </Spin>
              </div>
            </div>
          </div>
          <div
            className={cx("spotlight-header-search__background")}
            onClick={onClose}
          ></div>
        </div>
      </div>
    </>
  );
}

export default SearchModal;
