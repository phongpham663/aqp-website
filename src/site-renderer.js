import { escape, icon, logo } from "./html.js";
import { productCard } from "./catalog.js";
import { products, solutions, completedSolutions, services, articles } from "./data.js";
import { home, homeHeader, homeFooter } from "./home.js";
import { aboutPage } from "./about.js";
import { contactPage } from "./contact.js";
import { solutionsPage } from "./solutions.js";
import { seaportsPage } from "./seaports.js";
import { oilGasPage } from "./oil-gas.js";
import { nationalBordersPage } from "./national-borders.js";
import { criticalSitesPage } from "./critical-sites.js";
import { veolinkPage } from "./veolink.js";
import { videoAnalyticsPage } from "./video-analytics.js";
import { gatesAccessPage } from "./gates-access.js";
import { eventSecurityPage } from "./event-security.js";
import { professionalServicesPage } from "./professional-services.js";
import { constructionSecurityPage } from "./construction-security.js";
import { storeAnalyticsPage } from "./store-analytics.js";
import { factoryIntelligencePage } from "./factory-intelligence.js";
import { supportPage } from "./support.js";
import { footerInfo } from "./footer-info.js";
import { productRedirects } from "./route-redirects.js";
import { productsPage } from "./products.js";
import { cmmsPage } from "./cmms.js";

const button = (label, href, style = "primary") =>
  `<a class="button button-${style}" href="${href}">${label}${icon("arrow-up-right")}</a>`;
const eyebrow = (text, number = "") =>
  `<div class="eyebrow">${number ? `<span>${number}</span>` : '<span class="small-square"></span>'}${text}</div>`;
const sectionHeading = (number, tag, title, description = "", action = "") =>
  `<div class="section-heading"><div>${eyebrow(tag, number)}<h2>${title}</h2></div><div class="section-heading-aside">${description ? `<p>${description}</p>` : ""}${action}</div></div>`;

function header(path) {
  const navLink = (href, text) =>
    `<a class="nav-link ${path.startsWith(href) ? "active" : ""}" href="${href}" ${path === href ? 'aria-current="page"' : ""}>${text}</a>`;
  return `<div class="utility-bar"><div class="container"><span><span class="status-dot"></span>Công nghệ đúng. Giá trị thật.</span><a href="/support">${icon("headphones")}Hỗ trợ kỹ thuật${icon("arrow-up-right")}</a></div></div>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="AQPTech - Trang chủ">${logo()}</a><button class="menu-toggle" aria-label="Mở menu điều hướng" aria-controls="main-nav" aria-expanded="false">${icon("menu")}</button>
  <nav id="main-nav" class="main-nav" aria-label="Điều hướng chính">${navLink("/about", "Về AQPTech")}<details class="nav-dropdown"><summary class="nav-link ${path.startsWith("/solutions") ? "active" : ""}">Giải pháp${icon("chevron-down")}</summary><div class="dropdown-panel"><a class="dropdown-heading" href="/solutions">Tất cả giải pháp${icon("arrow-up-right")}</a>${completedSolutions.map((item) => `<a href="/solutions/${item.slug}">${icon(item.icon)}${item.menuName || item.name}${icon("arrow-up-right")}</a>`).join("")}</div></details>${navLink("/products", "Sản phẩm")}${navLink("/services", "Dịch vụ")}${navLink("/insights", "Kiến thức")}<a class="button button-primary nav-cta" href="/contact">Kết nối với chúng tôi${icon("arrow-up-right")}</a></nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-main"><div class="footer-brand"><a class="brand" href="/" aria-label="AQPTech - Trang chủ">${logo()}</a><p>Hạ tầng vững chắc.<br>Tương lai rộng mở.</p><span class="footer-note">Giải pháp công nghệ cho doanh nghiệp.</span></div><div class="footer-column"><h3>Khám phá</h3><a href="/about">Về AQPTech</a><a href="/solutions">Giải pháp</a><a href="/products">Sản phẩm</a><a href="/services">Dịch vụ</a></div><div class="footer-column"><h3>Kết nối</h3><a href="/contact">Tư vấn & báo giá</a><a href="/support">Hỗ trợ kỹ thuật</a><a href="/insights">Kiến thức công nghệ</a><a href="/contact?interest=Hợp%20tác%20OEM">Hợp tác OEM</a></div><div class="footer-newsletter"><h3>Một bước trước công nghệ.</h3><p>Nhận góc nhìn kỹ thuật và thông tin giải pháp.</p><form data-api="newsletter"><label class="sr-only" for="newsletter-email">Email nhận bản tin</label><div class="newsletter-input"><input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Email của bạn" maxlength="254" required><button type="submit" aria-label="Đăng ký bản tin">${icon("arrow-up-right")}</button></div><label class="consent newsletter-consent"><input type="checkbox" name="consent" required><span>Tôi đồng ý nhận bản tin và <a href="/privacy">chính sách riêng tư</a>.</span></label><label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><p class="form-status" role="status" aria-live="polite"></p></form></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} AQPTech. All rights reserved.</span><div><a href="/privacy">Quyền riêng tư</a><a href="/terms">Điều khoản</a><a href="#top" class="back-top">Về đầu trang${icon("arrow-up-right")}</a></div></div>${footerInfo({ icon })}</div></footer>`;
}

