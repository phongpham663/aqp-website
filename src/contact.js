import { referenceHero } from "./about.js";
import { companyContact, products, services } from "./data.js";
import companyImage from "../assets/velasea/images/commercial-office-complex-980x653--dacd576d2c.jpg";
import "./contact.css";

const regions = [
  {
    id: "vietnam",
    name: "Việt Nam",
    description:
      "Chia sẻ tỉnh, thành phố và địa điểm dự kiến để làm rõ phương án cho dự án của bạn.",
    topics: [
      "Tư vấn cấu hình máy chủ và lưu trữ",
      "Giám sát IP, AI & điện toán biên",
      "Phối hợp tích hợp và triển khai",
    ],
  },
  {
    id: "apac",
    name: "Châu Á – Thái Bình Dương",
    description:
      "Cho các kế hoạch triển khai trong khu vực. Phạm vi cung cấp và hỗ trợ cần được xác nhận riêng.",
    topics: [
      "Làm rõ nền tảng và quy mô hệ thống",
      "Đánh giá kết nối và môi trường vận hành",
      "Trao đổi yêu cầu OEM theo dự án",
    ],
  },
  {
    id: "emea",
    name: "Châu Âu, Trung Đông & Châu Phi",
    description:
      "Chia sẻ quốc gia, yêu cầu kỹ thuật và điều kiện triển khai để trao đổi phương án phù hợp.",
    topics: [
      "Tư vấn kiến trúc hạ tầng",
      "Đánh giá tương thích ứng dụng",
      "Xác nhận điều kiện cung ứng và hỗ trợ",
    ],
  },
  {
    id: "americas",
    name: "Châu Mỹ",
    description:
      "Ghi rõ địa điểm, ứng dụng và thời gian dự kiến. Mọi phương án được thống nhất theo từng yêu cầu.",
    topics: [
      "Phân tích nhu cầu tính toán và lưu trữ",
      "Trao đổi kế hoạch triển khai",
      "Làm rõ quy trình phối hợp kỹ thuật",
    ],
  },
];

