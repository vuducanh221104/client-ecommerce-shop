"use client";
import React from "react";
import classNames from "classnames/bind";
import styles from "./BannerIntroduce.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

interface BannerIntroduceProps {
  imageUrl?: string;
  title?: string;
  desc?: string;
  textBtn?: string;
  linkUrl?: string;
  showBadge?: boolean;
}

function BannerIntroduce({
  imageUrl = "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Mac_hang_ngay_-_Homepage_-_Desktop.jpg",
  title = "MẶC HẰNG NGÀY",
  desc = "Giá tốt nhất - Mua 3 giảm thêm 10% - Quà tặng sinh nhật",
  textBtn = "KHÁM PHÁ NGAY",
  linkUrl = "/collections/daily-wear",
  showBadge = true,
}: BannerIntroduceProps) {
  return (
    <div className={cx("banner-introduce-section")}>
      <div className={cx("banner-introduce-container")}>
        <Link href={linkUrl} className={cx("banner-introduce-link")}>
          <div className={cx("banner-introduce-wrapper")}>
            <div className={cx("banner-introduce-content")}>
              <h2 className={cx("banner-introduce-title")}>{title}</h2>
              <p className={cx("banner-introduce-subtitle")}>{desc}</p>
              <button className={cx("banner-introduce-button")}>
                {textBtn} <span className={cx("arrow")}>→</span>
              </button>
            </div>
            <div className={cx("banner-introduce-image-container")}>
              <Image
                src={imageUrl}
                alt={title}
                width={1920}
                height={500}
                className={cx("banner-introduce-image")}
              />
              {showBadge && (
                <div className={cx("banner-introduce-badge")}>
                  <Image
                    src="https://www.coolmate.me/images/header/icon-birthday-v3.svg"
                    alt="The 6th Birthday"
                    width={150}
                    height={60}
                    className={cx("birthday-badge")}
                  />
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default BannerIntroduce;
