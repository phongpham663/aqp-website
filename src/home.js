import { images, products, solutions, completedSolutions, services, articles } from "./data.js";
import { footerInfo } from "./footer-info.js";
import heroImage from "../assets/velasea/images/velasea-hero_racks-1280x817--75b79a8043.png";
import officeImage from "../assets/velasea/images/commercial-office-complex-980x653--dacd576d2c.jpg";
import "./home.css";

export function homeHeader({ icon, logo, path = "/" }) {
  return `<header class="site-header home-header">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="AQPTech - Trang chủ">${logo()}</a>
      <button class="menu-toggle" aria-label="Mở menu điều hướng" aria-controls="main-nav" aria-expanded="false">${icon("menu")}</button>
      <nav id="main-nav" class="main-nav" aria-label="Điều hướng chính">
        <a class="nav-link" href="/about"${path === "/about" ? ' aria-current="page"' : ""}>Giới thiệu</a>
        <details class="nav-dropdown">
          <summary class="nav-link${path.startsWith("/solutions") ? " active" : ""}">Giải pháp${icon("chevron-down")}</summary>
          <div class="dropdown-panel">
            <a class="dropdown-heading" href="/solutions"${path === "/solutions" ? ' aria-current="page"' : ""}>Tất cả giải pháp${icon("arrow-up-right")}</a>
            ${completedSolutions.map((item) => `<a href="/solutions/${item.slug}">${icon(item.icon)}${item.menuName || item.name}${icon("arrow-up-right")}</a>`).join("")}
          </div>
        </details>
        <a class="nav-link${path.startsWith("/services") ? " active" : ""}" href="/services"${path === "/services" ? ' aria-current="page"' : ""}>Dịch vụ</a>
        <a class="nav-link${path.startsWith("/products") ? " active" : ""}" href="/products"${path.startsWith("/products") ? ' aria-current="page"' : ""}>Sản phẩm</a>
        <a class="nav-link" href="/support"${path === "/support" ? ' aria-current="page"' : ""}>Hỗ trợ</a>
        <a class="nav-link" href="/contact"${path === "/contact" ? ' aria-current="page"' : ""}>Liên hệ</a>
        <a class="home-search-link" href="/products?q=" aria-label="Tìm kiếm sản phẩm">${icon("search")}</a>
      </nav>
    </div>
  </header>`;
}

