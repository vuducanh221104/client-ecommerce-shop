"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./MegaMenu.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

// Define the category data structure
export interface CategoryLink {
  name: string;
  href: string;
}

export interface Category {
  title: string;
  href: string;
  links: CategoryLink[];
}

export interface PromoItem {
  title: string;
  href: string;
  imageUrl: string;
}

export interface TabItem {
  id: string;
  name: string;
}

// Arrow icon component
export const ArrowIcon = () => (
  <svg
    width="14"
    height="10"
    viewBox="0 0 14 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5H13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 1L13 5L9 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Fix type issues with tabs, categoriesData, and promoItems
export type MenuType = "men" | "women" | "sports" | "birthday";

// Define tabs for each menu category
const tabs: Record<MenuType, TabItem[]> = {
  men: [
    { id: "theo-nhu-cau", name: "THEO NHU CẦU" },
    { id: "do-lot", name: "ĐỒ LÓT" },
    { id: "do-the-thao", name: "ĐỒ THỂ THAO" },
    { id: "mac-hang-ngay", name: "MẶC HÀNG NGÀY" },
  ],
  women: [
    { id: "theo-nhu-cau", name: "THEO NHU CẦU" },
    { id: "do-the-thao", name: "ĐỒ THỂ THAO" },
    { id: "mac-hang-ngay", name: "MẶC HÀNG NGÀY" },
  ],
  sports: [
    { id: "the-thao", name: "THỂ THAO" },
    { id: "chay-bo", name: "CHẠY BỘ" },
    { id: "gym", name: "GYM" },
    { id: "yoga", name: "YOGA" },
  ],
  birthday: [
    { id: "theo-nhu-cau", name: "THEO NHU CẦU" },
    { id: "sale", name: "KHUYẾN MÃI" },
    { id: "qua-tang", name: "QUÀ TẶNG" },
  ],
};

// Define the categories data
export const categoriesData: Record<MenuType, Category[]> = {
  men: [
    {
      title: "TẤT CẢ SẢN PHẨM",
      href: "/category/all",
      links: [

      ],
    },
    {
      title: "ÁO NAM",
      href: "/category/ao-nam",
      links: [
        { name: "Áo Tanktop", href: "/category/ao-tanktop" },
        { name: "Áo Thun", href: "/category/ao-thun-nam" },
        { name: "Áo Thể Thao", href: "/category/ao-the-thao" },
        { name: "Áo Polo", href: "/category/ao-polo" },

      ],
    },
    {
      title: "QUẦN NAM",
      href: "/category/quan-nam",
      links: [
        { name: "Quần Short", href: "/category/quan-short" },
        { name: "Quần Thể Thao", href: "/category/quan-the-thao" },
        { name: "Quần Jean", href: "/category/quan-jean" },
        { name: "Quần Bơi", href: "/category/quan-boi" },
      ],
    },
    {
      title: "QUẦN LÓT NAM",
      href: "/category/quan-lot-nam",
      links: [
        { name: "Brief(Tam giác)", href: "/category/brief" },
        { name: "Trunk(Boxer)", href: "/category/trunk" },

      ],
    },
    {
      title: "PHỤ KIỆN",
      href: "/category/phu-kien-nam",
      links: [
        { name: "Tất cả phụ kiện", href: "/category/phu-kien-nam" },
        { name: "(Tất, mũ, túi...)", href: "/category/tat-mu-tui-nam" },
      ],
    },
  ],
  women: [
    {
      title: "TẤT CẢ SẢN PHẨM",
      href: "/category/nu",
      links: [
      ],
    },
    {
      title: "ÁO NỮ",
      href: "/category/ao-nu",
      links: [
        { name: "Áo Sport Bra", href: "/category/ao-sport-bra" },
        { name: "Áo Croptop", href: "/category/ao-croptop" },
        { name: "Áo Thun", href: "/category/ao-thun-nu" },
      ],
    },
    {
      title: "QUẦN NỮ",
      href: "/category/quan-nu",
      links: [
        { name: "Quần Legging", href: "/category/quan-legging" },
        { name: "Quần Shorts", href: "/category/quan-shorts-nu" },
      ],
    },
    {
      title: "PHỤ KIỆN",
      href: "/category/phu-kien-nu",
      links: [
        { name: "Tất cả phụ kiện", href: "/category/phu-kien-nu" },
        { name: "(Tất, mũ, túi...)", href: "/category/tat-mu-tui-nu" },
      ],
    },

  ],
  sports: [
    {
      title: "Thể thao Nam",
      href: "/category/the-thao-nam",
      links: [
        {name: "Thể Thao Chung ", href: "/category/the-thao-chung"},
        {name: "Tập Gym ", href: "/category/tap-gym"},
      ],
    },
    {
      title: "Thể thao Nữ",
      href: "/category/the-thao-nu",
      links: [
        {name: "Chạy Bộ", href: "/category/chay-bo"},
      ],
    },
   
  ],
  birthday: [
    {
      title: "BIRTHDAY SALE",
      href: "/category/birthday",
      links: [
        { name: "Flash Sale", href: "/category/flash-sale" },
        { name: "Giảm giá đặc biệt", href: "/category/special-sale" },
        { name: "Quà tặng sinh nhật", href: "/category/birthday-gifts" },
        { name: "Combo ưu đãi", href: "/category/combo-deals" },
      ],
    },
    {
      title: "SIÊU ƯU ĐÃI",
      href: "/category/super-deals",
      links: [
        { name: "Mua 1 tặng 1", href: "/category/buy-one-get-one" },
        { name: "Giảm 50%+", href: "/category/half-price" },
        { name: "Đồng giá", href: "/category/same-price" },
      ],
    },
    {
      title: "BỘ SƯU TẬP ĐẶC BIỆT",
      href: "/category/special",
      links: [
        { name: "BST Sinh nhật", href: "/category/birthday-collection" },
        { name: "Limited Edition", href: "/category/limited-edition" },
      ],
    },
  ],
};

// Define the promotional items
export const promoItems: Record<MenuType, PromoItem[]> = {
  men: [
    {
      title: "Áo Sơ Mi Dài Tay Essentials Cotton",
      href: "/category/ao-so-mi",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip24.png",
    },
    {
      title: "Quần Jeans Nam siêu nhẹ",
      href: "/category/quan-jean",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip23.png",
    },
  ],
  women: [
    {
      title: "Áo Sport Bra Comfort",
      href: "/category/ao-sport-bra",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip30.png",
    },
    {
      title: "Quần Legging Nữ cao cấp",
      href: "/category/quan-legging",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip29.png",
    },
  ],
  sports: [
    {
      title: "Bộ sưu tập chạy bộ mới nhất",
      href: "/category/chay-bo",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip31_7.jpg",
    },
    {
      title: "Phụ kiện thể thao chính hãng",
      href: "/category/phu-kien-the-thao",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip1_41.jpg",
    },
  ],
  birthday: [
    {
      title: "Chào mừng sinh nhật 6 tuổi!",
      href: "/category/birthday",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/birthday.jpg",
    },
    {
      title: "Flash Sale đồng giá chỉ từ 99k",
      href: "/category/flash-sale",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/flashsale.jpg",
    },
  ],
};

interface MegaMenuProps {
  type: MenuType;
}

function MegaMenu({ type = "men" }: MegaMenuProps) {
  const [activeTab, setActiveTab] = useState(
    tabs[type]?.[0]?.id || "theo-nhu-cau"
  );
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Get the appropriate categories and promo items based on type
  const categories = categoriesData[type] || categoriesData.men;
  const promos = promoItems[type] || promoItems.men;
  const currentTabs = tabs[type] || tabs.men;

  return (
    <div className={cx("mega-menu")}>
      <div className={cx("mega-menu__inner")}>
        <div className={cx("mega-menu__categories-and-promos")}>
          {/* LEFT SIDE - CATEGORIES */}
          <div className={cx("mega-menu__categories")}>
            {categories.map((category, index) => (
              <div
                key={index}
                className={cx("mega-menu__item-category")}
                onMouseEnter={() => setHoveredCategory(category.title)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link href={category.href} className={cx("category-title")}>
                  {category.title}
                  <ArrowIcon />
                </Link>
                <div className={cx("category-links")}>
                  {category.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className={cx("category-link")}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - PROMOTIONAL IMAGES */}
          <div className={cx("mega-menu__promos")}>
            {promos.map((promo, index) => (
              <Link key={index} href={promo.href} className={cx("promo-item")}>
                <Image
                  src={promo.imageUrl}
                  alt={promo.title}
                  width={600}
                  height={300}
                  style={{ borderRadius: "8px" }}
                />
                <div className={cx("promo-title")}>{promo.title}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className={cx("mega-tabs")}>
          {currentTabs.map((tab) => (
            <div
              key={tab.id}
              className={cx("mega-tab", { active: activeTab === tab.id })}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