export function contactPage({ icon, escape }) {
  const params = new URLSearchParams(location.search);
  const interest = params.get("interest") || "";
  const initialRegion = regions.find(
    (region) => region.name === params.get("region"),
  );
  return `${referenceHero({ id: "contact-title", title: "Liên hệ", subtitle: "Cùng trao đổi về bài toán của bạn", description: "AQPTech tư vấn, thiết kế và tích hợp các hệ thống máy chủ, lưu trữ, giám sát IP, AI và giải pháp OEM theo nhu cầu. Chia sẻ ứng dụng, thách thức và kế hoạch triển khai để cùng chúng tôi tìm ra nền tảng phù hợp cho doanh nghiệp." })}
  <section class="container contact-reference-layout" aria-label="Thông tin liên hệ và gửi yêu cầu">
    <aside class="contact-reference-info">
      <figure><img src="${companyImage}" alt="Minh họa môi trường doanh nghiệp ứng dụng công nghệ" width="980" height="653" loading="lazy"><figcaption>Hình ảnh minh họa, không phải địa chỉ văn phòng AQPTech.</figcaption></figure>
      <h2>Thông tin liên hệ</h2>
      <dl class="contact-details"><div>${icon("phone")}<div><dt>Điện thoại</dt><dd><a href="${companyContact.phoneHref}">${companyContact.phone}</a></dd></div></div><div>${icon("mail")}<div><dt>Email doanh nghiệp</dt><dd><a href="mailto:${companyContact.email}">${companyContact.email}</a></dd></div></div>${companyContact.offices.map((office) => `<div class="contact-office">${icon("map-pin")}<div><dt>${office.name}</dt><dd><address lang="${office.lang}">${office.address}</address></dd></div></div>`).join("")}</dl>
      <h3>Kết nối với AQPTech</h3><p>Liên hệ trực tiếp qua điện thoại, email hoặc gửi yêu cầu qua biểu mẫu bên cạnh để trao đổi cùng AQPTech.</p>
      <a class="contact-info-support" href="/support">${icon("headphones")}Hỗ trợ kỹ thuật & bảo hành${icon("arrow-up-right")}</a>
      <div class="contact-info-note">${icon("shield-check")}<p>Không gửi mật khẩu, khóa truy cập hay dữ liệu nhạy cảm. Thông tin yêu cầu không được công khai trên website.</p></div>
    </aside>
    <div class="contact-reference-form-column">
      <div class="contact-support-bar"><span>Cần hỗ trợ kỹ thuật?</span>${icon("arrow-right")}<a href="/support">Gửi yêu cầu hỗ trợ</a></div>
      <form class="contact-form contact-reference-form" data-api="contact">
        <h2>Liên hệ với chúng tôi</h2><p class="contact-required-note">Các trường có dấu <span>*</span> là bắt buộc.</p>
        <div class="contact-reference-fields">
          <fieldset class="contact-name-field"><legend>Họ và tên <span>*</span></legend><div class="contact-name-inputs"><label><span class="sr-only">Họ và tên đệm</span><input name="lastName" placeholder="Họ và tên đệm" autocomplete="family-name" maxlength="60" required></label><label><span class="sr-only">Tên</span><input name="firstName" placeholder="Tên" autocomplete="given-name" maxlength="50" required></label></div></fieldset>
          <label class="contact-field-full">Công ty <span>*</span><input name="company" autocomplete="organization" maxlength="200" required></label>
          <label>Email công việc <span>*</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label>
          <label>Số điện thoại<input name="phone" type="tel" autocomplete="tel" maxlength="40"></label>
          <label>Bạn quan tâm đến<input name="interest" list="interest-options" value="${escape(interest)}" maxlength="200" placeholder="Chọn hoặc nhập nhu cầu"><datalist id="interest-options">${[...products, ...services].map((item) => `<option value="${item.name}"></option>`).join("")}<option value="Hỗ trợ kỹ thuật"></option><option value="Hợp tác OEM"></option></datalist></label>
          <label>Khu vực dự kiến triển khai<select name="region" id="contact-region"><option value="">Chưa xác định</option>${regions.map((region) => `<option value="${region.name}"${initialRegion?.id === region.id ? " selected" : ""}>${region.name}</option>`).join("")}</select></label>
          <label class="contact-field-full">Nội dung yêu cầu <span>*</span><textarea name="message" rows="6" minlength="10" maxlength="5000" required></textarea></label>
        </div>
        <label class="consent"><input name="consent" type="checkbox" required><span>Tôi đồng ý để AQPTech xử lý thông tin nhằm tư vấn yêu cầu theo <a href="/privacy">chính sách riêng tư</a>.</span></label>
        <label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <button class="home-button" type="submit">Gửi yêu cầu</button><p class="form-status" role="status" aria-live="polite"></p>
        <p class="form-footnote">Yêu cầu được lưu trên hệ thống website. Đây không phải xác nhận báo giá, lịch triển khai hoặc email đã gửi.</p>
      </form>
    </div>
  </section>
  <section class="container contact-region-section" aria-labelledby="contact-region-title">
    <h2 id="contact-region-title">Kết nối cùng AQPTech</h2><p>Chọn khu vực dự kiến triển khai cho yêu cầu tư vấn. Điều kiện cung cấp, triển khai và hỗ trợ được xác nhận theo từng dự án.</p>
    <figure class="contact-worldmap">
      <p class="contact-map-loading" role="status">Đang tải bản đồ minh họa…</p>
      <svg class="contact-world-svg" viewBox="0 0 1000 560" role="img" aria-labelledby="contact-map-title contact-map-description"><title id="contact-map-title">Bản đồ khu vực dự kiến triển khai</title><desc id="contact-map-description">Bản đồ minh họa thế giới, không thể hiện mạng lưới văn phòng AQPTech.</desc><g id="contact-world-countries"></g></svg>
      <div class="contact-map-controls" role="group" aria-label="Điều khiển bản đồ"><button data-map-control="reset" aria-label="Đặt lại bản đồ">${icon("home")}</button><button data-map-control="in" aria-label="Phóng to bản đồ">${icon("plus")}</button><button data-map-control="out" aria-label="Thu nhỏ bản đồ">${icon("minus")}</button></div>
      <figcaption>Bản đồ minh họa khu vực dự kiến triển khai, không thể hiện địa điểm văn phòng. Dữ liệu: <a href="https://www.naturalearthdata.com/">Natural Earth</a>.</figcaption>
    </figure>
    <p class="contact-map-status" role="status" aria-live="polite"></p>
    <div class="contact-region-cards" role="group" aria-label="Chọn khu vực cho yêu cầu tư vấn">${regions.map((region) => `<section><h3>${region.name}</h3><p>${region.description}</p><ul>${region.topics.map((topic) => `<li>${topic}</li>`).join("")}</ul><button class="contact-region-choice" data-region-choice="${region.id}" aria-pressed="false">Chọn khu vực này${icon("arrow-up-right")}</button></section>`).join("")}</div>
  </section>`;
}