export function home({ icon }) {
  const cta = (label, href) =>
    `<a class="home-button" href="${href}">${label}</a>`;
  const categories = [
    "servers",
    "storage",
    "ai-computing",
    "ip-video",
    "networking",
    "edge-industrial",
  ];
  const values = [
    {
      icon: "settings-2",
      title: "Thiết kế toàn diện",
      text: "Kết nối yêu cầu kỹ thuật, ứng dụng và mục tiêu kinh doanh để lựa chọn nền tảng phù hợp.",
      href: "/services/integration",
    },
    {
      icon: "shield-check",
      title: "Chất lượng có cơ sở",
      text: "Kiểm thử tương thích, đánh giá hiệu năng và chuẩn hóa cấu hình trước khi triển khai.",
      href: "/services/oem",
    },
    {
      icon: "graduation-cap",
      title: "Chuyên môn kỹ thuật",
      text: "Tư vấn và tích hợp phần cứng, phần mềm thành một hệ thống được thiết kế cho bài toán thực tế.",
      href: "/about",
    },
  ];
  const network = [
    {
      count: products.length,
      label: "NỀN TẢNG CÔNG NGHỆ",
      title: "Hệ sinh thái giải pháp",
      text: "Từ máy chủ, lưu trữ và hạ tầng mạng đến AI, giám sát IP và máy tính công nghiệp. Kết nối các thành phần thành một nền tảng phù hợp với ứng dụng, dễ quản trị và có khả năng mở rộng.",
      href: "/products",
      cta: "Khám phá sản phẩm",
    },
    {
      count: solutions.length,
      label: "LĨNH VỰC ỨNG DỤNG",
      title: "Hiểu đúng ngành của bạn",
      text: "Mỗi môi trường vận hành có những yêu cầu riêng. AQPTech tiếp cận bài toán từ lĩnh vực, quy mô và điều kiện triển khai để cân đối hiệu năng, độ ổn định và chi phí đầu tư.",
      href: "/solutions",
      cta: "Khám phá giải pháp",
    },
    {
      count: services.length,
      label: "NHÓM DỊCH VỤ",
      title: "Hợp tác cùng AQPTech",
      text: "Bạn là doanh nghiệp, đơn vị tích hợp hoặc đối tác phần mềm? Cùng chúng tôi xây dựng hệ thống OEM, triển khai hạ tầng và lập kế hoạch hỗ trợ xuyên suốt vòng đời sản phẩm.",
      href: "/contact?interest=Hợp%20tác%20OEM",
      cta: "Kết nối với chúng tôi",
    },
  ];

  return `<section class="home-hero home-texture">
    <div class="home-hero-inner">
      <div class="home-hero-copy">
        <h1>Bạn đưa ra bài toán.<br>Chúng tôi kiến tạo hệ thống.</h1>
        <p>AQPTech thiết kế, tích hợp và hỗ trợ các hệ thống tính toán chuyên dụng cho doanh nghiệp, đơn vị tích hợp và đối tác phần mềm. Từ nền tảng máy chủ, lưu trữ đến AI và điện toán biên, chúng tôi lựa chọn cấu hình theo ứng dụng thực tế hoặc xây dựng giải pháp OEM theo nhận diện của bạn. Mỗi hệ thống được hướng đến sự tương thích, ổn định và khả năng mở rộng.</p>
        <div class="home-hero-actions">
          ${cta("Khám phá giải pháp", "/solutions")}
          ${cta("Tìm hiểu năng lực", "/services")}
          ${cta("Liên hệ", "/contact")}
        </div>
      </div>
      <div class="home-hero-image"><img src="${heroImage}" alt="Hai kỹ sư trao đổi về hệ thống máy chủ trong trung tâm dữ liệu" width="1280" height="817" fetchpriority="high"></div>
    </div>
  </section>

  <section class="home-technologies container" aria-labelledby="home-technologies-title">
    <h2 id="home-technologies-title">Xây dựng nền tảng cho…</h2>
    <div class="home-category-grid">
      ${categories
        .map((slug) => {
          const item = products.find((product) => product.slug === slug);
          return `<a href="/products/${slug}">${icon(item.icon)}<h3>${item.name}</h3></a>`;
        })
        .join("")}
    </div>
  </section>

  <section class="home-introduction container" aria-label="AQPTech giải quyết bài toán công nghệ">
    <div class="home-introduction-copy">
      <div>
        <h2>Quản lý công nghệ có thể <span>trở nên phức tạp.</span></h2>
        <p>Nguồn cung khó dự đoán, chi phí đầu tư tăng và yêu cầu tích hợp ngày càng nhiều. Giữ cho hệ thống vận hành ổn định trong khi doanh nghiệp tiếp tục phát triển là một bài toán không nhỏ.</p>
        <p>Một cấu hình chưa phù hợp có thể giới hạn khả năng mở rộng. Phần cứng thiếu tương thích, dung lượng lưu trữ không đủ hoặc quy trình hỗ trợ chưa rõ ràng dễ dẫn đến gián đoạn, chậm tiến độ và phát sinh chi phí.</p>
      </div>
      <div>
        <h2>AQPTech giúp bạn <span>đơn giản hóa bài toán.</span></h2>
        <p>Chúng tôi bắt đầu bằng việc lắng nghe ứng dụng, môi trường triển khai và mục tiêu của bạn. Từ <a href="/services/oem">hệ thống OEM theo yêu cầu</a> đến <a href="/solutions">giải pháp hạ tầng doanh nghiệp</a>, AQPTech kết nối máy chủ, lưu trữ, giám sát IP, AI và điện toán biên thành một hệ thống đồng bộ.</p>
        <p>Không chỉ lựa chọn thiết bị, chúng tôi hướng đến <strong>cấu hình được kiểm thử, phương án triển khai rõ ràng và khả năng nâng cấp dài hạn.</strong> Bạn có một đầu mối để trao đổi từ thiết kế, tích hợp đến <a href="/support">hỗ trợ vận hành</a>.</p>
        ${cta("Cách chúng tôi đồng hành", "/about")}
      </div>
    </div>
    <div class="home-introduction-media">
      <a class="home-system-photo" href="/services/integration">
        <img src="${images.dataCenter}" alt="Minh họa nền tảng máy chủ và lưu trữ" width="1280" height="720" loading="lazy">
        <div><span>Từ yêu cầu<br>đến hệ thống.</span>${icon("arrow-up-right")}<small>Khám phá dịch vụ tích hợp</small></div>
      </a>
      <figure class="home-office-photo"><img src="${officeImage}" alt="Minh họa tòa nhà doanh nghiệp và môi trường ứng dụng công nghệ" width="980" height="653" loading="lazy"><figcaption>Công nghệ phù hợp cho từng môi trường doanh nghiệp.</figcaption></figure>
    </div>
  </section>

  <section class="home-values container" aria-label="Giá trị AQPTech">
    ${values.map((value) => `<a class="home-value-card" href="${value.href}">${icon(value.icon)}<h2>${value.title}</h2><p>${value.text}</p><span>Tìm hiểu thêm${icon("arrow-right")}</span></a>`).join("")}
  </section>

  <section class="home-network" aria-label="Năng lực và hợp tác">
    <div class="container home-network-grid">${network.map((item) => `<div class="home-network-column"><span class="home-network-count">${String(item.count).padStart(2, "0")}</span><p class="home-network-label">${item.label}</p><h2>${item.title}</h2><p>${item.text}</p>${cta(item.cta, item.href)}</div>`).join("")}</div>
  </section>

  <section class="home-news home-texture" aria-labelledby="home-news-title">
    <div class="container">
      <div class="home-news-heading"><h2 id="home-news-title">Kiến thức + Góc nhìn</h2><a href="/insights">Tất cả bài viết${icon("arrow-up-right")}</a></div>
      <div class="home-news-carousel" role="region" aria-label="Bài viết công nghệ" aria-roledescription="carousel">
        <div class="home-news-track" tabindex="0" aria-label="Danh sách bài viết; cuộn để xem thêm">
          ${articles.map((article, index) => `<article class="home-news-card" aria-label="Bài viết ${index + 1} trên ${articles.length}"><div class="home-reading-badge"><span>${String(parseInt(article.time, 10)).padStart(2, "0")}</span><span>PHÚT ĐỌC</span></div><span class="home-news-category">${article.category}</span><h3><a href="/insights/${article.slug}">${article.title}</a></h3><p>${article.summary}</p><a class="home-button" href="/insights/${article.slug}">Đọc thêm<span class="sr-only">: ${article.title}</span></a></article>`).join("")}
        </div>
        <div class="home-news-controls" hidden><button data-news-direction="-1" aria-label="Bài viết trước">${icon("arrow-right")}</button><span class="home-news-position" role="status" aria-live="polite">1 / ${articles.length}</span><button data-news-direction="1" aria-label="Bài viết tiếp theo">${icon("arrow-right")}</button></div>
      </div>
    </div>
  </section>`;
}

