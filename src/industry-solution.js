import { referenceHero } from "./about.js";

export function industrySolutionPage({ icon, solution, page, type = "solutions" }) {
  const contactUrl = `/contact?interest=${encodeURIComponent(solution.name)}`;
  const { hero, overview, capabilities, benefits, resources } = page;
  // Preserve the existing Seaports section anchors while sharing the layout.
  const sectionIdPrefix = solution.slug === "seaports-terminals" ? "seaports" : solution.slug;
  const navLabel = solution.slug === "seaports-terminals"
    ? "Các năng lực giải pháp cảng biển"
    : `Các năng lực giải pháp ${solution.name.toLowerCase()}`;

  return `${referenceHero({
    id: `${solution.slug}-title`,
    title: solution.name,
    subtitle: hero.subtitle,
    description: hero.description,
    image: solution.image,
    imageAlt: hero.imageAlt,
    imageWidth: hero.imageWidth,
    imageHeight: hero.imageHeight,
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Tư vấn giải pháp${icon("arrow-up-right")}</a>${hero.videoUrl ? `<a class="industry-video-link" href="${hero.videoUrl}" target="_blank" rel="noopener noreferrer">${icon("play")}${hero.videoLabel || "Xem video Magal"}<span class="sr-only"> (tiếng Anh, mở tab mới)</span></a>` : ""}</div>`,
  })}

  <nav class="industry-section-nav" aria-label="${navLabel}"><div class="container" style="--industry-nav-count:${capabilities.items.length}">${capabilities.items.map((item, index) => `<a href="#${item.id}"><span>0${index + 1}</span>${item.label}${icon("arrow-right")}</a>`).join("")}</div></nav>

  <section class="container industry-overview" aria-labelledby="${sectionIdPrefix}-overview-title">
    <nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/${type}">${type === "products" ? "Sản phẩm" : "Giải pháp"}</a><span aria-hidden="true">/</span><span aria-current="page">${solution.name}</span></nav>
    <span class="industry-kicker" lang="en">${solution.label}</span>
    <h2 id="${sectionIdPrefix}-overview-title" class="industry-section-title">${overview.title}</h2>
    <div class="industry-overview-grid">${overview.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
    <dl class="industry-systems">${overview.systems.map(([name, text]) => `<div><dt>${name}</dt><dd>${text}</dd></div>`).join("")}</dl>
  </section>

  <section class="industry-capabilities" aria-labelledby="${sectionIdPrefix}-capabilities-title">
    <img class="industry-terminal-photo" src="${capabilities.image}" alt="${capabilities.imageAlt}" width="${capabilities.imageWidth}" height="${capabilities.imageHeight}" loading="lazy">
    <div class="container industry-capabilities-inner"><span class="industry-kicker">NĂNG LỰC GIẢI PHÁP</span><h2 id="${sectionIdPrefix}-capabilities-title">${capabilities.title}</h2>
      <div class="industry-capability-list">${capabilities.items.map((item, index) => `<article id="${item.id}" class="industry-capability" aria-labelledby="${item.id}-title"><div class="industry-capability-top"><span>0${index + 1} / ${item.label}</span>${icon(item.icon)}</div><h3 id="${item.id}-title">${item.title}</h3><ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul></article>`).join("")}</div>
    </div>
  </section>

  <section class="container industry-benefits" aria-labelledby="${sectionIdPrefix}-benefits-title">
    <p class="industry-benefits-lead">${benefits.lead}</p>
    <h2 id="${sectionIdPrefix}-benefits-title" class="industry-section-title">Lợi ích của giải pháp</h2>
    <div class="industry-benefit-grid">${benefits.items.map((item) => `<article class="industry-benefit">${icon(item.icon)}<h3>${item.title}</h3><p>${item.text}</p></article>`).join("")}</div>
    <p class="industry-scope-note">Nội dung tham khảo từ giải pháp ${resources.sourceName} của Magal. Khả năng tích hợp, các mô-đun và hiệu quả thực tế cần được xác nhận theo hệ thống hiện hữu, giấy phép phần mềm và phạm vi từng dự án.</p>
    <div class="industry-resources"><div><h3>${resources.title}</h3>${resources.brochureUrl ? `<a href="${resources.brochureUrl}" target="_blank" rel="noopener noreferrer">${icon("download")}Xem brochure Magal<span class="sr-only"> (PDF tiếng Anh, mở tab mới)</span>${icon("arrow-up-right")}</a>` : ""}</div><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a></div>
  </section>`;
}
