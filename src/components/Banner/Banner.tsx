"use client";
import classNames from "classnames/bind";
import styles from "./Banner.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

function Banner() {
  return (
    <div className={cx("banner-container")}>
      <div className={cx("banner-wrapper")}>
        <Link href="/category/all" className={cx("banner-link")}>
          <Image
            src="https://media3.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/March2025/Hero_banner_Desktop_-_1920x788.jpg"
            alt="Banner Trang chủ"
            width={1920}
            height={788}
            className={cx("banner-image")}
            priority
          />
        </Link>
      </div>
    </div>
  );
}

export default Banner;
