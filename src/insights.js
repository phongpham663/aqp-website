import { articles, images } from "./data.js";
import { referenceHero } from "./about.js";

function articleCard(article, icon, escape) {
  return `<a class="insights-card" href="/insights/${article.slug}" aria-labelledby="insights-${article.slug}-title"><div class="insights-card-image"><img src="${article.image}" alt="Minh họa ${escape(article.title)}" width="${article.imageWidth}" height="${article.imageHeight}" loading="lazy"></div><div class="insights-card-body"><div class="insights-card-meta"><span class="insights-category">${escape(article.category)}</span><span class="insights-reading-time">${icon("clock")}${escape(article.time)}</span></div><h3 id="insights-${article.slug}-title">${escape(article.title)}</h3><p>${escape(article.summary)}</p><span class="insights-read-link">Đọc bài viết${icon("arrow-up-right")}</span></div></a>`;
}

export function insightsPage({ icon, escape }) {
  const contactUrl = `/contact?interest=${encodeURIComponent("Tư vấn giải pháp công nghệ")}`;

  return `${referenceHero({
    id: "insights-title",
    title: "Kiến thức công nghệ",
    subtitle: "Góc nhìn thực tế. Quyết định sáng suốt.",
    description: "Kiến thức nền tảng và góc nhìn kỹ thuật về AI, hạ tầng, lưu trữ và OEM giúp bạn lựa chọn, triển khai và vận hành hệ thống hiệu quả hơn.",
    image: images.dataCenter,
    imageAlt: "Hạ tầng máy chủ và lưu trữ trong trung tâm dữ liệu",
    imageWidth: 1280,
    imageHeight: 720,
    actions: `<div class="industry-hero-actions"><a class="home-button" href="#insights-articles">Khám phá bài viết${icon("arrow-right")}</a><a class="industry-video-link" href="${contactUrl}">Trao đổi nhu cầu${icon("arrow-up-right")}</a></div>`,
  })}

  <section id="insights-articles" class="container insights-content" aria-labelledby="insights-articles-title">
    <nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><span aria-current="page">Kiến thức</span></nav>
    <div class="insights-section-heading"><div><span class="industry-kicker">GÓC NHÌN AQPTECH</span><h2 id="insights-articles-title" class="industry-section-title">Hiểu công nghệ. Chọn đúng giải pháp.</h2><p>Khám phá những chủ đề kỹ thuật gắn với ứng dụng thực tế, từ hạ tầng doanh nghiệp đến AI tại biên và thiết kế hệ thống OEM.</p></div><p class="insights-count"><strong>${String(articles.length).padStart(2, "0")}</strong> <span>bài viết</span></p></div>
    <div class="insights-grid">${articles.map((article) => articleCard(article, icon, escape)).join("")}</div>
    <aside class="insights-help" aria-labelledby="insights-help-title"><div><h2 id="insights-help-title">Đưa kiến thức vào bài toán thực tế.</h2><p>Chia sẻ ứng dụng, quy mô và hiện trạng. Cùng AQPTech làm rõ phương án phù hợp cho hệ thống của bạn.</p></div><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a></aside>
  </section>`;
}

export function articlePage({ article, icon, escape }) {
  const contactUrl = `/contact?interest=${encodeURIComponent(article.title)}`;
  return `<article class="article-detail container" aria-labelledby="article-title">
    <nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/insights">Kiến thức</a><span aria-hidden="true">/</span><span aria-current="page">Bài viết</span></nav>
    <div class="article-heading"><span class="industry-kicker">${escape(article.category)}</span><h1 id="article-title">${escape(article.title)}</h1><div class="article-byline"><span>AQPTech Editorial</span><span>${icon("clock")}${escape(article.time)}</span></div><p class="article-lead">${escape(article.summary)}</p></div>
    <figure class="article-cover-figure"><img class="article-cover" src="${article.image}" alt="Minh họa ${escape(article.title)}" width="${article.imageWidth}" height="${article.imageHeight}" fetchpriority="high"><figcaption>Hình ảnh minh họa cho nội dung bài viết.</figcaption></figure>
    <div class="article-reading-layout">
      <nav class="article-toc" aria-labelledby="article-toc-title"><h2 id="article-toc-title">Mục lục</h2><ol>${article.sections.map(([heading], index) => `<li><a href="#article-section-${index + 1}"><span aria-hidden="true">0${index + 1}</span><span>${escape(heading)}</span></a></li>`).join("")}</ol></nav>
      <div class="article-body">${article.sections.map(([heading, text], index) => `<section id="article-section-${index + 1}" aria-labelledby="article-heading-${index + 1}"><h2 id="article-heading-${index + 1}">${escape(heading)}</h2><p>${escape(text)}</p></section>`).join("")}<div class="article-disclaimer">Nội dung cung cấp kiến thức tổng quan. Các thông số và cấu hình cần được kiểm chứng với môi trường triển khai cụ thể.</div><div class="article-actions"><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a><a class="about-inline-link" href="/insights">Xem tất cả bài viết${icon("arrow-right")}</a></div></div>
    </div>
  </article>
  <section class="article-related container" aria-labelledby="article-related-title"><span class="industry-kicker">GÓC NHÌN LIÊN QUAN</span><h2 id="article-related-title" class="industry-section-title">Tiếp tục khám phá.</h2><div class="insights-grid related-articles">${articles.filter((item) => item.slug !== article.slug).map((item) => articleCard(item, icon, escape)).join("")}</div></section>`;
}
