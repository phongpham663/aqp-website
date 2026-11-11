import { images, catalogProducts, completedSolutions, services, articles, companyContact } from "./data.js";
import { footerInfo } from "./footer-info.js";

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
  const cta = (label, href, style = "primary") =>
    `<a class="home-button${style === "primary" ? "" : ` home-button-${style}`}" href="${href}">${label}${icon("arrow-up-right")}</a>`;
  const contactUrl = `/contact?interest=${encodeURIComponent("Tư vấn giải pháp")}`;
  const groups = [
    {
      id: "infrastructure", icon: "shield-check", title: "Bảo vệ hạ tầng",
      slugs: ["critical-sites", "seaports-terminals", "oil-gas", "national-borders", "gates-access"],
    },
    {
      id: "field", icon: "cctv", title: "Giám sát hiện trường",
      slugs: ["event-security", "construction-site-security"],
    },
    {
      id: "operations", icon: "chart-no-axes-combined", title: "Tối ưu vận hành",
      slugs: ["store-analytics", "factory-intelligence"],
    },
  ];
  const solutionOrder = [
    "critical-sites", "event-security", "factory-intelligence",
    "seaports-terminals", "construction-site-security", "store-analytics",
    "gates-access", "oil-gas", "national-borders",
  ];
  const journey = [
    ["compass", "Hiểu bài toán", "Khảo sát hiện trường, mục tiêu và rủi ro để thống nhất phạm vi, KPI và phương án sơ bộ.", "planning"],
    ["settings-2", "Tích hợp & kiểm thử", "Lựa chọn cấu hình, kết nối hệ thống và đánh giá kết quả trong điều kiện triển khai thực tế.", "implementation"],
    ["graduation-cap", "Bàn giao & đào tạo", "Chuẩn bị tài liệu, hướng dẫn vận hành và kế hoạch chuyển giao cho đội ngũ sử dụng.", "handover"],
    ["headphones", "Hỗ trợ & mở rộng", "Làm rõ đầu mối, SLA, bảo trì và lộ trình nâng cấp theo nhu cầu của dự án.", "maintenance"],
  ];
  const capabilities = [
    [catalogProducts.length, "Sản phẩm phần mềm", "Điều hành, phân tích & bảo trì", "/products"],
    [completedSolutions.length, "Giải pháp được giới thiệu", "Theo từng bài toán thực tế", "/solutions"],
    [services.length, "Nhóm dịch vụ", "Xuyên suốt vòng đời dự án", "/services"],
  ];

  return `<section class="home-hero home-texture" aria-labelledby="home-title">
    <div class="home-hero-inner">
      <div class="home-hero-copy">
        <h1 id="home-title">Kết nối an ninh.<br>Thấu hiểu vận hành.</h1>
        <p>Kết nối giám sát, kiểm soát ra vào và dữ liệu vận hành trên một nền tảng phù hợp. AQPTech cùng doanh nghiệp nhận biết rủi ro, phối hợp xử lý và tìm cơ hội cải tiến.</p>
        <div class="home-hero-actions">
          ${cta("Khám phá giải pháp", "#home-solutions")}
          ${cta("Trao đổi nhu cầu", contactUrl)}
        </div>
      </div>
      <div class="home-hero-image"><img src="/assets/velasea/images/velasea-hero_racks-1280x817--75b79a8043.png" alt="Hai kỹ sư trao đổi về hệ thống máy chủ trong trung tâm dữ liệu" width="1280" height="817" fetchpriority="high"></div>
    </div>
  </section>

  <nav class="home-capabilities" aria-label="Khám phá năng lực AQPTech"><div class="container home-capabilities-grid">${capabilities.map(([count, title, text, href]) => `<a class="home-capability" href="${href}"><span class="home-capability-number">${String(count).padStart(2, "0")}</span><div><strong>${title}</strong><span>${text}</span></div>${icon("arrow-up-right")}</a>`).join("")}</div></nav>

  <section id="home-solutions" class="container home-solutions" aria-labelledby="home-solutions-title">
    <div class="home-section-heading"><div><span class="home-kicker">01 / GIẢI PHÁP THEO NHU CẦU</span><h2 id="home-solutions-title">Bài toán của bạn.<br>Hướng triển khai phù hợp.</h2></div><div class="home-heading-aside"><p>Từ hạ tầng trọng yếu đến cửa hàng và nhà máy. Bắt đầu với môi trường vận hành để tìm phương án giám sát, tích hợp và phân tích phù hợp.</p><a class="home-text-link" href="/solutions">Tất cả giải pháp${icon("arrow-up-right")}</a></div></div>
    <div class="home-solutions-toolbar">
      <div class="home-solution-filters" role="group" aria-label="Lọc giải pháp theo nhu cầu" hidden>
        <button type="button" data-home-filter="all" aria-pressed="true" aria-controls="home-solution-grid">Tất cả<span aria-hidden="true">${completedSolutions.length}</span></button>
        ${groups.map((group) => `<button id="home-${group.id}" type="button" data-home-filter="${group.id}" aria-pressed="false" aria-controls="home-solution-grid">${icon(group.icon)}${group.title}<span aria-hidden="true">${group.slugs.length}</span></button>`).join("")}
      </div>
      <span id="home-solution-count" class="home-solution-count" role="status" aria-live="polite" aria-atomic="true">${completedSolutions.length} giải pháp</span>
    </div>
    <div id="home-solution-grid" class="home-solution-cards">${solutionOrder.map((slug) => {
      const item = completedSolutions.find((solution) => solution.slug === slug);
      const group = groups.find((entry) => entry.slugs.includes(slug));
      return `<a class="home-solution-card" href="/solutions/${item.slug}" data-home-group="${group.id}"><div class="home-solution-photo"><img src="${item.image}" alt="Minh họa ${item.menuName || item.name}" loading="lazy" width="640" height="400"><span class="home-solution-icon">${icon(item.icon)}</span></div><div class="home-solution-content"><span class="home-solution-label">${group.title}</span><h3>${item.menuName || item.name}</h3><p>${item.needs[0]}.</p><span class="home-solution-link">Tìm hiểu phương án${icon("arrow-up-right")}</span></div></a>`;
    }).join("")}</div>
    <div class="home-solutions-help">${icon("compass")}<p>Chưa tìm được hướng phù hợp? <a href="${contactUrl}">Cùng AQPTech làm rõ nhu cầu${icon("arrow-right")}</a></p></div>
  </section>

  <section id="home-software" class="home-software" aria-labelledby="home-software-title"><div class="container">
    <div class="home-section-heading"><div><span class="home-kicker">02 / DANH MỤC PHẦN MỀM</span><h2 id="home-software-title">Kết nối thông tin.<br>Hỗ trợ quyết định.</h2></div><div class="home-heading-aside"><p>Điều hành tích hợp, phân tích video và quản lý bảo trì. Lựa chọn nền tảng theo mục tiêu vận hành và phạm vi của từng dự án.</p><a class="home-text-link" href="/products">Khám phá sản phẩm${icon("arrow-up-right")}</a></div></div>
    <div class="home-software-grid">${catalogProducts.map((item) => `<article class="home-software-card" data-product="${item.slug}"><div class="home-product-copy"><span class="home-product-label">${icon(item.icon)}${item.homeLabel}</span><h3>${item.name}</h3><p class="home-product-tagline">${item.tagline}</p><ul role="list">${item.features.map((feature) => `<li>${icon("check")}${feature}</li>`).join("")}</ul>${cta("Tìm hiểu sản phẩm", `/products/${item.slug}`, "light")}</div><figure class="home-product-media"><img src="${item.image}" alt="${item.imageAlt}" width="${item.imageWidth}" height="${item.imageHeight}" loading="lazy"><figcaption>Hình ảnh minh họa${icon("arrow-up-right")}</figcaption></figure></article>`).join("")}</div>
  </div></section>

  <section class="container home-journey" aria-labelledby="home-journey-title"><div class="home-section-heading"><div><span class="home-kicker">03 / TỪ NHU CẦU ĐẾN VẬN HÀNH</span><h2 id="home-journey-title">Không chỉ triển khai.<br>Còn là đồng hành.</h2></div><div class="home-heading-aside"><p>Một đầu mối xuyên suốt. Làm rõ quy trình, kiểm thử, đào tạo và trách nhiệm hỗ trợ ngay từ bước đầu tiên.</p><a class="home-text-link" href="/services">Cách chúng tôi đồng hành${icon("arrow-up-right")}</a></div></div><ol class="home-journey-grid" role="list">${journey.map(([name, title, text, stage], index) => `<li><a href="/services#ps-stage-${stage}"><div class="home-journey-step"><span class="home-journey-number" aria-hidden="true">0${index + 1}</span>${icon(name)}</div><h3>${title}</h3><p>${text}</p><span class="home-text-link">Xem giai đoạn${icon("arrow-up-right")}</span></a></li>`).join("")}</ol></section>

  <section class="home-news" aria-labelledby="home-news-title">
    <div class="container">
      <div class="home-section-heading"><div><span class="home-kicker">04 / KIẾN THỨC & GÓC NHÌN</span><h2 id="home-news-title">Hiểu công nghệ.<br>Chọn đúng nền tảng.</h2></div><a class="home-text-link" href="/insights">Tất cả bài viết${icon("arrow-up-right")}</a></div>
      <div class="home-news-carousel" role="region" aria-label="Bài viết công nghệ" aria-roledescription="carousel">
        <div id="home-news-track" class="home-news-track" tabindex="0" aria-label="Danh sách bài viết; cuộn hoặc dùng phím mũi tên để xem thêm">
          ${articles.map((article, index) => `<article class="home-news-card" aria-label="Bài viết ${index + 1} trên ${articles.length}"><a class="home-news-image" href="/insights/${article.slug}" tabindex="-1" aria-hidden="true"><img src="${article.image}" alt="" width="640" height="400" loading="lazy"></a><div class="home-news-meta"><span class="home-news-category">${article.category}</span><span>${icon("clock")}${article.time}</span></div><h3><a href="/insights/${article.slug}">${article.title}</a></h3><p>${article.summary}</p><a class="home-text-link" href="/insights/${article.slug}">Đọc bài viết${icon("arrow-up-right")}<span class="sr-only">: ${article.title}</span></a></article>`).join("")}
        </div>
        <div class="home-news-controls" hidden><button type="button" data-news-direction="-1" aria-label="Bài viết trước" aria-controls="home-news-track">${icon("arrow-right")}</button><span class="home-news-position" role="status" aria-live="polite" aria-atomic="true">1 / ${articles.length}</span><button type="button" data-news-direction="1" aria-label="Bài viết tiếp theo" aria-controls="home-news-track">${icon("arrow-right")}</button></div>
      </div>
    </div>
  </section>

  <section class="home-project" aria-labelledby="home-project-title"><div class="container home-project-inner"><div><span class="home-kicker">CÙNG AQPTECH XÂY DỰNG GIẢI PHÁP</span><h2 id="home-project-title">Bắt đầu từ<br>bài toán của bạn.</h2><p>Chia sẻ mục tiêu, hiện trạng và điều bạn muốn cải thiện. Cùng chúng tôi tìm một hướng triển khai có cơ sở.</p></div><div class="home-project-actions">${cta("Bắt đầu trao đổi", contactUrl, "light")}<a href="${companyContact.phoneHref}">${icon("phone")}Gọi ${companyContact.phone}</a></div>${icon("arrow-up-right", "home-project-decoration")}</div></section>
  <div class="container"><p class="home-scope-note">Các hình ảnh và sơ đồ là minh họa, không phải bằng chứng công trình, đối tác hoặc chứng nhận AQPTech. Khả năng tích hợp, giấy phép và phạm vi cung cấp được xác nhận theo dự án. Phân tích AI hỗ trợ xác minh của con người; mục đích xử lý dữ liệu, quyền truy cập và điều kiện triển khai cần được thống nhất trước khi vận hành.</p></div>`;
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

