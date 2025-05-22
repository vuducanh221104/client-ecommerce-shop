"use client";
import { useState, useEffect } from "react";
import Banner from "@/components/Banner";
import CatalogSilder from "@/components/CatalogSilder";
import CategoryBanner from "@/Layout/components/CategoryBanner";
import BannerIntroduce from "@/Layout/components/BannerIntroduce";
import ProductList from "@/Layout/components/ProductList";
import BannerIntroduceNor from "@/Layout/components/BannerIntroduceNor";
import BannerPrivilege from "@/Layout/components/BannerPrivilege";
import Loading from "@/components/Loading";

function PageHome() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading page />;
  }

  return (
    <>
      <Banner />
      <div className="container">
        <CatalogSilder />
      </div>
      <CategoryBanner />

      <div className="container">
        <ProductList
          title="ĐỒ NAM"
          linkToViewAll="/category/nam"
          viewAllText="Xem Tất Cả"
          categorySlug="nam"
          limit={12}
        />
      </div>
      <BannerIntroduce
        imageUrl="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Mac_hang_ngay_-_Homepage_-_Desktop.jpg"
        title="MẶC HẰNG NGÀY"
        desc="Giá tốt nhất - Mua 3 giảm thêm 10% - Quà tặng sinh nhật"
        textBtn="KHÁM PHÁ NGAY"
        linkUrl="/category/ao-thun-nam"
        showBadge={true}
      />
      <div className="container">
        <ProductList
          title="ĐỒ NỮ"
          linkToViewAll="/category/nu"
          viewAllText="Xem Tất Cả"
          categorySlug="nu"
          limit={12}
        />
      </div>
      <BannerIntroduce
        imageUrl="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Do_chay_bo_-_Homepage_-_Desktop.jpg"
        title="CHƯƠNG TRÌNH SALE "
        desc="Giá tốt nhất - Mua 3 giảm thêm 10% - Quà tặng sinh nhật"
        textBtn="KHÁM PHÁ NGAY"
        linkUrl="/category/ao-thun-nu"
        showBadge={true}
      />
      <div className="container">
        <ProductList
          title="ĐỒ THỂ THAO"
          linkToViewAll="/category/the-thao"
          viewAllText="Xem Thêm"
          categorySlug="the-thao"
          limit={12}
        />
      </div>
      <div className="container">
        <BannerIntroduceNor
          imageUrl="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip33.png"
          linkUrl="/category/sale"
          altText="Operation Smile - Góp phần mang lại cuộc sống tươi đẹp hơn cho tuị nhỏ"
          priority={true}
        />
      </div>
      <div className="container">
        <BannerPrivilege />
      </div>
    </>
  );
}

export default PageHome;
