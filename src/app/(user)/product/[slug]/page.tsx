"use client";
import React, { useEffect, useState, use } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import Link from "next/link";
import { BiShare } from "react-icons/bi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-hot-toast";

import styles from "@/styles/ProductDetail.module.scss";
import classNames from "classnames/bind";
import ProductDescription from "../../../../Layout/components/ProductDescription/ProductDescription";
import ProductPreviewFabric from "../../../../Layout/components/ProductPreviewFabric";
import Image from "next/image";
import { productGetBySlug } from "@/services/productServices";
import { addToCart } from "@/services/CartServices";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart } from "@/redux/cartSlice";
import { RootState } from "@/redux/store";

const cx = classNames.bind(styles);

interface Size {
  size: string;
  stock: number;
  _id: string;
}

interface Variant {
  name: string;
  color: string;
  colorThumbnail: string;
  images: string[];
  sizes: Size[];
}

interface ProductData {
  id: string;
  name: string;
  description: {
    header: {
      material: string;
      style: string;
      responsible: string;
      features: string;
      image: string;
    };
    body: {
      content: string;
    };
  };
  price: {
    price: number;
    originalPrice: number;
    discountQuantity: number;
    currency: string;
    original?: number;
    discount?: number;
  };
  comment: any[];
  category: {
    id: string;
    name: string;
    slug: string;
    parent: {
      id: string;
      name: string;
      slug: string;
    };
  };
  variants: Variant[];
  tagIsNew: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
}