export function setupHome({ signal }) {
  const filters = document.querySelector(".home-solution-filters");
  if (filters) {
    filters.hidden = false;
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-home-filter]");
      if (!button) return;
      const group = button.dataset.homeFilter;
      let count = 0;
      document.querySelectorAll("#home-solution-grid [data-home-group]").forEach((card) => {
        card.hidden = group !== "all" && card.dataset.homeGroup !== group;
        if (!card.hidden) count++;
      });
      filters.querySelectorAll("[data-home-filter]").forEach((filter) => {
        filter.setAttribute("aria-pressed", String(filter === button));
      });
      document.querySelector("#home-solution-count").textContent = `${count} giải pháp`;
    }, { signal });
  }
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
  }, { signal });
  toggle
    .closest(".home-contact-widget")
    .addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Mở tùy chọn liên hệ AQPTech");
        toggle.focus();
      }
    }, { signal });
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
  track.addEventListener("scroll", update, { passive: true, signal });
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
  }, { signal });
  track.addEventListener("keydown", (event) => {
    if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      controls.querySelector(`[data-news-direction="${event.key === "ArrowLeft" ? -1 : 1}"]`).click();
    } else {
      track.scrollTo({
        left: event.key === "Home" ? 0 : track.scrollWidth,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    }
  }, { signal });
  const observer = new ResizeObserver(() => {
    if (!track.isConnected) {
      observer.disconnect();
      return;
    }
    update();
  });
  observer.observe(track);
  update();
  return () => observer.disconnect();
}