export async function setupContact({ escape }) {
  const map = document.querySelector(".contact-worldmap");
  const svg = map.querySelector("svg");
  const group = map.querySelector("#contact-world-countries");
  const field = document.querySelector("#contact-region");
  const status = document.querySelector(".contact-map-status");
  const choices = document.querySelectorAll("[data-region-choice]");
  let countryPaths = [];
  let zoom = 1,
    dx = 0,
    dy = 0,
    pointer = null;
  const updateRegion = () => {
    const selected = regions.find((region) => region.name === field.value);
    for (const button of choices)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.regionChoice === selected?.id),
      );
    for (const country of countryPaths)
      country.classList.toggle(
        "is-selected",
        country.dataset.region === selected?.id ||
          (selected?.id === "apac" && country.dataset.region === "vietnam"),
      );
    status.textContent = `${selected ? `Khu vực dự kiến: ${selected.name}.` : "Chưa chọn khu vực triển khai."} Thu phóng: ${Math.round(zoom * 100)}%.`;
    map.querySelector("#contact-map-description").textContent = selected
      ? `Khu vực dự kiến: ${selected.name}. Đây là lựa chọn cho yêu cầu tư vấn, không phải thông tin về văn phòng hoặc phạm vi dịch vụ đã xác nhận.`
      : "Bản đồ minh họa thế giới, không thể hiện mạng lưới văn phòng AQPTech.";
  };
  field.addEventListener("change", updateRegion);
  for (const button of choices)
    button.addEventListener("click", () => {
      const region = regions.find(
        (item) => item.id === button.dataset.regionChoice,
      );
      field.value = field.value === region.name ? "" : region.name;
      updateRegion();
    });
  field.form.addEventListener("reset", () => queueMicrotask(updateRegion));
  const updateMap = () => {
    dx = Math.max(-500 * (zoom - 1), Math.min(500 * (zoom - 1), dx));
    dy = Math.max(-280 * (zoom - 1), Math.min(280 * (zoom - 1), dy));
    group.setAttribute(
      "transform",
      `translate(${dx} ${dy}) translate(500 280) scale(${zoom}) translate(-500 -280)`,
    );
    svg.style.touchAction = zoom > 1 ? "none" : "pan-y";
    svg.classList.toggle("can-pan", zoom > 1);
    map.querySelector('[data-map-control="in"]').disabled = zoom >= 3;
    map.querySelector('[data-map-control="out"]').disabled = zoom <= 1;
    updateRegion();
  };
  map
    .querySelector(".contact-map-controls")
    .addEventListener("click", (event) => {
      const action =
        event.target.closest("[data-map-control]")?.dataset.mapControl;
      if (!action) return;
      if (action === "reset") {
        zoom = 1;
        dx = 0;
        dy = 0;
      } else
        zoom = Math.max(1, Math.min(3, zoom + (action === "in" ? 0.5 : -0.5)));
      updateMap();
    });
  svg.addEventListener("pointerdown", (event) => {
    if (zoom <= 1 || !event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    svg.setPointerCapture(event.pointerId);
    svg.classList.add("is-dragging");
  });
  svg.addEventListener("pointermove", (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    dx += ((event.clientX - pointer.x) * 1000) / svg.clientWidth;
    dy += ((event.clientY - pointer.y) * 560) / svg.clientHeight;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    updateMap();
  });
  const stopPan = () => {
    pointer = null;
    svg.classList.remove("is-dragging");
  };
  svg.addEventListener("pointerup", stopPan);
  svg.addEventListener("pointercancel", stopPan);
  updateMap();
  try {
    const [atlas, topology, geography] = await Promise.all([
      import("world-atlas/countries-110m.json"),
      import("topojson-client"),
      import("d3-geo"),
    ]);
    if (!map.isConnected) return;
    const countries = topology
      .feature(atlas.default, atlas.default.objects.countries)
      .features.filter((country) => Number(country.id) !== 10);
    const projection = geography.geoNaturalEarth1().fitExtent(
      [
        [10, 10],
        [990, 550],
      ],
      { type: "FeatureCollection", features: countries },
    );
    const draw = geography.geoPath(projection);
    const apac = new Set([
      4, 36, 50, 64, 96, 104, 116, 144, 156, 158, 242, 296, 356, 360, 392, 398,
      408, 410, 417, 418, 458, 462, 496, 520, 524, 548, 554, 583, 584, 585, 586,
      598, 608, 626, 702, 704, 762, 764, 776, 795, 798, 860, 882, 90,
    ]);
    const americas = new Set([
      28, 32, 44, 52, 68, 76, 84, 124, 152, 170, 188, 192, 212, 214, 218, 222,
      238, 304, 308, 320, 328, 332, 340, 388, 484, 558, 591, 600, 604, 659, 662,
      670, 740, 780, 840, 858, 862,
    ]);
    group.innerHTML = countries
      .map(
        (country) =>
          `<path class="contact-map-country" d="${draw(country) || ""}" data-region="${Number(country.id) === 704 ? "vietnam" : apac.has(Number(country.id)) ? "apac" : americas.has(Number(country.id)) ? "americas" : "emea"}"><title>${escape(country.properties.name || "")}</title></path>`,
      )
      .join("");
    countryPaths = [...group.querySelectorAll("path")];
    map.dataset.loaded = "true";
    map.querySelector(".contact-map-loading").hidden = true;
    updateMap();
  } catch {
    if (!map.isConnected) return;
    map.querySelector(".contact-map-loading").textContent =
      "Không thể tải bản đồ minh họa. Bạn vẫn có thể chọn khu vực và gửi yêu cầu qua biểu mẫu.";
  }
}
