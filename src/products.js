import { referenceHero } from "./about.js";
import { catalogProducts } from "./data.js";
import { renderCatalog } from "./catalog.js";
const racksImage = "/assets/velasea/images/velasea-hero_racks-1280x817--75b79a8043.png";

export function productsPage({ icon, escape, search = "" }) {
  const categories = ["Tất cả", ...new Set(catalogProducts.map((item) => item.category))];
  const params = new URLSearchParams(search);
  const requestedCategory = params.get("category");
  const category = categories.includes(requestedCategory) ? requestedCategory : "Tất cả";
  const query = params.get("q") || "";
  const results = renderCatalog(category, query);
  const contactUrl = `/contact?interest=${encodeURIComponent("Tư vấn sản phẩm")}`;

  return `${referenceHero({
    id: "products-title", title: "Sản phẩm",
    subtitle: "Nền tảng phù hợp. Hệ thống đồng bộ.",
    description: "Khám phá Veolink, Intelligent Video Analytics và ServeDeck CMMS để kết nối dữ liệu, phân tích hình ảnh và quản lý bảo trì tài sản. Lựa chọn phần mềm phù hợp với hệ thống hiện hữu và nhu cầu triển khai.",
    image: racksImage, imageWidth: 1280, imageHeight: 817,
    imageAlt: "Minh họa giải pháp công nghệ cho doanh nghiệp trong danh mục sản phẩm AQPTech",
    actions: `<div class="industry-hero-actions"><a class="home-button" href="#products-catalog">Khám phá danh mục${icon("arrow-right")}</a><a class="industry-video-link" href="${contactUrl}">Trao đổi nhu cầu${icon("arrow-up-right")}</a></div>`,
  })}
  <section id="products-catalog" class="container product-catalog" aria-labelledby="products-catalog-title"><nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><span aria-current="page">Sản phẩm</span></nav><div class="products-catalog-heading"><span class="industry-kicker">DANH MỤC SẢN PHẨM</span><h2 id="products-catalog-title" class="industry-section-title">Phần mềm cho giám sát, điều hành và bảo trì.</h2><p>Veolink kết nối thông tin điều hành. Intelligent Video Analytics phân tích an toàn và an ninh từ hình ảnh. ServeDeck CMMS tập trung công việc bảo trì và hồ sơ tài sản. Tìm theo tên hoặc ứng dụng để khám phá sản phẩm phù hợp.</p></div><div class="catalog-toolbar"><div class="filter-tabs" role="group" aria-label="Lọc theo danh mục">${categories.map((name) => `<button class="filter-tab ${name === category ? "selected" : ""}" data-category="${name}" aria-pressed="${name === category}">${name}</button>`).join("")}</div><div class="catalog-search">${icon("search")}<label class="sr-only" for="product-search">Tìm sản phẩm</label><input id="product-search" type="search" placeholder="Tìm tên hoặc ứng dụng..." value="${escape(query)}" aria-controls="product-results"></div></div><p class="catalog-count" role="status" aria-live="polite">${escape(results.count)}</p><div id="product-results" class="products-grid">${results.html}</div><div class="catalog-help">${icon("settings-2")}<div><h3>Cần tư vấn lựa chọn nền tảng?</h3><p>Chia sẻ ứng dụng, quy mô và hiện trạng để cùng làm rõ phương án phù hợp.</p></div><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a></div></section>
  <section class="products-contact home-texture" aria-labelledby="products-contact-title"><div class="container products-contact-inner"><div><span class="industry-kicker">KẾT NỐI CÙNG AQPTECH</span><h2 id="products-contact-title">Từ phần mềm đến vận hành thống nhất.</h2><p>Kết nối điều hành, phân tích video và quản lý bảo trì với quy trình hiện hữu. Cùng AQPTech xác định kịch bản sử dụng và phạm vi triển khai phù hợp.</p></div><a class="home-button" href="${contactUrl}">Bắt đầu trao đổi${icon("arrow-up-right")}</a></div></section>`;
}
