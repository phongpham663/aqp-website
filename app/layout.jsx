import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "../src/styles.css";
import "../src/home.css";
import "../src/about.css";
import "../src/contact.css";
import "../src/solutions.css";
import "../src/industry-solution.css";
import "../src/oil-gas.css";
import "../src/veolink.css";
import "../src/video-analytics.css";
import "../src/gates-access.css";
import "../src/event-security.css";
import "../src/professional-services.css";
import "../src/construction-security.css";
import "../src/store-analytics.css";
import "../src/factory-intelligence.css";
import "../src/support.css";
import "../src/footer-info.css";
import "../src/products.css";
import "../src/cmms.css";

export const metadata = {
  title: "AQPTech | Hạ tầng vững chắc. Tương lai rộng mở.",
  description: "Giải pháp công nghệ và hạ tầng cho doanh nghiệp.",
  icons: { icon: "/favicon-aqptech.png" },
  openGraph: { type: "website", locale: "vi_VN", siteName: "AQPTech" },
};

export default function RootLayout({ children }) {
  return <html lang="vi"><body><a className="skip-link" href="#main">Đến nội dung chính</a>{children}<noscript><style>{"@media(max-width:760px){.header-inner{flex-wrap:wrap;height:auto!important}.main-nav{display:flex!important;position:static!important;width:100%;max-height:none!important}.menu-toggle,.home-contact-widget{display:none!important}.home-landing-page .site-header{position:static}}"}</style></noscript></body></html>;
}