export function homeFooter({ icon, logo, newsletter = true }) {
  return `<footer class="home-footer">
    <div class="container">
      ${
        newsletter
          ? `<section class="home-newsletter" aria-labelledby="home-newsletter-title">
        <div><h2 id="home-newsletter-title">Giữ kết nối</h2><p>Nhận góc nhìn kỹ thuật và thông tin hữu ích về sản phẩm, giải pháp công nghệ.</p></div>
        <form data-api="newsletter" class="home-newsletter-form">
          <div class="home-newsletter-fields">
            <label><span class="sr-only">Tên của bạn (không bắt buộc)</span><input name="firstName" placeholder="Tên" autocomplete="given-name" maxlength="60"></label>
            <label><span class="sr-only">Họ của bạn (không bắt buộc)</span><input name="lastName" placeholder="Họ" autocomplete="family-name" maxlength="60"></label>
            <label><span class="sr-only">Email nhận bản tin</span><input id="newsletter-email" name="email" type="email" placeholder="Email của bạn" autocomplete="email" maxlength="254" required></label>
          </div>
          <label class="consent newsletter-consent"><input name="consent" type="checkbox" required><span>Tôi đồng ý nhận bản tin và <a href="/privacy">chính sách riêng tư</a>.</span></label>
          <label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
          <button class="home-button" type="submit" aria-label="Đăng ký bản tin">Đăng ký nhận tin</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>`
          : ""
      }
      <div class="home-footer-grid">
        <div class="home-footer-brand"><a class="brand" href="/" aria-label="AQPTech - Trang chủ">${logo()}</a><p>Thiết kế đúng nền tảng.<br>Đồng hành cùng doanh nghiệp.</p><a href="/contact">${icon("mail")}Tư vấn giải pháp & báo giá</a><a href="/support">${icon("headphones")}Hỗ trợ kỹ thuật</a><a href="/contact?interest=Hợp%20tác%20OEM">${icon("blocks")}Trao đổi hợp tác OEM</a></div>
        <div class="home-footer-links"><h2>Khám phá</h2><a href="/about">Về AQPTech</a><a href="/solutions">Giải pháp theo lĩnh vực</a><a href="/products">Sản phẩm</a><a href="/services">Dịch vụ</a><a href="/insights">Kiến thức công nghệ</a></div>
        <div class="home-footer-links"><h2>Kết nối</h2><a href="/contact">Liên hệ với chúng tôi</a><a href="/contact?interest=Tư%20vấn%20cấu%20hình">Tư vấn cấu hình</a><a href="/support">Hỗ trợ & bảo hành</a><a href="/services/oem">Chương trình OEM</a><a class="home-footer-contact" href="/contact">Cùng kiến tạo hệ thống${icon("arrow-up-right")}</a></div>
      </div>
      <div class="home-footer-bottom"><span>© ${new Date().getFullYear()} AQPTech.</span><a href="/terms">Điều khoản</a><a href="/privacy">Quyền riêng tư</a><a href="#top">Về đầu trang${icon("arrow-up-right")}</a></div>
      ${footerInfo({ icon })}
    </div>
  </footer>
  <aside class="home-contact-widget" aria-label="Kết nối AQPTech">
    <div id="home-contact-panel" class="home-contact-panel" hidden><h2>AQPTech có thể hỗ trợ gì?</h2><p>Chọn nội dung bạn cần để gửi yêu cầu đến chúng tôi.</p><a href="/contact">Tư vấn giải pháp${icon("arrow-up-right")}</a><a href="/support">Hỗ trợ kỹ thuật${icon("arrow-up-right")}</a></div>
    <button class="home-contact-toggle" data-home-contact aria-label="Mở tùy chọn liên hệ AQPTech" aria-controls="home-contact-panel" aria-expanded="false">${icon("headphones")}</button>
  </aside>`;
}

