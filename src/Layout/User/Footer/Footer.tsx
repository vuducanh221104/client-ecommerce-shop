"use client";
import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import Image from "next/image";
import Link from "next/link";

const cx = classNames.bind(styles);

type FooterSections = {
  coolclub: boolean;
  policies: boolean;
  service: boolean;
  about: boolean;
  contact: boolean;
};

function Footer() {
  const [expandedSections, setExpandedSections] = useState<FooterSections>({
    coolclub: false,
    policies: false,
    service: false,
    about: false,
    contact: false,
  });

  const toggleSection = (section: keyof FooterSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={"container"}>
        <div className={styles["footer-top"]}>
          <div className={styles["footer-intro"]}>
            <h3 className={styles["footer-title"]}>COOLMATE lắng nghe bạn!</h3>
            <p className={styles["footer-text"]}>
              Chúng tôi luôn trân trọng và mong đợi nhận được mọi ý kiến đóng
              góp từ khách hàng để có thể nâng cấp trải nghiệm dịch vụ và sản
              phẩm tốt hơn nữa.
            </p>
            <Link href="#" className={styles["feedback-btn"]}>
              ĐÓNG GÓP Ý KIẾN
              <span className={styles.arrow}>→</span>
            </Link>
          </div>

          <div className={styles["footer-contact"]}>
            <div className={styles["contact-item"]}>
              <div className={styles["contact-icon"]}>
                <Image
                  src="https://www.coolmate.me/images/footer/icon-hotline.svg"
                  alt="Phone"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles["contact-info"]}>
                <span className={styles["contact-label"]}>Hotline</span>
                <span className={styles["contact-value"]}>1900.272737</span>
                <span className={styles["contact-sub"]}>
                  (028) 7777.2737 (8:30 - 22:00)
                </span>
              </div>
            </div>

            <div className={styles["contact-item"]}>
              <div className={styles["contact-icon"]}>
                <Image
                  src="https://www.coolmate.me/images/footer/icon-email.svg"
                  alt="Email"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles["contact-info"]}>
                <span className={styles["contact-label"]}>Email</span>
                <span className={styles["contact-value"]}>
                  Gym@ZenFit.me
                </span>
              </div>
            </div>
          </div>

          <div className={styles["footer-social"]}>
            <a
              href="https://www.facebook.com/coolmate.me"
              className={styles["social-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/icon-facebook.svg"
                alt="Facebook"
                width={40}
                height={40}
                className={styles["social-icon"]}
              />
            </a>
            <a
              href="https://zalo.me"
              className={styles["social-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/icon-zalo.svg"
                alt="Zalo"
                width={40}
                height={40}
                className={styles["social-icon"]}
              />
            </a>
            <a
              href="https://www.tiktok.com/@coolmate.me"
              className={styles["social-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/icon-tiktok.svg"
                alt="TikTok"
                width={40}
                height={40}
                className={styles["social-icon"]}
              />
            </a>
            <a
              href="https://www.instagram.com/coolmate.me"
              className={styles["social-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/icon-instar.svg"
                alt="Instagram"
                width={40}
                height={40}
                className={styles["social-icon"]}
              />
            </a>
            <a
              href="https://www.youtube.com/channel"
              className={styles["social-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/icon-youtube.svg"
                alt="YouTube"
                width={40}
                height={40}
                className={styles["social-icon"]}
              />
            </a>
          </div>
        </div>

        <div className={styles["footer-divider"]}></div>

        {/* Desktop Footer Links */}
        <div className={styles["desktop-links"]}>
          <div className={styles["footer-links-column"]}>
            <h3 className={styles["column-title"]}>ZenClub</h3>
            <ul className={styles["links-list"]}>
              <li>
                <Link href="#">Đăng ký thành viên</Link>
              </li>
              <li>
                <Link href="#">Ưu đãi & Đặc quyền</Link>
              </li>
            </ul>
          </div>

          <div className={styles["footer-links-column"]}>
            <h3 className={styles["column-title"]}>CHÍNH SÁCH</h3>
            <ul className={styles["links-list"]}>
              <li>
                <Link href="#">Chính sách đổi trả 60 ngày</Link>
              </li>
              <li>
                <Link href="#">Chính sách khuyến mãi</Link>
              </li>
              <li>
                <Link href="#">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="#">Chính sách giao hàng</Link>
              </li>
            </ul>
          </div>

          <div className={styles["footer-links-column"]}>
            <h3 className={styles["column-title"]}>CHĂM SÓC KHÁCH HÀNG</h3>
            <ul className={styles["links-list"]}>
              <li>
                <Link href="#">Trải nghiệm mua sắm 100% hài lòng</Link>
              </li>
              <li>
                <Link href="#">Hỏi đáp - FAQs</Link>
              </li>
            </ul>

            <h3
              className={`${styles["column-title"]} ${styles["second-title"]}`}
            >
              KIẾN THỨC MẶC ĐẸP
            </h3>
            <ul className={styles["links-list"]}>
              <li>
                <Link href="#">Hướng dẫn chọn size</Link>
              </li>
              <li>
                <Link href="#">Blog</Link>
              </li>
            </ul>
          </div>

          <div className={styles["footer-links-column"]}>
            <h3 className={styles["column-title"]}>VỀ ZENFIT</h3>
            <ul className={styles["links-list"]}>
              <li>
                <Link href="#">Câu chuyện về ZENFIT</Link>
              </li>
              <li>
                <Link href="#">Quá trình phát triển</Link>
              </li>
              <li>
                <Link href="#">Nhà máy & Quy trình sản xuất</Link>
              </li>
              <li>
                <Link href="#">Quy trình hoạt động</Link>
              </li>
              <li>
                <Link href="#">ZENFIT trên báo chí</Link>
              </li>
            </ul>
          </div>

          <div className={styles["footer-links-column"]}>
            <h3 className={styles["column-title"]}>ĐỊA CHỈ LIÊN HỆ</h3>
            <ul className={`${styles["links-list"]} ${styles["address-list"]}`}>
              <li>
                <Link href="#">
                  Văn phòng Hà Nội: Tầng 3-4, Tòa nhà BMM, KM2, Đường Phùng
                  Hưng, Phường Phúc La, Quận Hà Đông, TP Hà Nội
                </Link>
              </li>
              <li>
                <Link href="#">
                  Văn phòng Hồ Chí Minh: Lầu 1, Số 163 Trần Trọng Cung, Phường
                  Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh
                </Link>
              </li>
              <li>
                <Link href="#">
                  Văn phòng Hồ Chí Minh: Lầu 1, Số 163 Trần Trọng Cung, Phường
                  Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh
                </Link>
              </li>
              <li>
                <Link href="#">
                  Trung tâm vận hành: 03 Tăng Nhơn Phú, Phước Long B, Quận 9
                  (Tp. Thủ Đức), Tp. Hồ Chí Minh
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordion Footer */}
        <div className={styles["footer-links-mobile"]}>
          <div
            className={`${styles["accordion-item"]} ${
              expandedSections.coolclub ? styles.active : ""
            }`}
          >
            <div
              className={styles["accordion-header"]}
              onClick={() => toggleSection("coolclub")}
            >
              <h3 className={styles["column-title"]}>COOLCLUB</h3>
              <span className={styles["toggle-icon"]}>+</span>
            </div>
            <div className={styles["accordion-content"]}>
              <ul className={styles["links-list"]}>
                <li>
                  <Link href="#">Đăng ký thành viên</Link>
                </li>
                <li>
                  <Link href="#">Ưu đãi & Đặc quyền</Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`${styles["accordion-item"]} ${
              expandedSections.policies ? styles.active : ""
            }`}
          >
            <div
              className={styles["accordion-header"]}
              onClick={() => toggleSection("policies")}
            >
              <h3 className={styles["column-title"]}>CHÍNH SÁCH</h3>
              <span className={styles["toggle-icon"]}>+</span>
            </div>
            <div className={styles["accordion-content"]}>
              <ul className={styles["links-list"]}>
                <li>
                  <Link href="#">Chính sách đổi trả 60 ngày</Link>
                </li>
                <li>
                  <Link href="#">Chính sách khuyến mãi</Link>
                </li>
                <li>
                  <Link href="#">Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link href="#">Chính sách giao hàng</Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`${styles["accordion-item"]} ${
              expandedSections.service ? styles.active : ""
            }`}
          >
            <div
              className={styles["accordion-header"]}
              onClick={() => toggleSection("service")}
            >
              <h3 className={styles["column-title"]}>
                CHĂM SÓC KHÁCH HÀNG & KIẾN THỨC MẶC ĐẸP
              </h3>
              <span className={styles["toggle-icon"]}>+</span>
            </div>
            <div className={styles["accordion-content"]}>
              <ul className={styles["links-list"]}>
                <li>
                  <Link href="#">Trải nghiệm mua sắm 100% hài lòng</Link>
                </li>
                <li>
                  <Link href="#">Hỏi đáp - FAQs</Link>
                </li>
                <li>
                  <Link href="#">Hướng dẫn chọn size</Link>
                </li>
                <li>
                  <Link href="#">Blog</Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`${styles["accordion-item"]} ${
              expandedSections.about ? styles.active : ""
            }`}
          >
            <div
              className={styles["accordion-header"]}
              onClick={() => toggleSection("about")}
            >
              <h3 className={styles["column-title"]}>VỀ ZenFit</h3>
              <span className={styles["toggle-icon"]}>+</span>
            </div>
            <div className={styles["accordion-content"]}>
              <ul className={styles["links-list"]}>
                <li>
                  <Link href="#">Câu chuyện về ZenFit</Link>
                </li>
                <li>
                  <Link href="#">Quá trình phát triển</Link>
                </li>
                <li>
                  <Link href="#">Nhà máy & Quy trình sản xuất</Link>
                </li>
                <li>
                  <Link href="#">Quy trình hoạt động</Link>
                </li>
                <li>
                  <Link href="#">ZenFit trên báo chí</Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`${styles["accordion-item"]} ${
              expandedSections.contact ? styles.active : ""
            }`}
          >
            <div
              className={styles["accordion-header"]}
              onClick={() => toggleSection("contact")}
            >
              <h3 className={styles["column-title"]}>ĐỊA CHỈ LIÊN HỆ</h3>
              <span className={styles["toggle-icon"]}>+</span>
            </div>
            <div className={styles["accordion-content"]}>
              <ul
                className={`${styles["links-list"]} ${styles["address-list"]}`}
              >
                <li>
                  <Link href="#">
                    Văn phòng Hà Nội: Tầng 3-4, Tòa nhà BMM, KM2, Đường Phùng
                    Hưng, Phường Phúc La, Quận Hà Đông, TP Hà Nội
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    Văn phòng Hồ Chí Minh: Lầu 1, Số 163 Trần Trọng Cung, Phường
                    Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    Văn phòng Hồ Chí Minh: Lầu 1, Số 163 Trần Trọng Cung, Phường
                    Tân Thuận Đông, Quận 7, Tp. Hồ Chí Minh
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    Trung tâm vận hành: 03 Tăng Nhơn Phú, Phước Long B, Quận 9
                    (Tp. Thủ Đức), Tp. Hồ Chí Minh
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles["footer-bottom"]}>
          <div className={styles["company-info"]}>
            <div className={styles.copyright}>© 2024 ZenFit</div>
            <div className={styles.registration}>
              Công ty TNHH FASTECH ASIA
              <br />
              Mã số doanh nghiệp: 0108617038. Giấy chứng nhận đăng ký doanh
              nghiệp do Sở Kế hoạch và Đầu tư TP Hà Nội cấp lần đầu ngày
              20/02/2019.
            </div>
          </div>
          <div className={styles.certificates}>
            <a
              href="#"
              className={styles["cert-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2022/handle_cert.png"
                alt="Certification"
                width={88}
                height={40}
              />
            </a>
            <a
              href="#"
              className={styles["cert-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2022/dmca_protected_15_120.png"
                alt="DMCA Protected"
                width={88}
                height={40}
              />
            </a>
            <a
              href="#"
              className={styles["cert-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/Coolmate-info.png"
                alt="BCT"
                width={39}
                height={40}
              />
            </a>
            <a
              href="#"
              className={styles["cert-link"]}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://www.coolmate.me/images/footer/logoSaleNoti.png"
                alt="Verified"
                width={88}
                height={40}
              />
            </a>
          </div>
        </div>
      </div>

      <div className={styles["back-to-top"]}>
        <a
          href="#"
          className={styles["back-top-link"]}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.33337L8 12.6667"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.33301 8.00004L7.99967 3.33337L12.6663 8.00004"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
