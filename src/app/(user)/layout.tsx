import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/GobalStyles.scss";

import { Metadata, Viewport } from "next/types";
import Header from "@/Layout/User/Header";
import Footer from "@/Layout/User/Footer";
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
        <Header />

        <main className="main-content">{children}</main>
        <Footer />

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
