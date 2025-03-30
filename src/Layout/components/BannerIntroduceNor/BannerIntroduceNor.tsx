"use client";
import React from "react";
import classNames from "classnames/bind";
import styles from "./BannerIntroduceNor.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

interface BannerIntroduceNorProps {
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  priority?: boolean;
}

function BannerIntroduceNor({
  imageUrl = "https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip33.png",
  linkUrl = "/operation-smile",
  altText = "Operation Smile - Góp phần mang lại cuộc sống tươi đẹp hơn cho tuị nhỏ",
  priority = true,
}: BannerIntroduceNorProps) {
  return (
    <div className={cx("banner-container")}>
      <Link href={linkUrl} className={cx("banner-link")}>
        <Image
          src={imageUrl}
          alt={altText}
          width={1440}
          height={460}
          className={cx("banner-image")}
          priority={priority}
        />
      </Link>
    </div>
  );
}

export default BannerIntroduceNor;
