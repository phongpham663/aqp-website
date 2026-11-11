import { referenceHero } from "./about.js";
import { images } from "./data.js";

const topics = [
  {
    icon: "headphones", title: "Hỗ trợ kỹ thuật", interest: "Hỗ trợ kỹ thuật",
    text: "Trao đổi về lỗi, cấu hình hoặc vấn đề vận hành của thiết bị và hệ thống đang sử dụng.",
  },
  {
    icon: "shield-check", title: "Bảo hành & bảo trì", interest: "Bảo hành & bảo trì",
    text: "Làm rõ điều kiện bảo hành, lịch bảo trì và phương án kiểm tra theo thiết bị, thỏa thuận dự án.",
  },
  {
    icon: "gauge", title: "Nâng cấp hệ thống", interest: "Nâng cấp hệ thống",
    text: "Chia sẻ hiện trạng để đánh giá khả năng mở rộng, hiệu năng và mức độ tương thích của nền tảng.",
  },
  {
    icon: "cpu", title: "Hỗ trợ hệ thống OEM", interest: "Hỗ trợ OEM",
    text: "Trao đổi yêu cầu kỹ thuật, vòng đời sản phẩm và kế hoạch cung ứng cho hệ thống theo dự án.",
  },
];

const preparation = [
  ["server", "Thiết bị & hệ thống", "Tên sản phẩm, model, số serial nếu có hoặc mô tả nền tảng đang sử dụng."],
  ["layers", "Phiên bản & cấu hình", "Phiên bản hệ điều hành, phần mềm, firmware và cấu hình có liên quan."],
  ["megaphone", "Dấu hiệu & ảnh hưởng", "Thông báo lỗi, thời điểm phát sinh, phạm vi ảnh hưởng và cách tái hiện nếu có."],
  ["settings-2", "Các bước đã thử", "Các kiểm tra hoặc thay đổi đã thực hiện, cùng kết quả ghi nhận."],
];

const questions = [
  ["information", "Cần cung cấp gì khi yêu cầu hỗ trợ?", "Hãy mô tả thiết bị hoặc hệ thống, số serial nếu có, phiên bản phần mềm, thông báo lỗi và các bước đã thử. Không gửi mật khẩu, khóa truy cập hay dữ liệu nhạy cảm qua biểu mẫu."],
  ["warranty", "Chính sách bảo hành được xác định như thế nào?", "Điều kiện bảo hành phụ thuộc vào thiết bị, nhà sản xuất và thỏa thuận dự án. Chính sách cụ thể cần được xác nhận trong báo giá, hợp đồng hoặc tài liệu bàn giao."],
  ["upgrades", "Có thể nâng cấp hệ thống hiện tại không?", "Khả năng nâng cấp phụ thuộc vào nền tảng phần cứng, công suất nguồn, khe mở rộng và mức độ tương thích phần mềm. AQPTech có thể tiếp nhận thông tin hiện trạng để tư vấn phương án."],
  ["oem", "AQPTech có hỗ trợ hệ thống OEM không?", "Các yêu cầu về hỗ trợ OEM, vòng đời sản phẩm và cung ứng cần được thống nhất theo từng dự án. Hãy mô tả sản phẩm và quy mô triển khai trong biểu mẫu liên hệ."],
];

