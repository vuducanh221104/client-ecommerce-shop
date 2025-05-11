import "./gobals.scss";
import ProviderRedux from "@/redux/ProviderRedux";
import { Viewport } from "next/types";
import AdminLayout from "@/Layout/AdminLayout";
export const metadata = {
  title: "Admin",
  description: "Admin Page",
  robots: {
    index: false, // Ngăn bot lập chỉ mục
    follow: false, // Ngăn bot theo liên kết trên trang
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="mdl-js">
      <body>
        <ProviderRedux>
          <AdminLayout children={children} />
        </ProviderRedux>
      </body>
    </html>
  );
}
