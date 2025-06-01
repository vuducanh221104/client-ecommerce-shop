"use client";
import React from "react";
import classNames from "classnames/bind";
import styles from "./BannerPrivilege.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

function BannerPrivilege() {
  return (
    <div className={cx("banner-privilege-container")}>
      <div className={cx("banner-privilege-wrapper")}>
        <div className={cx("privileges-section")}>
          <h2 className={cx("main-title")}>
            ĐẶC QUYỀN DÀNH CHO <span className={cx("highlight")}>368,849</span>{" "}
            THÀNH VIÊN ZENCLUB
          </h2>
          <div className={cx("privilege-cards")}>
            <div className={cx("privilege-card")}>
              <div className={cx("card-content")}>
                <span className={cx("card-title")}>Mời bạn bè</span>
                <span className={cx("card-subtitle")}>
                  hoàn tiền 10% ZenFit
                </span>
              </div>
              <div className={cx("card-icon")}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            <div className={cx("privilege-card")}>
              <div className={cx("card-content")}>
                <span className={cx("card-title")}>Hoàn tiền đến 7%</span>
                <span className={cx("card-subtitle")}>(X2 vào thứ 6)</span>
              </div>
              <div className={cx("card-icon", "card-icon-x2")}>
                <span className={cx("x2-text")}>X2</span>
              </div>
            </div>

            <div className={cx("privilege-card")}>
              <div className={cx("card-content")}>
                <span className={cx("card-title")}>Quà tặng sinh nhật,</span>
                <span className={cx("card-subtitle")}>quà dịp đặc biệt</span>
              </div>
              <div className={cx("card-icon")}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6H17.82C17.93 5.69 18 5.35 18 5C18 3.34 16.66 2 15 2C13.95 2 13.04 2.54 12.5 3.35L12 4.02L11.5 3.34C10.96 2.54 10.05 2 9 2C7.34 2 6 3.34 6 5C6 5.35 6.07 5.69 6.18 6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM15 4C15.55 4 16 4.45 16 5C16 5.55 15.55 6 15 6C14.45 6 14 5.55 14 5C14 4.45 14.45 4 15 4ZM9 4C9.55 4 10 4.45 10 5C10 5.55 9.55 6 9 6C8.45 6 8 5.55 8 5C8 4.45 8.45 4 9 4ZM20 19H4V17H20V19ZM20 14H4V8H9.08L7 10.83L8.62 12L11 8.76L12 7.4L13 8.76L15.38 12L17 10.83L14.92 8H20V14Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={cx("activity-section")}>
          <h2 className={cx("activity-title")}>HOẠT ĐỘNG GẦN ĐÂY</h2>
          <div className={cx("activity-feed")}>
            <div className={cx("activity-item")}>
              <span className={cx("activity-user")}>Đỗ Văn Đoàn</span> vừa được
              cộng{" "}
              <span className={cx("coolcash-amount")}>20.000 ZenFit</span> từ
              ĐH #2xox63
            </div>
            <div className={cx("activity-item")}>
              <span className={cx("activity-user")}>Nguyentrunducl297</span> vừa
              được cộng{" "}
              <span className={cx("coolcash-amount")}>94.000 ZenFit</span> từ
              ĐH #2xox635
            </div>
          </div>
          <Link href="/auth/login" className={cx("join-button")}>
            GIA NHẬP ZENCLUB NGAY <span className={cx("arrow-icon")}>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BannerPrivilege;