function callToAction() {
  return `<section class="cta-section"><div class="container cta-inner"><div>${eyebrow("LET’S BUILD WHAT’S NEXT")}<h2>Bài toán của bạn.<br><span>Giải pháp của chúng tôi.</span></h2><p>Chia sẻ điều bạn muốn xây dựng. Cùng AQPTech tìm ra nền tảng phù hợp.</p></div>${button("Bắt đầu cuộc trao đổi", "/contact")}<span class="cta-decoration" aria-hidden="true">↗</span></div></section>`;
}

function articleCard(item) {
  return `<a class="article-card" href="/insights/${item.slug}"><div class="article-image"><img src="${item.image}" alt="Minh họa ${item.title}" width="640" height="400" loading="lazy">${icon("arrow-up-right")}</div><div class="article-meta"><span>${item.category}</span><span>${item.time}</span></div><h3>${item.title}</h3><p>${item.summary}</p><span class="text-link">Đọc bài viết${icon("arrow-right")}</span></a>`;
}

function pageIntro(tag, title, description, extra = "") {
  return `<section class="page-intro"><div class="container"><nav class="breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>/</span><span>${tag}</span></nav>${eyebrow(tag.toUpperCase())}<h1>${title}</h1><p>${description}</p>${extra}</div></section>`;
}

function detailPage(item, type) {
  const isProduct = type === "products";
  const parent = isProduct ? "Sản phẩm" : "Giải pháp";
  const features = item.features || item.needs;
  return `<section class="detail-hero container"><nav class="breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>/</span><a href="/${type}">${parent}</a><span>/</span><span>${item.name}</span></nav><div class="detail-hero-grid"><div>${eyebrow(isProduct ? item.category.toUpperCase() : item.label)}<h1>${item.name}</h1>${isProduct ? `<h2>${item.tagline}</h2>` : ""}<p>${item.description}</p>${button("Trao đổi về giải pháp", `/contact?interest=${encodeURIComponent(item.name)}`)}</div><img src="${item.image}" alt="${item.name}" width="980" height="653"></div></section><section class="detail-features section"><div class="container">${sectionHeading("01", "THIẾT KẾ THEO NHU CẦU", isProduct ? "Năng lực cốt lõi." : "Từ thách thức đến giải pháp.")}<div class="feature-grid">${features.map((feature, index) => `<div><span>0${index + 1}</span><h3>${feature}</h3><p>Được đánh giá và lựa chọn theo quy mô, môi trường triển khai và mục tiêu vận hành của dự án.</p></div>`).join("")}</div>${isProduct ? `<div class="application-note">${icon("layers")}<div><h3>Ứng dụng tiêu biểu</h3><p>${item.applications}</p><small>Cấu hình và khả năng tương thích được xác nhận trong quá trình tư vấn, kiểm thử theo dự án.</small></div></div>` : ""}</div></section>${
    !isProduct
      ? `<section class="section container">${sectionHeading("02", "NỀN TẢNG ĐỀ XUẤT", "Hệ thống cho lĩnh vực của bạn.")}<div class="products-grid">${item.productSlugs.map((slug) => productCard(products.find((product) => product.slug === slug))).join("")}</div></section>`
      : `<section class="section container">${sectionHeading("02", "KHÁM PHÁ THÊM", "Kết nối toàn bộ hệ thống.")}<div class="products-grid">${products
          .filter((product) => product.slug !== item.slug)
          .slice(0, 3)
          .map(productCard)
          .join("")}</div></section>`
  }${callToAction()}`;
}

