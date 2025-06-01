"use client";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./CardProduct.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

interface ColorOption {
  id: number;
  name: string;
  color: string;
  images?: {
    main: string;
    hover: string;
  };
  colorThumbnail?: string;
  sizes?: Array<{
    size: string;
    stock: number;
  }>;
}

interface ProductProps {
  id?: number;
  title: string;
  price?: any;
  priceDiscount?: any;
  discountQuantity?: number;
  rating: number;
  reviewCount: number;
  link: string;
  isNew?: boolean;
  image: string;
  hoverImage: string;
  colors: ColorOption[];
  sizes?: string[];
  outOfStock?: boolean;
  comment?: any[];
}

function CardProduct({
  id,
  title,
  price,
  priceDiscount,
  discountQuantity,
  rating,
  reviewCount,
  link,
  isNew,
  image,
  hoverImage,
  colors,
  sizes,
  outOfStock = false,
  comment = [],
}: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id);
  const [showAllColors, setShowAllColors] = useState(false);
  const [isCurrentColorOutOfStock, setIsCurrentColorOutOfStock] =
    useState(false);
  // Maximum number of colors   to show initially
  const MAX_COLORS_VISIBLE = 6;
  const hasExtraColors = colors.length > MAX_COLORS_VISIBLE;
  const hiddenColorsCount = colors.length - MAX_COLORS_VISIBLE;

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (!price || !priceDiscount || priceDiscount >= price) return 0;
    const discount = price - priceDiscount;
    const percentage = Math.round((discount / price) * 100);
    return percentage;
  };

  // Get calculated discount percentage
  const discountPercentage = calculateDiscountPercentage();

  // Get the colors to display based on showAllColors state
  const visibleColors = showAllColors
    ? colors
    : hasExtraColors
    ? colors.slice(0, MAX_COLORS_VISIBLE)
    : colors;

  // Find the selected color
  const selectedColor =
    colors.find((color) => color.id === selectedColorId) || colors[0];

  // Get current images to display
  const currentImage = selectedColor.images?.main || image;
  const currentHoverImage = selectedColor.images?.hover || hoverImage;

  // Format price with comma for thousands
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle color selection
  const handleColorClick = (colorId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation from the Link component
    setSelectedColorId(colorId);
  };

  // Handle show more colors click
  const handleShowMoreColors = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setShowAllColors(true);
  };

  // Check if selected color is out of stock
  useEffect(() => {
    if (selectedColor && selectedColor.sizes) {
      // Si todos los tamaños tienen stock 0, el color está agotado
      const allSizesOutOfStock = selectedColor.sizes.every(
        (size) => size.stock <= 0
      );
      setIsCurrentColorOutOfStock(allSizesOutOfStock);
    } else {
      setIsCurrentColorOutOfStock(outOfStock);
    }
  }, [selectedColorId, selectedColor, outOfStock]);

  // Calculate the average rating from comments
  const calculateAverageRating = () => {
    if (!comment || comment.length === 0) return 0;
    
    const sum = comment.reduce((total, item) => {
      return total + (item.rating || 0);
    }, 0);
    
    return sum / comment.length;
  };
  
  // Get the calculated average rating
  const averageRating = calculateAverageRating();
  const formattedRating = averageRating > 0 ? averageRating.toFixed(1) : "0";
  const commentCount = comment?.length || 0;

  return (
    <div className={cx("product-card")}>
      <Link href={link} className={cx("product-link")}>
        <div
          className={cx("product-image-container")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={cx("product-image-wrapper", {
              "image-hover": isHovered,
            })}
          >
            <Image
              src={currentImage}
              alt={title}
              width={672}
              height={990}
              className={cx("product-image", "primary-image")}
            />
            <Image
              src={currentHoverImage}
              alt={`${title} - Preview`}
              width={672}
              height={990}
              className={cx("product-image", "hover-image")}
            />
          </div>

          {isNew && (
            <span className={cx("product-badge", "new-badge")}>NEW</span>
          )}

          {isCurrentColorOutOfStock && (
            <span
              className={cx("product-badge", "out-of-stock-badge")}
              style={{
                backgroundColor: "#ff3b30",
                right: "10px",
                left: "auto",
              }}
            >
              HẾT HÀNG
            </span>
          )}

          <div className={cx("product-rating")}>
            <span className={cx("rating-score")}>{formattedRating}</span>
            <span className={cx("rating-star")}>★</span>
            <span className={cx("review-count")}>({commentCount})</span>
          </div>

          <div className={cx("product-promo")}>
            <Image
              src="https://media3.coolmate.me/cdn-cgi/image/width=713,height=1050,quality=85/uploads/March2025/Footer_-_Mua_3_giam_10_1_(1).jpg"
              alt="MUA 3 GIẢM THÊM 10%"
              width={300}
              height={40}
              className={cx("promo-image")}
            />
          </div>
        </div>

        <div className={cx("product-info")}>
          <div className={cx("color-options-container")}>
            <div className={cx("color-options")}>
              {visibleColors.map((color) => (
                <Image
                  key={color.id}
                  className={cx("color-option", {
                    selected: color.id === selectedColorId,
                  })}
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  src={color.colorThumbnail || ""}
                  alt={color.name}
                  width={160}
                  height={160}
                  title={color.name}
                  onClick={(e) => handleColorClick(color.id, e)}
                />
              ))}

              {hasExtraColors && !showAllColors && (
                <button
                  className={cx("more-colors-button")}
                  onClick={handleShowMoreColors}
                  title={`Show ${hiddenColorsCount} more colors`}
                >
                  +{hiddenColorsCount}
                </button>
              )}
            </div>
          </div>

          <h3 className={cx("product-title")}>{title}</h3>

          <div className={cx("product-price")}>
            <span className={cx("current-price")}>
              {formatPrice(
                priceDiscount > 0 ? priceDiscount : price
              )}
              đ
            </span>
            {priceDiscount > 0 && price > priceDiscount && (
              <>
                {discountPercentage > 0 && (
                  <span className={cx("discount-badge")}>-{discountPercentage}%</span>
                )}
                <span className={cx("original-price")}>
                  {formatPrice(price)}đ
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardProduct;