export function setupHome() {
  const toggle = document.querySelector("[data-home-contact]");
  const panel = document.querySelector("#home-contact-panel");
  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
    toggle.setAttribute(
      "aria-label",
      panel.hidden
        ? "Mở tùy chọn liên hệ AQPTech"
        : "Đóng tùy chọn liên hệ AQPTech",
    );
  });
  toggle
    .closest(".home-contact-widget")
    .addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Mở tùy chọn liên hệ AQPTech");
        toggle.focus();
      }
    });
  const track = document.querySelector(".home-news-track");
  if (!track) return;
  const controls = document.querySelector(".home-news-controls");
  const update = () => {
    const card = track.querySelector(".home-news-card");
    const step =
      card.getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap);
    const position = Math.round(track.scrollLeft / step);
    controls.hidden = track.scrollWidth <= track.clientWidth + 2;
    controls.querySelector('[data-news-direction="-1"]').disabled =
      track.scrollLeft < 2;
    controls.querySelector('[data-news-direction="1"]').disabled =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    controls.querySelector(".home-news-position").textContent =
      `${position + 1} / ${articles.length}`;
  };
  track.addEventListener("scroll", update, { passive: true });
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-news-direction]");
    if (!button) return;
    const step =
      track.querySelector(".home-news-card").getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap);
    track.scrollBy({
      left: step * Number(button.dataset.newsDirection),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });
  const observer = new ResizeObserver(() => {
    if (!track.isConnected) {
      observer.disconnect();
      return;
    }
    update();
  });
  observer.observe(track);
  update();
}