function servicesPage(item) {
  return `${pageIntro("Dịch vụ", item.name, item.description, button("Trao đổi nhu cầu", `/contact?interest=${encodeURIComponent(item.name)}`))}<section class="section container">${sectionHeading("01", item.tag, "Rõ ràng trong từng bước.")}<div class="feature-grid service-features">${item.features.map((feature, index) => `<div><span>0${index + 1}</span><h3>${feature}</h3><p>Phạm vi công việc, tiêu chí nghiệm thu và phương án thực hiện được thống nhất theo từng dự án.</p></div>`).join("")}</div></section><section class="service-note container">${icon("check-circle-2")}<p>Dịch vụ được xây dựng theo yêu cầu cụ thể. Thời gian, chi phí và chính sách hỗ trợ sẽ được xác nhận trong đề xuất dự án.</p></section>${callToAction()}`;
}

function insightsPage(article) {
  if (!article)
    return `${pageIntro("Kiến thức", "Góc nhìn thực tế.<br><span>Quyết định sáng suốt.</span>", "Kiến thức nền tảng và góc nhìn kỹ thuật giúp bạn lựa chọn, triển khai và vận hành hệ thống hiệu quả hơn.")}<section class="section container"><div class="articles-grid">${articles.map(articleCard).join("")}</div></section>${callToAction()}`;
  return `<article class="article-detail container"><nav class="breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span>/</span><a href="/insights">Kiến thức</a></nav>${eyebrow(article.category)}<h1>${article.title}</h1><div class="article-byline"><span>AQPTech Editorial</span><span>${icon("clock")}${article.time}</span></div><p class="article-lead">${article.summary}</p><img class="article-cover" src="${article.image}" alt="Minh họa ${article.title}" width="980" height="653"><div class="article-body">${article.sections.map(([heading, text]) => `<section><h2>${heading}</h2><p>${text}</p></section>`).join("")}<div class="article-disclaimer">Nội dung cung cấp kiến thức tổng quan. Các thông số và cấu hình cần được kiểm chứng với môi trường triển khai cụ thể.</div>${button("Trao đổi với AQPTech", `/contact?interest=${encodeURIComponent(article.title)}`, "outline")}</div></article><section class="section container">${sectionHeading("ĐỌC THÊM", "GÓC NHÌN LIÊN QUAN", "Tiếp tục khám phá.")}<div class="articles-grid related-articles">${articles
    .filter((item) => item.slug !== article.slug)
    .map(articleCard)
    .join("")}</div></section>`;
}

