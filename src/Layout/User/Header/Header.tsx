"use client";
import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import Link from "next/link";
import Image from "next/image";
import SearchModal from "@/components/SearchModal";

const cx = classNames.bind(styles);

function Header() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <header className={cx("header-wrapper")}>
      <div className={cx("header-menu")}>
        <div className={cx("header__inner")}>
          <div className={cx("header__toggle")}>
            <div>
              <div className={cx("menu-toggle", "tw-cursor-pointer")}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className={cx("mobile--visible", "tablet--visible")}>
              <div
                className={cx("menu-toggle", "is-active", "tw-cursor-pointer")}
              >
                <div className={cx("menu-toggle__search")}>
                  <Image
                    src="https://www.coolmate.me/images/header/icon-search-new-v2.svg?v=12"
                    alt="Icon Search"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={cx("header__logo", "!tw-h-full")}>
            <Link href="/" className="tw-h-full tw-flex tw-items-center">
              <Image
                src="https://www.coolmate.me/images/logo-coolmate-new-v2.png"
                alt="logo"
                className="tw-h-[50px]"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <div className={cx("mobile--visible", "tablet--visible")}></div>
          <div className={cx("mobile--hidden", "tablet--hidden")}>
            <ul className={cx("nav__sub", "nav__sub-active", "tw-h-full")}>
              <li
                className={cx(
                  "spec-nav",
                  "nav__sub-item",
                  "active-menu",
                  "tw-h-full hover:tw-border-cm-primary-500 hover:tw-border-b-[3px]"
                )}
              >
                <Link
                  href="/"
                  className={cx(
                    "",
                    'tw-relative tw-font-medium tw-text-center"'
                  )}
                >
                  <span className="tw-font-semibold tw-text-cm-primary-500 tw-text-end tw-relative">
                    birthday
                    <span className="tw-text-tiny 2xl:tw-text-small tw-font-normal tw-absolute tw-top-[-80%] tw-right-0">
                      6Th
                    </span>
                  </span>
                </Link>
              </li>
              <li
                className={cx(
                  "nav__sub-item",
                  " active-menu",
                  "tw-h-full hover:tw-border-cm-neutral-900 hover:tw-border-b-[3px]"
                )}
              >
                <Link href="/" className={cx("") + " tw-relative"}>
                  <div>
                    <span className="tw-relative">Nam</span>
                  </div>
                </Link>
              </li>
              <li
                className={cx(
                  "nav__sub-item",
                  "active-menu",
                  "tw-h-full hover:tw-border-cm-neutral-900 hover:tw-border-b-[3px]"
                )}
              >
                <Link href="/" className={cx("", "tw-relative")}>
                  <div>
                    <span className="tw-relative">Nữ</span>
                  </div>
                </Link>
              </li>
              <li
                className={cx(
                  "nav__sub-item",
                  "active-menu",
                  "tw-h-full hover:tw-border-cm-neutral-900 hover:tw-border-b-[3px]"
                )}
              >
                <Link href="/" className={cx("", " tw-relative")}>
                  <div>
                    <span className="tw-relative">Thể Thao</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          <div className={cx("header__actions")}>
            <div
              className={cx(
                "header-actions-search__box",
                "mobile--hidden",
                "tablet--hidden",
                "tw-mr-[10px]"
              )}
            >
              <label className={cx("header-actions-search__field")}>
                <input
                  type="text"
                  id="search-input"
                  placeholder="Tìm kiếm sản phẩm"
                  className={cx("header-actions-search__control", "one-whole")}
                />
                <div
                  className={cx(
                    "header-actions-search__button",
                    " tw-cursor-pointer"
                  )}
                  onClick={handleOpenSearchModal}
                >
                  <svg
                    width="21"
                    height="22"
                    viewBox="0 0 21 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.7994 20.2748L17.8056 17.0594C19.4674 15.0695 20.292 12.5167 20.1068 9.93515C19.9216 7.35361 18.7411 4.94342 16.8121 3.209C14.8831 1.47457 12.3552 0.550359 9.75754 0.629719C7.15985 0.709078 4.69367 1.78585 2.87507 3.63476C1.05648 5.48367 0.0264271 7.9614 0.000501484 10.5494C-0.0254241 13.1374 0.954751 15.6351 2.73594 17.5198C4.51714 19.4045 6.96133 20.53 9.55691 20.661C12.1525 20.7919 14.6983 19.9181 16.6616 18.2223L19.5994 21.3798C19.748 21.5316 19.9504 21.6194 20.1632 21.6247C20.376 21.6301 20.5825 21.5524 20.7386 21.4083C20.8947 21.2641 20.9882 21.065 20.999 20.8532C21.0097 20.6415 20.937 20.4339 20.7963 20.2748H20.7994ZM1.84209 10.8003C1.84209 9.1671 2.32843 7.57056 3.23958 6.21259C4.15073 4.85461 5.44578 3.79621 6.96097 3.1712C8.47616 2.54619 10.1434 2.38263 11.752 2.70126C13.3605 3.01988 14.838 3.80636 15.9977 4.96122C17.1574 6.11608 17.9471 7.58747 18.2671 9.18931C18.587 10.7912 18.4228 12.4515 17.7952 13.9604C17.1676 15.4693 16.1047 16.759 14.7411 17.6664C13.3775 18.5737 11.7743 19.058 10.1342 19.058C7.9356 19.0559 5.82764 18.1852 4.27288 16.637C2.71811 15.0889 1.84349 12.9898 1.84101 10.8003H1.84209Z"
                      fill="#1A1A1A"
                    ></path>
                  </svg>
                </div>
              </label>
            </div>
            <div className={cx("header-actions__button")}>
              <Link href="/cart" className="tw-absolute">
                <Image
                  src="https://www.coolmate.me/images/header/icon-account-new-v2.svg"
                  alt="cart"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
            <div className={cx("header-actions__button")}>
              <Link href="/cart" className="tw-absolute">
                <Image
                  src="https://www.coolmate.me/images/header/icon-cart-new-v2.svg?v=1"
                  alt="cart"
                  width={24}
                  height={24}
                />
              </Link>
              <span className={cx("counts", "site-header__cartcount")}>2</span>
            </div>
          </div>
          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={handleCloseSearchModal}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
