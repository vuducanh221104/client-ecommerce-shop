"use client";
import Link from "next/link";
import styles from "./NotFound.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface NotFoundProps {
  title?: string;
  message?: string;
  buttonText?: string;
  buttonHref?: string;
}

function NotFound({
  title = "404",
  message = "Xin lỗi, Trang không tìm thấy!",
  buttonText = "Trở về trang chủ",
  buttonHref = "/",
}: NotFoundProps) {
  return (
    <div className={cx("not-found-container")}>
      <h1 className={cx("not-found-title")}>{title}</h1>
      <p className={cx("not-found-message")}>{message}</p>
      <p className={cx("not-found-description")}>
        Trang bạn đang tìm kiếm đã được xóa hoặc đổi tên hoặc tạm thời không
        công khai.
      </p>
      <Link href={buttonHref} className={cx("not-found-button")}>
        {buttonText}
      </Link>
    </div>
  );
}

export default NotFound;
