import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import "../../styles/GobalStyles.scss";
import '@ant-design/v5-patch-for-react-19';

import { Metadata, Viewport } from "next/types";
import Header from "@/Layout/User/Header";
import Footer from "@/Layout/User/Footer";
import { Toaster } from "react-hot-toast";
import ProviderRedux from "@/redux/ProviderRedux";
// import { poppins } from '@/assets/FontNext';

// const poppinsFont = poppins;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vn" suppressHydrationWarning={true}>
      <head></head>
      <body data-instant-intensity="viewport">
        <ProviderRedux>
          <Header />

          <main className="main-content">{children}</main>
          <Footer />

          {/* Toast notification container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#22c55e",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />
        </ProviderRedux>

        {/* <ProviderRedux> */}
        {/* <GoogleOAuthProvider clientId={clientId || ''}> */}
        {/* <AnouBar /> */}
        {/* <Header /> */}
        {/* <ProgressBarUser>{children}</ProgressBarUser> */}
        {/* <ViewSpecification /> */}
        {/* <FooterLogo /> */}
        {/* <Footer /> */}
        {/* <Chat /> */}
        {/* </GoogleOAuthProvider> */}
        {/* </ProviderRedux> */}
      </body>
    </html>
  );
}
