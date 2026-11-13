import { escape, icon, logo } from "./html.js";
import { productCard } from "./catalog.js";
import { products, solutions, services, articles } from "./data.js";
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
import { productRedirects } from "./route-redirects.js";
import { productsPage } from "./products.js";
import { cmmsPage } from "./cmms.js";
import { fortisoptixPage } from "./fortisoptix.js";
import { insightsPage, articlePage } from "./insights.js";

const button = (label, href, style = "primary") =>
  `<a class="button button-${style}" href="${href}">${label}${icon("arrow-up-right")}</a>`;
const eyebrow = (text, number = "") =>
  `<div class="eyebrow">${number ? `<span>${number}</span>` : '<span class="small-square"></span>'}${text}</div>`;
const sectionHeading = (number, tag, title, description = "", action = "") =>
  `<div class="section-heading"><div>${eyebrow(tag, number)}<h2>${title}</h2></div><div class="section-heading-aside">${description ? `<p>${description}</p>` : ""}${action}</div></div>`;

function callToAction() {
  return `<section class="cta-section"><div class="container cta-inner"><div>${eyebrow("LET’S BUILD WHAT’S NEXT")}<h2>Bài toán của bạn.<br><span>Giải pháp của chúng tôi.</span></h2><p>Chia sẻ điều bạn muốn xây dựng. Cùng AQPTech tìm ra nền tảng phù hợp.</p></div>${button("Bắt đầu cuộc trao đổi", "/contact")}<span class="cta-decoration" aria-hidden="true">↗</span></div></section>`;
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
  let pageType = "";
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
  } else if (path === "/products/cmms") {
    content = cmmsPage({ icon });
    title = "CMMS - Quản lý bảo trì & tài sản";
  } else if (path === "/products/fortisoptix") {
    content = fortisoptixPage({ icon });
    title = "FortisOptix - Nền tảng AI cho robot và tự động hóa";
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
    if (item) pageType = "detail";
  } else if (path === "/services") {
    content = professionalServicesPage({ icon });
    title = "Professional Services";
  } else if (parts[0] === "services" && parts.length === 2) {
    const item = services.find((entry) => entry.slug === parts[1]);
    content = item ? servicesPage(item) : notFound();
    title = item?.name || "Không tìm thấy trang";
    found = Boolean(item);
    if (item) pageType = "service";
  } else if (path === "/insights") {
    content = insightsPage({ icon, escape });
    title = "Kiến thức công nghệ";
  } else if (parts[0] === "insights" && parts.length === 2) {
    const article = articles.find((entry) => entry.slug === parts[1]);
    content = article ? articlePage({ article, icon, escape }) : notFound();
    title = article?.title || "Kiến thức";
    found = Boolean(article);
    if (article) pageType = "article";
  } else if (path === "/contact") {
    content = contactPage({ icon, escape, search });
    title = "Liên hệ";
  } else if (path === "/support") {
    content = supportPage({ icon });
    title = "Hỗ trợ kỹ thuật";
  } else if (path === "/privacy" || path === "/terms") {
    content = policyPage(parts[0]);
    title = path === "/privacy" ? "Quyền riêng tư" : "Điều khoản";
    pageType = "policy";
  } else {
    content = notFound();
    title = "Không tìm thấy trang";
    found = false;
  }
  if (!found) pageType = "not-found";
  const isHome = path === "/";
  const isInsights = path === "/insights";
  const isIndustrySolution = [
    "/solutions/seaports-terminals",
    "/solutions/oil-gas",
    "/solutions/national-borders",
    "/solutions/critical-sites",
    "/products/intelligent-video-analytics",
    "/products/cmms",
    "/products/fortisoptix",
    "/solutions/gates-access",
    "/solutions/event-security",
    "/solutions/construction-site-security",
    "/solutions/store-analytics",
    "/solutions/factory-intelligence",
  ].includes(path);
  const classes = [
    ["home-page", true], ["home-landing-page", isHome], ["industry-solution-page", isIndustrySolution],
    ["about-reference-page", path === "/about"], ["contact-reference-page", path === "/contact"],
    ["solutions-reference-page", path === "/solutions"], ["seaports-page", path === "/solutions/seaports-terminals"],
    ["oil-gas-page", path === "/solutions/oil-gas"], ["veolink-page", path === "/products/veolink"],
    ["video-analytics-page", path === "/products/intelligent-video-analytics"], ["gates-access-page", path === "/solutions/gates-access"],
    ["event-security-page", path === "/solutions/event-security"], ["professional-services-page", path === "/services"],
    ["construction-security-page", path === "/solutions/construction-site-security"], ["store-analytics-page", path === "/solutions/store-analytics"],
    ["factory-intelligence-page", path === "/solutions/factory-intelligence"], ["support-reference-page", path === "/support"],
    ["products-reference-page", path === "/products"],
    ["cmms-page", path === "/products/cmms"],
    ["fortisoptix-page", path === "/products/fortisoptix"],
    ["insights-reference-page", isInsights],
    ["company-reference-page", Boolean(pageType)],
    [`${pageType}-reference-page`, Boolean(pageType)],
  ].filter(([, enabled]) => enabled).map(([name]) => name).join(" ");
  const html = `<div id="top"></div>${homeHeader({ icon, logo, path })}<main id="main" tabindex="-1">${content}</main>${homeFooter({ icon, logo, newsletter: isHome || isInsights || Boolean(pageType) || path === "/products" })}`;
  const description = (content.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] || "AQPTech - Giải pháp công nghệ và hạ tầng cho doanh nghiệp.")
    .replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
  return { pathname: path, html, classes, title: title ? `${title} | AQPTech` : "AQPTech | Hạ tầng vững chắc. Tương lai rộng mở.", description, themeColor: "#000000", found };
}