function policyPage(type) {
  const privacy = type === "privacy";
  const sections = privacy
    ? [
        [
          "Thông tin được thu thập",
          "Biểu mẫu liên hệ thu thập họ tên, email, tên công ty, số điện thoại, nội dung quan tâm, khu vực dự kiến triển khai và mô tả yêu cầu khi bạn chủ động cung cấp. Biểu mẫu bản tin thu thập email, sự đồng ý đăng ký và họ tên nếu bạn lựa chọn cung cấp.",
        ],
        [
          "Mục đích sử dụng",
          "Thông tin được ghi nhận để xử lý yêu cầu tư vấn, hỗ trợ hoặc đăng ký nhận thông tin. Việc gửi biểu mẫu không đồng nghĩa với đặt hàng hay xác nhận dịch vụ.",
        ],
        [
          "Lưu trữ dữ liệu",
          "Trong phiên bản hiện tại, thông tin được lưu trên máy chủ vận hành website và không có trang tra cứu công khai. Quản trị viên cần cấu hình quyền truy cập, quy trình xử lý và thời gian lưu giữ phù hợp trước khi sử dụng chính thức.",
        ],
        [
          "Quyền của bạn",
          "Bạn có thể yêu cầu quản trị viên cập nhật, xóa thông tin hoặc ngừng đăng ký bản tin. Đầu mối liên hệ chính thức cần được doanh nghiệp công bố trước khi website đi vào hoạt động thương mại. Không gửi mật khẩu hoặc dữ liệu nhạy cảm qua biểu mẫu.",
        ],
        [
          "Cookie và theo dõi",
          "Website hiện không tích hợp công cụ quảng cáo, phân tích người dùng hoặc cookie tiếp thị. Nếu triển khai thêm dịch vụ bên thứ ba, chính sách cần được cập nhật tương ứng.",
        ],
      ]
    : [
        [
          "Nội dung website",
          "Thông tin trên website mang tính giới thiệu và tham khảo kỹ thuật. Nội dung không thay thế báo giá, hợp đồng, tài liệu sản phẩm chính thức hoặc tư vấn dự án cụ thể.",
        ],
        [
          "Cấu hình và dịch vụ",
          "Cấu hình, khả năng tương thích, mức giá, thời gian giao hàng và chính sách hỗ trợ được xác nhận riêng theo từng yêu cầu. Các hình ảnh là minh họa, không phải cam kết về thiết bị được cung cấp.",
        ],
        [
          "Thương hiệu và hình ảnh",
          "Tên nền tảng và nhãn hiệu của bên thứ ba thuộc chủ sở hữu tương ứng. Việc nhắc đến không hàm ý quan hệ đối tác hoặc chứng nhận. Tư liệu minh họa tham khảo cần được kiểm tra quyền sử dụng trước khi xuất bản thương mại.",
        ],
        [
          "Sử dụng biểu mẫu",
          "Bạn cần cung cấp thông tin chính xác và không gửi nội dung trái pháp luật, mã độc hoặc thông tin truy cập hệ thống. Yêu cầu được ghi nhận không tạo thành cam kết cung cấp dịch vụ.",
        ],
      ];
  return `${pageIntro(privacy ? "Quyền riêng tư" : "Điều khoản", privacy ? "Thông tin của bạn.<br><span>Trách nhiệm của chúng tôi.</span>" : "Thông tin rõ ràng.<br><span>Hợp tác minh bạch.</span>", "Chính sách cho phiên bản website hiện tại. Cần được doanh nghiệp rà soát trước khi vận hành thương mại.")}<section class="policy-content container">${sections.map(([title, text], index) => `<section><h2>${index + 1}. ${title}</h2><p>${text}</p></section>`).join("")}</section>`;
}

function notFound() {
  return `<section class="not-found container">${eyebrow("404 / KHÔNG TÌM THẤY")}<h1>Một đường dẫn khác.<br><span>Một khởi đầu mới.</span></h1><p>Trang bạn đang tìm không tồn tại hoặc đã thay đổi đường dẫn.</p>${button("Trở về trang chủ", "/")}</section>`;
}