function PageProductDetail({}) {
  const dispatch = useDispatch();
  const [activeSize, setActiveSize] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGiftInfo, setShowGiftInfo] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [outOfStock, setOutOfStock] = useState<boolean>(false);
  const params = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await productGetBySlug(params.slug as string);
        
        if (result?.data?.product) {
          const productData = result.data.product;

          // Log dữ liệu sản phẩm để debug
          console.log("Product data:", productData);
          console.log("Product price:", productData.price);

          setProduct(productData);

          // Set default variant and color from the first variant
          if (productData.variants && productData.variants.length > 0) {
            const firstVariant = productData.variants[0];
            setSelectedVariant(firstVariant);
            setActiveColor(firstVariant.name);
            setProductImages(firstVariant.images || []);

            // Set default size from the first variant's first size
            if (firstVariant.sizes && firstVariant.sizes.length > 0) {
              setActiveSize(firstVariant.sizes[0].size);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  // Update images when color changes
  useEffect(() => {
    if (product?.variants) {
      const variant = product.variants.find((v) => v.name === activeColor);
      if (variant) {
        setSelectedVariant(variant);
        setProductImages(variant.images || []);
        setCurrentImageIndex(0); // Reset to first image when color changes
      }
    }
  }, [activeColor, product]);

  // Check stock when size or color changes
  useEffect(() => {
    if (selectedVariant && activeSize) {
      const sizeInfo = selectedVariant.sizes.find(
        (size) => size.size === activeSize
      );
      const stock = sizeInfo?.stock || 0;
      setCurrentStock(stock);
      setOutOfStock(stock <= 0);

      // If current quantity is more than available stock, adjust it
      if (stock > 0 && typeof quantity === "number" && quantity > stock) {
        setQuantity(stock);
      }
    }
  }, [selectedVariant, activeSize, quantity]);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      const currentValue =
        typeof prev === "string" ? parseInt(prev) || 1 : prev;
      // Don't allow increasing beyond available stock
      if (currentStock > 0 && currentValue >= currentStock) {
        return currentStock;
      }
      return currentValue + 1;
    });
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      const currentValue =
        typeof prev === "string" ? parseInt(prev) || 1 : prev;
      return currentValue > 1 ? currentValue - 1 : 1;
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0) {
        // Cap the quantity at the available stock
        if (currentStock > 0 && numValue > currentStock) {
          setQuantity(currentStock);
        } else {
          setQuantity(numValue);
        }
      }
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleGiftInfo = () => {
    setShowGiftInfo(!showGiftInfo);
  };

  const handleColorSelect = (colorName: string) => {
    setActiveColor(colorName);

    // Reset size if current size is not available in new color variant
    const newVariant = product?.variants.find((v) => v.name === colorName);
    if (newVariant) {
      setSelectedVariant(newVariant);

      // Verificar si el tamaño seleccionado está disponible en el nuevo color
      const sizeExists = newVariant.sizes.some((s) => s.size === activeSize);

      // Si el tamaño no existe en el nuevo color, seleccionar el primer tamaño disponible
      if (!sizeExists && newVariant.sizes.length > 0) {
        setActiveSize(newVariant.sizes[0].size);

        // Actualizar información de stock para el primer tamaño
        const firstSizeStock = newVariant.sizes[0].stock || 0;
        setCurrentStock(firstSizeStock);
        setOutOfStock(firstSizeStock <= 0);
      }
      // Si el tamaño existe, actualizar su información de stock
      else if (sizeExists) {
        const sizeInfo = newVariant.sizes.find((s) => s.size === activeSize);
        const stock = sizeInfo?.stock || 0;
        setCurrentStock(stock);
        setOutOfStock(stock <= 0);
      }
    }
  };

  const calculateDiscount = () => {
    if (!product || !product.price) return 0;

    // Ưu tiên sử dụng giá từ các trường chuẩn trong interface
    const originalPrice =
      product.price.originalPrice || product.price.original || 0;
    const currentPrice = product.price.price || product.price.discount || 0;

    if (originalPrice > currentPrice && originalPrice > 0) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    return 0;
  };

  // Cập nhật lại hàm formatPrice và calculateDiscount cho phù hợp với interface
  const formatPrice = (priceValue: number | undefined): string => {
    if (priceValue === undefined || priceValue === null) return "0";
    return priceValue.toLocaleString("vi-VN");
  };

  const handleAddToCart = async () => {
    try {
      if (!activeSize) {
        toast.error("Vui lòng chọn kích thước");
        return;
      }

      if (!activeColor) {
        toast.error("Vui lòng chọn màu sắc");
        return;
      }

      if (!product) {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        return;
      }

      // Verify stock before adding to cart
      if (outOfStock || currentStock <= 0) {
        toast.error("Sản phẩm đã hết hàng");
        return;
      }

      const numQuantity =
        typeof quantity === "string" ? parseInt(quantity) : quantity;

      const cartData = {
        _id: product.id,
        quantityAddToCart: numQuantity,
        selectedColor: activeColor,
        selectedSize: activeSize,
      };

      // Call API to add to cart
      await addToCart(cartData);

      // Create product object for Redux
      const productForRedux = {
        _id: product.id,
        name: product.name,
        thumb: selectedVariant?.images[0] || "",
        price: {
          original: product.price.originalPrice || product.price.original || 0,
          discount: product.price.price || product.price.discount || 0,
        },
        quantityAddToCart: numQuantity,
        colorOrder: activeColor,
        sizeOrder: activeSize,
        stock: currentStock,
      };

      // Dispatch to Redux store
      dispatch(addProductToCart(productForRedux));

      toast.success("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Lỗi sẽ được xử lý bởi CartServices nếu là lỗi xác thực
      // Chỉ hiển thị thông báo lỗi chung nếu không phải lỗi xác thực
      if (!(error instanceof Error && error.message === "Chưa đăng nhập")) {
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
  };

  if (loading) {
    return <Loading overlay />;
  }

  if (!product) {
    return <div className={cx("error")}>Product not found</div>;
  }

  return (
    <div className={cx("product-detail-wrapper")}>
      <div className={cx("container", "container-product-detail")}>
        <div className={cx("product-detail-container")}>
          <div className={cx("product-detail-grid")}>
            {/* Product Images Section */}
            <div className={cx("product-images-section")}>
              <div className={cx("vertical-gallery")}>
                <div className={cx("thumbnails-column")}>
                  {productImages &&
                    productImages.length > 0 &&
                    productImages.map((image, index) =>
                      image ? (
                        <div
                          key={index}
                          className={cx("thumbnail-item", {
                            active: index === currentImageIndex,
                          })}
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className={cx("thumbnail-image")}
                          />
                        </div>
                      ) : null
                    )}
                </div>

                <div className={cx("main-image-wrapper")}>
                  <div className={cx("main-image-container")}>
                    {/* {product.tagIsNew && (
                      <div className={cx("new-tag")}>NEW</div>
                    )} */}
                    {productImages && 
                    productImages.length > 0 &&
                    productImages[currentImageIndex] ? (
                      <img
                        src={productImages[currentImageIndex]}
                        alt={product.name}
                        className={cx("product-image")}
                      />
                    ) : (
                      <div className={cx("no-image")}>Không có hình ảnh</div>
                    )}
                  </div>

                  {product.price?.discountQuantity > 0 && (
                    <div className={cx("birthday-promotion")}>
                      <img
                        src="https://media3.coolmate.me/cdn-cgi/image/width=713,height=1050,quality=85,format=auto/uploads/March2025/Footer_-_Mua_3_giam_10_1_(1).jpg"
                        alt={`Mua ${product.price.discountQuantity} giảm thêm 10%`}
                        className={cx("promotion-image")}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className={cx("product-info-section")}>
              <h1 className={cx("product-title")}>{product.name}</h1>

              <div className={cx("product-rating")}>
                <div className={cx("stars")}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={cx("star", {
                        filled: i < 5, // Default rating
                      })}
                    />
                  ))}
                  <span className={cx("rating-count")}>
                    ({product.comment?.length})
                  </span>
                </div>
                <div className={cx("share-btn")}>
                  <BiShare />
                  <span>Chia sẻ</span>
                </div>
              </div>

              {product?.price?.discount > 0 && (
                <div className={cx("price-section")}>
                  <span className={cx("original-price")}>
                    {product?.price
                      ? formatPrice(
                          product.price.originalPrice || product.price.original
                        )
                      : "0"}
                    đ
                  </span>
                  <div className={cx("price-container")}>
                    <div className={cx("prices")}>
                      <span className={cx("current-price")}>
                        {product?.price
                          ? formatPrice(
                              product.price.price || product.price.discount
                            )
                          : "0"}
                        đ
                      </span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className={cx("discount-tag")}>
                        -{calculateDiscount()}%
                      </div>
                    )}
                  </div>
                </div>
              )}

              {product?.price?.discount === 0 && (
                <div className={cx("price-section")}>
                  <div className={cx("price-container")}>
                    <div className={cx("prices")}>
                      <span className={cx("current-price")}>
                        {product?.price
                          ? formatPrice(
                              product.price.original || product.price.original
                            )
                          : "0"}
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className={cx("promotion-shipping")}>
                <Image
                  src={"https://www.coolmate.me/images/icons/icon4.svg"}
                  alt="Shipping"
                  width={20}
                  height={20}
                />
                <span>Freeship đơn trên 200K</span>
              </div>

              {product.price?.discountQuantity > 0 && (
                <div className={cx("promotions-section")}>
                  <div className={cx("promotion-item")}>
                    <div className={cx("promotion-badge")}>
                      Mua 2 được giảm thêm 10%
                    </div>
                  </div>
                </div>
              )}

              <div className={cx("product-options")}>
                <div className={cx("option-section")}>
                  <h3 className={cx("option-title")}>
                    Màu sắc: <span>{activeColor}</span>
                  </h3>
                  <div className={cx("color-options")}>
                    {product.variants &&
                      product.variants.map((variant) => {
                        return variant.colorThumbnail ? (
                          <Image
                            src={variant.colorThumbnail}
                            alt={variant.name || "Màu sắc"}
                            width={20}
                            height={20}
                            className={cx("color-option", {
                              active: variant.name === activeColor,
                            })}
                            title={variant.name}
                            key={variant.name || variant.color}
                            onClick={() => handleColorSelect(variant.name)}
                          />
                        ) : null;
                      })}
                  </div>
                </div>

                <div className={cx("option-section")}>
                  <div className={cx("size-header")}>
                    <h3 className={cx("option-title")}>
                      Kích thước: <span>{activeSize}</span>
                    </h3>
                    <a href="#" className={cx("size-guide")}>
                      Hướng dẫn chọn size
                    </a>
                  </div>
                  <div className={cx("size-options")}>
                    {selectedVariant?.sizes.map((sizeObj) => {
                      const isSizeOutOfStock = sizeObj.stock <= 0;
                      const isLowStock = sizeObj.stock > 0 && sizeObj.stock <= 3;
                      
                      return (
                        <button
                          key={sizeObj._id}
                          className={cx("size-option", {
                            active: sizeObj.size === activeSize,
                            "out-of-stock": isSizeOutOfStock,
                            "low-stock": isLowStock,
                          })}
                          onClick={() => {
                            if (!isSizeOutOfStock) {
                              setActiveSize(sizeObj.size);
                            } else {
                              toast.error(`Size ${sizeObj.size} đã hết hàng`);
                            }
                          }}
                          aria-disabled={isSizeOutOfStock}
                          title={
                            isSizeOutOfStock
                              ? "Hết hàng"
                              : isLowStock
                              ? `Chỉ còn ${sizeObj.stock} sản phẩm`
                              : `Size ${sizeObj.size}`
                          }
                        >
                          {sizeObj.size}
                          {isSizeOutOfStock && (
                            <>
                              <span className={cx("out-of-stock-label")}>
                                Hết hàng
                              </span>
                              <span className={cx("size-tooltip")}>
                                Size này hiện đã hết hàng
                              </span>
                            </>
                          )}
                          {isLowStock && (
                            <>
                              <span className={cx("low-stock-label")}>
                                {sizeObj.stock}
                              </span>
                              <span className={cx("size-tooltip")}>
                                Chỉ còn {sizeObj.stock} sản phẩm
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={cx("quantity-and-cart-section")}>
                <div className={cx("product-actions")}>
                  {outOfStock ? (
                    <button
                      className={cx("buy-now-btn", "disabled")}
                      disabled
                      style={{
                        backgroundColor: "#ccc",
                        cursor: "not-allowed",
                      }}
                    >
                      <span>Hết hàng</span>
                    </button>
                  ) : (
                    <button
                      className={cx("buy-now-btn")}
                      onClick={handleAddToCart}
                    >
                      <div className={cx("quantity-control")}>
                        <div
                          className={cx("quantity-btn", "decrease")}
                          onClick={handleDecreaseQuantity}
                        >
                          <FiMinus />
                        </div>
                        <input
                          type="number"
                          className={cx("quantity-value")}
                          value={quantity}
                          onChange={handleQuantityChange}
                          onBlur={() => {
                            if (
                              quantity === "" ||
                              quantity === 0 ||
                              quantity === "0"
                            ) {
                              setQuantity(1);
                            }
                          }}
                          min="1"
                          max={currentStock}
                        />
                        <div
                          className={cx("quantity-btn", "increase")}
                          onClick={handleIncreaseQuantity}
                        >
                          <FiPlus />
                        </div>
                      </div>
                      <FiShoppingCart />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                  )}
                </div>
                {currentStock > 0 && currentStock < 5 && (
                  <div
                    className={cx("stock-warning")}
                    style={{
                      color: "red",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    Chỉ còn {currentStock} sản phẩm
                  </div>
                )}
              </div>

              <div className={cx("product-description-tab")}>
                <button className={cx("tab-button", "active")}>
                  Mô tả sản phẩm
                </button>
              </div>

              <div className={cx("customer-benefits")}>
                <div className={cx("coolcash-benefit")}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8021 0.0161133H3.19787C1.43133 0.0161133 0 1.44212 0 3.20866V12.7916C0 14.5529 1.43133 15.9842 3.19787 15.9842H12.8021C14.5687 15.9842 16 14.5582 16 12.7916V3.20866C15.9947 1.44212 14.5687 0.0161133 12.8021 0.0161133ZM14.9305 12.7863C14.9305 13.9569 13.9727 14.9147 12.8021 14.9147H3.19787C2.02195 14.9147 1.0695 13.9622 1.0695 12.7863V3.20334C1.0695 2.03274 2.02727 1.07498 3.19787 1.07498H12.8021C13.9781 1.07498 14.9305 2.02742 14.9305 3.20334V12.7863Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M8.53963 4.74634H7.39032H7.37967C7.37435 5.72007 6.84758 6.32133 6.00156 6.32133C5.15553 6.32133 4.62876 5.72007 4.62344 4.74634H3.47412C3.47412 6.30537 4.44253 7.43872 6.00156 7.43872C6.8529 7.43872 7.52866 7.1035 7.9703 6.54481C8.32148 6.1035 8.51835 5.52851 8.53963 4.86872C8.53963 4.82615 8.53963 4.78891 8.53963 4.74634Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M11.3595 4.74634C11.3542 5.72007 10.7955 6.32133 9.94945 6.32133C9.13535 6.32133 8.59261 5.76795 8.5394 4.86872C8.5394 4.83147 8.53408 4.78891 8.53408 4.74634H7.38477C7.38477 5.45402 7.59228 6.07657 7.96474 6.54481C8.4117 7.1035 9.09278 7.43872 9.94413 7.43872C11.5032 7.43872 12.5195 6.30537 12.5195 4.74634H11.3595Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M4.62344 4.74634H3.47412C3.47412 4.75698 3.6976 10.1151 3.6976 10.1205H4.84691C4.84691 10.1098 4.62344 4.75698 4.62344 4.74634Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M11.3748 4.74634H12.5242C12.5242 4.75698 12.3007 10.1151 12.3007 10.1205H11.1514C11.1514 10.1098 11.3748 4.75698 11.3748 4.74634Z"
                      fill="#2F5ACF"
                    ></path>
                    <path
                      d="M12.3075 10.1206H3.69824V11.2433H12.3075V10.1206Z"
                      fill="#2F5ACF"
                    ></path>
                  </svg>
                  <span>Được hoàn lên đến 10% CoolCash.</span>
                  <button className={cx("detail-btn")}>
                    Chi tiết
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#444"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                </div>

                <div className={cx("zalo-chat")}>
                  <img
                    src="https://page.widget.zalo.me/static/images/2.0/Logo.svg"
                    alt="Zalo"
                  />
                  <span>
                    Chat để được Coolmate tư vấn ngay (8:30 - 22:00)
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12H19"
                        stroke="#444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M12 5L19 12L12 19"
                        stroke="#444"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>
                </div>

                <div className={cx("service-benefits")}>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/return.svg"
                      alt="Đổi trả"
                    />
                    <span>Đổi trả cực dễ chỉ cần số điện thoại</span>
                  </div>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/return-60.svg"
                      alt="60 ngày đổi trả"
                    />
                    <span>
                      60 ngày đổi trả (sản phẩm chưa qua sử dụng, nguyên nhãn
                      mác)
                    </span>
                  </div>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/phone.svg"
                      alt="Hotline"
                    />
                    <span>
                      Hotline 1900.27.27.37 hỗ trợ từ 8h30 - 22h mỗi ngày
                    </span>
                  </div>
                  <div className={cx("benefit-item")}>
                    <img
                      src="https://www.coolmate.me/images/product-detail/location.svg"
                      alt="Địa điểm"
                    />
                    <span>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductDescription dataDescription={product.description} />
      <ProductPreviewFabric />
    </div>
  );
}

export default PageProductDetail;
