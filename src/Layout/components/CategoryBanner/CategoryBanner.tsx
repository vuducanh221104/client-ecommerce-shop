"use client";
import React from "react";
import classNames from "classnames/bind";
import styles from "./CategoryBanner.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

// Data mẫu cho category banners
const categoryBanners = [
  {
    id: 1,
    title: "MEN WEAR COLLECTION",
    subtitle: "Nhập SNCM50 Giảm 50k đơn từ 460k",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=888,height=600,quality=80,format=auto/uploads/March2025/Section_Banner_888x600.jpg",
    cta: "MUA NGAY",
    link: "/collections/men",
    badge: "",
  },
  {
    id: 2,
    title: "WOMEN ACTIVE COLLECTION",
    subtitle: "Tặng Áo Bra khi mua quần Legging",
    image:
      "https://media3.coolmate.me/cdn-cgi/image/width=888,height=600,quality=80,format=auto/uploads/March2025/Active_women_1.jpg",
    cta: "MUA NGAY",
    link: "/collections/women",
    badge: "CHÍNH THỨC RA MẮT",
  },
];

function CategoryBanner() {
  return (
    <div className={cx("category-banner-section")}>
      <div className={cx("category-banner-container")}>
        <div className={cx("category-banner-grid")}>
          {categoryBanners.map((banner) => (
            <div key={banner.id} className={cx("category-banner-item")}>
              <Link href={banner.link} className={cx("category-banner-link")}>
                <div className={cx("category-banner-image-container")}>
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    width={888}
                    height={600}
                    className={cx("category-banner-image")}
                  />
                  <div className={cx("category-banner-content")}>
                    {banner.badge && (
                      <div className={cx("category-banner-badge")}>
                        {banner.badge}
                      </div>
                    )}
                    <h2 className={cx("category-banner-title")}>
                      {banner.title}
                    </h2>
                    <p className={cx("category-banner-subtitle")}>
                      {banner.subtitle}
                    </p>
                    <button className={cx("category-banner-button")}>
                      {banner.cta}
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryBanner;
