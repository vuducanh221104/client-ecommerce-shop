"use client";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CardProduct.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

interface ColorOption {
  id: number;
  name: string;
  color: string;
  colorCode: string;
  images?: {
    main: string;
    hover: string;
  };
}

interface ProductProps {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  link: string;
  isNew?: boolean;
  image: string;
  hoverImage: string;
  colors: ColorOption[];
  sizes?: string[];
}

function CardProduct({
  id,
  title,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
  link,
  isNew,
  image,
  hoverImage,
  colors,
  sizes,
}: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id);

  // Find the selected color
  const selectedColor =
    colors.find((color) => color.id === selectedColorId) || colors[0];

  // Get current images to display
  const currentImage = selectedColor.images?.main || image;
  const currentHoverImage = selectedColor.images?.hover || hoverImage;

  // Format price with comma for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle color selection
  const handleColorClick = (colorId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation from the Link component
    setSelectedColorId(colorId);
  };

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

          {rating && (
            <div className={cx("product-rating")}>
              <span className={cx("rating-score")}>{rating}</span>
              <span className={cx("rating-star")}>★</span>
              <span className={cx("review-count")}>({reviewCount})</span>
            </div>
          )}

          {sizes && sizes.length > 0 && (
            <div className={cx("quick-size-options")}>
              <span className={cx("size-label")}>
                Thêm nhanh vào giỏ hàng +
              </span>
              <div className={cx("size-buttons")}>
                {sizes.map((size) => (
                  <button key={size} className={cx("size-button")}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          <div className={cx("color-options")}>
            {colors.map((color) => (
              <span
                key={color.id}
                className={cx("color-option", {
                  selected: color.id === selectedColorId,
                })}
                style={{ backgroundColor: color.colorCode }}
                title={color.name}
                onClick={(e) => handleColorClick(color.id, e)}
              ></span>
            ))}
          </div>

          <h3 className={cx("product-title")}>{title}</h3>

          <div className={cx("product-price")}>
            <span className={cx("current-price")}>{formatPrice(price)}đ</span>
            {discount > 0 && (
              <>
                <span className={cx("discount-badge")}>-{discount}%</span>
                <span className={cx("original-price")}>
                  {formatPrice(originalPrice)}đ
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