export function supportPage({ icon }) {
  const contactUrl = `/contact?interest=${encodeURIComponent("Hỗ trợ kỹ thuật")}`;
  const steps = [
    ["Gửi yêu cầu", "Chia sẻ thông tin đã chuẩn bị qua biểu mẫu liên hệ của AQPTech."],
    ["Làm rõ bối cảnh", "Trao đổi hiện trạng, mục tiêu và các điều kiện cần kiểm tra thêm."],
    ["Thống nhất hướng xử lý", "Phương án, phạm vi và thời gian phối hợp được xác nhận theo từng yêu cầu."],
  ];

  return `${referenceHero({
    id: "support-title", title: "Hỗ trợ kỹ thuật",
    subtitle: "Hệ thống vận hành. Chúng tôi đồng hành.",
    description: "Tìm thông tin hỗ trợ cơ bản hoặc gửi yêu cầu cho hệ thống máy chủ, lưu trữ, giám sát IP, AI và nền tảng OEM. Bắt đầu từ hiện trạng rõ ràng để cùng làm rõ phương án xử lý phù hợp.",
    image: images.engineer, imageWidth: 980, imageHeight: 653,
    imageAlt: "Kỹ sư kiểm tra kết nối và cấu hình tại tủ thiết bị mạng, ảnh minh họa môi trường kỹ thuật",
    actions: `<div class="support-hero-actions"><a class="home-button" href="${contactUrl}">Gửi yêu cầu hỗ trợ${icon("arrow-up-right")}</a><a class="support-text-link" href="#support-faq">Xem câu hỏi thường gặp${icon("arrow-right")}</a></div>`,
  })}

  <section id="support-topics" class="container support-topics-section" aria-labelledby="support-topics-title"><nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><span aria-current="page">Hỗ trợ</span></nav><div class="support-section-heading" data-support-reveal><span class="industry-kicker">01 / NHU CẦU HỖ TRỢ</span><h2 id="support-topics-title" class="industry-section-title">Chọn hướng hỗ trợ phù hợp.</h2><p>Từ vận hành hằng ngày đến bảo hành và nâng cấp. Chọn nhu cầu để mở biểu mẫu với chủ đề được điền sẵn.</p></div><div class="support-topic-grid">${topics.map((topic, index) => `<a class="support-topic" href="/contact?interest=${encodeURIComponent(topic.interest)}" data-support-reveal style="--support-delay:${(index % 2) * 70}ms">${icon(topic.icon)}<div><h3>${topic.title}</h3><p>${topic.text}</p><span>Trao đổi nhu cầu${icon("arrow-up-right")}</span></div></a>`).join("")}</div></section>

  <section id="support-preparation" class="support-preparation" aria-labelledby="support-preparation-title"><div class="container support-preparation-layout"><div data-support-reveal><span class="industry-kicker">02 / TRƯỚC KHI LIÊN HỆ</span><h2 id="support-preparation-title" class="industry-section-title">Rõ thông tin.<br>Đúng hướng xử lý.</h2><p>Thông tin cụ thể giúp quá trình tiếp nhận và trao đổi hiệu quả hơn. Bạn có thể chuẩn bị những nội dung sau:</p><ul class="support-checklist" role="list">${preparation.map(([name, title, text]) => `<li>${icon(name)}<div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ul></div><div class="support-process-panel" data-support-reveal style="--support-delay:90ms"><h3>Từ thông tin đến phương án.</h3><ol class="support-process" role="list">${steps.map(([title, text], index) => `<li><span aria-hidden="true">0${index + 1}</span><div><h4>${title}</h4><p>${text}</p></div></li>`).join("")}</ol><aside class="support-safety-note" aria-label="Lưu ý bảo mật">${icon("shield-check")}<p>Không gửi mật khẩu, khóa truy cập, thông tin nhận diện hoặc dữ liệu nhạy cảm. Chỉ chia sẻ thông tin cần thiết và ẩn dữ liệu riêng tư trong ảnh chụp hoặc nhật ký lỗi.</p></aside><a class="support-text-link" href="${contactUrl}">Đã sẵn sàng? Gửi yêu cầu${icon("arrow-up-right")}</a></div></div></section>

  <section id="support-faq" class="container support-faq" aria-labelledby="support-faq-title"><div class="support-faq-intro" data-support-reveal><span class="industry-kicker">03 / CÂU HỎI THƯỜNG GẶP</span><h2 id="support-faq-title" class="industry-section-title">Làm rõ trước khi bắt đầu.</h2><p>Thông tin cơ bản về hỗ trợ, bảo hành, khả năng nâng cấp và hệ thống OEM.</p><a class="support-text-link" href="${contactUrl}">Trao đổi câu hỏi của bạn${icon("arrow-up-right")}</a></div><div class="support-faq-list" data-support-reveal>${questions.map(([id, title, text]) => `<details id="support-faq-${id}"><summary>${title}${icon("chevron-down")}</summary><div><p>${text}</p></div></details>`).join("")}</div></section>

  <section class="support-contact home-texture" aria-labelledby="support-contact-title"><div class="container support-contact-layout" data-support-reveal><div><span class="industry-kicker">KẾT NỐI CÙNG AQPTECH</span><h2 id="support-contact-title">Cần trao đổi về hệ thống của bạn?</h2><p>Chia sẻ thiết bị, hiện trạng và nhu cầu hỗ trợ. Cùng làm rõ hướng xử lý phù hợp cho hệ thống đang vận hành.</p></div><div class="support-contact-actions"><a class="home-button" href="${contactUrl}">Gửi yêu cầu hỗ trợ${icon("arrow-up-right")}</a><a class="support-text-link" href="/services#ps-stage-maintenance">Tìm hiểu bảo trì & hỗ trợ${icon("arrow-right")}</a></div></div><div class="container support-scope-note"><p>Phạm vi hỗ trợ, điều kiện bảo hành và thời gian phản hồi được xác nhận theo thiết bị và thỏa thuận dự án. Ảnh kỹ thuật dùng làm minh họa, không phải nhân sự hoặc cơ sở AQPTech.</p></div></section>`;
}

export function setupSupport() {
  const root = document.querySelector(".support-reference-page");
  const frame = requestAnimationFrame(() => {
    const target = document.getElementById(location.hash.slice(1));
    if (target && root.contains(target)) target.scrollIntoView({ behavior: "instant" });
  });
  let observer;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("support-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    root.querySelectorAll("[data-support-reveal]").forEach((element) => observer.observe(element));
  }
  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
  };
}