export function renderSite(pathname = "/", search = "") {
  let path = pathname.replace(/\/+$/, "") || "/";
  const redirectedPath = productRedirects.get(path);
  if (redirectedPath) {
    path = redirectedPath;
  }
  const parts = path.split("/").filter(Boolean);
  let content;
  let title = "";
  let found = true;
  if (path === "/") content = home({ icon });
  else if (path === "/about") {
    content = aboutPage({ icon, logo });
    title = "Về AQPTech";
  } else if (path === "/solutions") {
    content = solutionsPage();
    title = "Giải pháp";
  } else if (path === "/solutions/seaports-terminals") {
    content = seaportsPage({ icon });
    title = "Cảng biển & bến cảng";
  } else if (path === "/solutions/oil-gas") {
    content = oilGasPage({ icon });
    title = "Dầu khí";
  } else if (path === "/solutions/national-borders") {
    content = nationalBordersPage({ icon });
    title = "Biên giới quốc gia";
  } else if (path === "/solutions/critical-sites") {
    content = criticalSitesPage({ icon });
    title = "Cơ sở trọng yếu";
  } else if (path === "/products/veolink") {
    content = veolinkPage({ icon });
    title = "Veolink - Điều hành tích hợp C5I";
  } else if (path === "/products/intelligent-video-analytics") {
    content = videoAnalyticsPage({ icon });
    title = "Intelligent Video Analytics";
  } else if (path === "/products/servedeck-cmms") {
    content = cmmsPage({ icon });
    title = "ServeDeck CMMS - Quản lý bảo trì & tài sản";
  } else if (path === "/solutions/gates-access") {
    content = gatesAccessPage({ icon });
    title = "Gates & Access";
  } else if (path === "/solutions/event-security") {
    content = eventSecurityPage({ icon });
    title = "Event Security - An ninh sự kiện & ứng dụng AI";
  } else if (path === "/solutions/construction-site-security") {
    content = constructionSecurityPage({ icon });
    title = "An ninh công trường";
  } else if (path === "/solutions/store-analytics") {
    content = storeAnalyticsPage({ icon });
    title = "Store Analytics - Phân tích cửa hàng";
  } else if (path === "/solutions/factory-intelligence") {
    content = factoryIntelligencePage({ icon });
    title = "Factory Intelligence - Nhà máy thông minh";
  } else if (path === "/products") {
    content = productsPage({ icon, escape, search });
    title = "Sản phẩm";
  } else if (
    parts.length === 2 &&
    ["solutions", "products"].includes(parts[0])
  ) {
    const item = (parts[0] === "solutions" ? solutions : products).find(
      (entry) => entry.slug === parts[1],
    );
    content = item ? detailPage(item, parts[0]) : notFound();
    title = item?.name || "Không tìm thấy trang";
    found = Boolean(item);
  } else if (path === "/services") {
    content = professionalServicesPage({ icon });
    title = "Professional Services";
  } else if (parts[0] === "services" && parts.length === 2) {
    const item = services.find((entry) => entry.slug === parts[1]);
    content = item ? servicesPage(item) : notFound();
    title = item?.name || "Không tìm thấy trang";
    found = Boolean(item);
  } else if (
    path === "/insights" ||
    (parts[0] === "insights" && parts.length === 2)
  ) {
    const article = articles.find((entry) => entry.slug === parts[1]);
    content =
      parts.length === 2 && !article ? notFound() : insightsPage(article);
    title = article?.title || "Kiến thức";
    if (parts.length === 2 && !article) found = false;
  } else if (path === "/contact") {
    content = contactPage({ icon, escape, search });
    title = "Liên hệ";
  } else if (path === "/support") {
    content = supportPage({ icon });
    title = "Hỗ trợ kỹ thuật";
  } else if (path === "/privacy" || path === "/terms") {
    content = policyPage(parts[0]);
    title = path === "/privacy" ? "Quyền riêng tư" : "Điều khoản";
  } else {
    content = notFound();
    title = "Không tìm thấy trang";
    found = false;
  }
  const isHome = path === "/";
  const isIndustrySolution = [
    "/solutions/seaports-terminals",
    "/solutions/oil-gas",
    "/solutions/national-borders",
    "/solutions/critical-sites",
    "/products/intelligent-video-analytics",
    "/products/servedeck-cmms",
    "/solutions/gates-access",
    "/solutions/event-security",
    "/solutions/construction-site-security",
    "/solutions/store-analytics",
    "/solutions/factory-intelligence",
  ].includes(path);
  const isBrandedPage =
    isHome ||
    isIndustrySolution ||
    ["/about", "/contact", "/solutions", "/products", "/products/veolink", "/services", "/support"].includes(path);
  const classes = [
    ["home-page", isBrandedPage], ["home-landing-page", isHome], ["industry-solution-page", isIndustrySolution],
    ["about-reference-page", path === "/about"], ["contact-reference-page", path === "/contact"],
    ["solutions-reference-page", path === "/solutions"], ["seaports-page", path === "/solutions/seaports-terminals"],
    ["oil-gas-page", path === "/solutions/oil-gas"], ["veolink-page", path === "/products/veolink"],
    ["video-analytics-page", path === "/products/intelligent-video-analytics"], ["gates-access-page", path === "/solutions/gates-access"],
    ["event-security-page", path === "/solutions/event-security"], ["professional-services-page", path === "/services"],
    ["construction-security-page", path === "/solutions/construction-site-security"], ["store-analytics-page", path === "/solutions/store-analytics"],
    ["factory-intelligence-page", path === "/solutions/factory-intelligence"], ["support-reference-page", path === "/support"],
    ["products-reference-page", path === "/products"],
    ["cmms-page", path === "/products/servedeck-cmms"],
  ].filter(([, enabled]) => enabled).map(([name]) => name).join(" ");
  const html = `<div id="top"></div>${isBrandedPage ? homeHeader({ icon, logo, path }) : header(path)}<main id="main" tabindex="-1">${content}</main>${isBrandedPage ? homeFooter({ icon, logo, newsletter: isHome || path === "/products" }) : footer()}`;
  const description = (content.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] || "AQPTech - Giải pháp công nghệ và hạ tầng cho doanh nghiệp.")
    .replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
  return { pathname: path, html, classes, title: title ? `${title} | AQPTech` : "AQPTech | Hạ tầng vững chắc. Tương lai rộng mở.", description, themeColor: isBrandedPage ? "#000000" : "#f6f5f1", found };
}
