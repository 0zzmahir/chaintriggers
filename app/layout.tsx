import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="BKJos81JGfRzlxBICT8SR0h8hjCzBC8DUtSkMuvZABY"
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8097019883190912"
          crossOrigin="anonymous"
        />

        {/* Google Analytics (GA4) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BFNVPPEM9F"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BFNVPPEM9F', {
                anonymize_ip: true
              });
            `,
          }}
        />
      </head>

      <body className="min-h-screen bg-[#0b1220] text-white">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
