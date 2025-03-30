import Banner from "@/components/Banner";
import CatalogSilder from "@/components/CatalogSilder";
import CategoryBanner from "@/Layout/components/CategoryBanner";
import BannerIntroduce from "@/Layout/components/BannerIntroduce";
import ProductList from "@/Layout/components/ProductList";
import BannerIntroduceNor from "@/Layout/components/BannerIntroduceNor";
import BannerPrivilege from "@/Layout/components/BannerPrivilege";

function PageHome() {
  return (
    <>
      <main className="main-content">
        <Banner />
        <div className="container">
          <CatalogSilder />
          <CategoryBanner />
          <BannerIntroduce
            imageUrl="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Mac_hang_ngay_-_Homepage_-_Desktop.jpg"
            title="MẶC HẰNG NGÀY"
            desc="Giá tốt nhất - Mua 3 giảm thêm 10% - Quà tặng sinh nhật"
            textBtn="KHÁM PHÁ NGAY"
            linkUrl="/collections/daily-wear"
            showBadge={true}
          />
          <ProductList
            title="SẢN PHẨM MẶC HẰNG NGÀY"
            linkToViewAll="/collections/daily-wear"
            viewAllText="Xem Tất Cả"
          />
          <BannerIntroduce
            imageUrl="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/Do_chay_bo_-_Homepage_-_Desktop.jpg"
            title="ĐỒ CHẠY BỘ"
            desc="Giá tốt nhất - Mua 3 giảm thêm 10% - Quà tặng sinh nhật"
            textBtn="KHÁM PHÁ NGAY"
            linkUrl="/collections/chay-bo"
            showBadge={true}
          />
          <ProductList
            title="SẢN PHẨM CHẠY BỘ"
            linkToViewAll="/collections/chay-bo"
            viewAllText="Xem Thêm"
          />
          <BannerIntroduceNor
            imageUrl="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/March2025/mceclip33.png"
            linkUrl="/operation-smile"
            altText="Operation Smile - Góp phần mang lại cuộc sống tươi đẹp hơn cho tuị nhỏ"
            priority={true}
          />
          <BannerPrivilege />
        </div>
      </main>
    </>
  );
}

export default PageHome;
