import '@ant-design/v5-patch-for-react-19';

import "@/styles/AdminStyles/GolbalAdmin.scss";
import ProviderRedux from "@/redux/ProviderRedux";
import { Viewport } from "next/types";
import AdminLayout from "@/Layout/AdminLayout";
export const metadata = {
  title: "Admin",
  description: "Admin Page",
  robots: {
    index: false, 
    follow: false, 
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
