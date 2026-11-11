import { catalogProducts } from "./data.js";
import { escape, icon } from "./html.js";

export function productCard(item) {
  return `<a class="product-card" href="/products/${escape(item.slug)}"><div class="product-card-image"><img src="${escape(item.image)}" alt="${escape(item.name)}" loading="lazy" width="640" height="400"><span class="image-badge">${escape(item.category)}</span></div><div class="product-card-content"><div class="card-title"><h3>${escape(item.name)}</h3>${icon("arrow-up-right")}</div><p>${escape(item.description)}</p><span class="text-link">Khám phá sản phẩm${icon("arrow-right")}</span></div></a>`;
}

export function renderCatalog(category = "Tất cả", query = "") {
  const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const filtered = catalogProducts.filter((item) => (category === "Tất cả" || item.category === category) && normalize(`${item.name} ${item.category} ${item.description}`).includes(normalize(query.trim())));
  return {
    html: filtered.length ? filtered.map(productCard).join("") : `<div class="empty-state">${icon("search")}<h3>Chưa tìm thấy sản phẩm phù hợp.</h3><p>Thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục.</p><button class="button button-outline" id="clear-filters">Xóa bộ lọc${icon("arrow-right")}</button></div>`,
    count: `${filtered.length} nền tảng phù hợp${query.trim() ? ` với “${query.trim()}”` : ""}`,
  };
}
