import { referenceHero } from "./about.js";
import { products, solutions } from "./data.js";
const workImage = "/assets/watchtower/construction-site-security/images/construction-site-work.webp";
const consultationImage = "/assets/watchtower/construction-site-security/images/image.png";
const tower360 = "/assets/watchtower/construction-site-security/images/watchtower-360.webp";
const towerAI = "/assets/watchtower/construction-site-security/images/watchtower-ai.webp";
const towerMast = "/assets/watchtower/construction-site-security/images/watchtower-mast.webp";
const towerCelsius = "/assets/watchtower/construction-site-security/images/watchtower-celsius.webp";
const towerSolarThermal = "/assets/watchtower/construction-site-security/images/watchtower-solar-thermal.webp";
const towerBox = "/assets/watchtower/construction-site-security/images/watchtower-box.webp";
const towerAlarmkit = "/assets/watchtower/construction-site-security/images/watchtower-alarmkit.webp";
const towerPlan = "/assets/watchtower/construction-site-security/images/watchtower-security-plan.webp";

const systems = [
  {
    id: "360", name: "Camera cơ động 360 độ", image: tower360,
    alt: "Cột camera cơ động quan sát nhiều hướng trong tư liệu nguồn",
    brief: "Góc nhìn nhiều hướng trong một cấu hình cơ động, gọn để bố trí tại hiện trường.",
    detail: "Cấu hình tham khảo gồm năm camera và khung gọn cho góc nhìn 360 độ. Vị trí lắp đặt, vùng che khuất và khả năng quan sát thực tế cần được khảo sát; không mặc định không có điểm mù.",
    use: "Khu vực tập kết vật tư, lối vào hoặc điểm cần quan sát nhiều hướng.",
  },
  {
    id: "ai", name: "Giám sát tích hợp AI", image: towerAI,
    alt: "Ảnh công trường về đêm dùng minh họa giám sát tích hợp AI",
    brief: "Phân tích video để hỗ trợ ưu tiên và xác minh cảnh báo.",
    detail: "Nguồn giới thiệu phân tích video tại hiện trường nhằm giảm cảnh báo sai. Cần kiểm thử với người, xe, thời tiết, ánh sáng và lịch làm việc thực tế; AI không tự kết luận hành vi trộm cắp hoặc thay thế người xác minh.",
    use: "Vùng hạn chế, chu vi hoặc khu vực cần phân loại sự kiện để kiểm tra.",
  },
  {
    id: "mast", name: "Cột camera cơ động", image: towerMast,
    alt: "Cụm camera trên cột giám sát cơ động",
    brief: "Cột camera di động cho các vị trí cần triển khai giám sát tạm thời.",
    detail: "Mô hình cột camera cơ động giúp bố trí giám sát theo tiến độ công trình. Chiều cao, nền đặt thiết bị, nguồn điện, đường truyền và việc di chuyển cần được xác nhận trong phương án triển khai.",
    use: "Công trường thay đổi mặt bằng hoặc dự án cần hệ thống có thể di chuyển.",
  },
  {
    id: "celsius", name: "Giám sát biến đổi nhiệt", image: towerCelsius,
    alt: "Ảnh cơ sở xử lý vật liệu dùng minh họa giám sát biến đổi nhiệt",
    brief: "Theo dõi biến đổi nhiệt và hỗ trợ cảnh báo bất thường.",
    detail: "Mô hình tham khảo theo dõi tích tụ nhiệt, tăng nhiệt nhanh và dấu hiệu khói hoặc cháy. Cần xác nhận cảm biến, điều kiện đo, ngưỡng và quy trình xử lý; giải pháp này không thay thế hệ thống báo cháy được chứng nhận.",
    use: "Khu vực vật liệu, thiết bị hoặc điểm cần đánh giá nguy cơ nhiệt.",
  },
  {
    id: "solar", name: "Giám sát dùng năng lượng mặt trời", image: towerSolarThermal,
    alt: "Ảnh khu điện mặt trời dùng minh họa giám sát với nguồn năng lượng độc lập",
    brief: "Giám sát cơ động sử dụng năng lượng mặt trời, tham khảo cho nơi thiếu điện lưới.",
    detail: "Mô tả riêng của sản phẩm nguồn xác nhận cột camera dùng tấm pin năng lượng mặt trời cho vận hành ngoài lưới. Điều kiện nắng, dung lượng pin, thời gian tự chủ và nguồn dự phòng cần được kiểm tra; không cam kết tự chủ năng lượng trong mọi điều kiện.",
    use: "Vị trí chưa có điện lưới hoặc cần đánh giá phương án cấp nguồn độc lập.",
  },
  {
    id: "box", name: "Thiết bị giám sát nhỏ gọn", image: towerBox,
    alt: "Thiết bị giám sát nhỏ gọn lắp gần container công trường",
    brief: "Thiết bị gọn với nhiều cách lắp đặt cho không gian hạn chế.",
    detail: "Nguồn mô tả khả năng bố trí trong nhà hoặc ngoài trời, trên giàn giáo, container, cột đèn hoặc vị trí phù hợp. Tải trọng, điểm gá, góc nhìn và điều kiện môi trường phải được đánh giá trước khi lắp.",
    use: "Giàn giáo, container, lối đi hẹp hoặc vị trí khó đặt cột camera.",
  },
  {
    id: "alarmkit", name: "Bộ báo động không dây", image: towerAlarmkit,
    alt: "Bộ thiết bị báo động không dây dùng cho khu vực tạm thời",
    brief: "Báo động không dây cho phòng kín và các khu vực tạm thời.",
    detail: "Bộ báo động trong nguồn hướng đến các phòng khóa kín hoặc nhu cầu bảo vệ tạm thời. Cần xác nhận loại cảm biến, phạm vi kết nối, pin, đường truyền báo động và người nhận sự kiện.",
    use: "Phòng kỹ thuật, văn phòng công trường hoặc kho vật tư tạm.",
  },
  {
    id: "thermal", name: "Giám sát chu vi bằng ảnh nhiệt", image: towerSolarThermal,
    alt: "Ảnh khu điện mặt trời dùng minh họa giám sát khu vực rộng bằng ảnh nhiệt",
    brief: "Tham khảo giám sát khu vực rộng và chu vi bằng ảnh nhiệt.",
    detail: "Giám sát ảnh nhiệt cần lựa chọn cảm biến, ống kính, góc đặt và tiêu chí phát hiện phù hợp. Phạm vi và cấu hình trong nguồn có thông tin không nhất quán, nên không sử dụng các con số đó làm thông số hoặc cam kết của AQPTech.",
    use: "Chu vi dài hoặc khu vực cần đánh giá khả năng quan sát trong điều kiện thiếu sáng.",
  },
  {
    id: "plan", name: "Khảo sát & lập phương án an ninh", image: towerPlan,
    alt: "Nhân sự khảo sát hiện trường trong tư liệu tham khảo",
    brief: "Khảo sát, đánh giá rủi ro và xây dựng phương án riêng.",
    detail: "Khung tham khảo bắt đầu từ khảo sát địa điểm và phân tích rủi ro. Phương án cần làm rõ vùng ưu tiên, lịch theo dõi, trách nhiệm xác minh, đầu mối ứng phó và cách điều chỉnh theo từng giai đoạn thi công.",
    use: "Dự án cần phối hợp thiết bị, quy trình và nhân sự trong một kế hoạch thống nhất.",
  },
];

const features = [
  ["cctv", "Camera CCTV cơ động", "Bố trí camera theo mặt bằng và giai đoạn thi công. Phân tích video hỗ trợ phát hiện sự kiện cần kiểm tra."],
  ["headphones", "Theo dõi & xử lý cảnh báo", "Phương án có thể kết nối trung tâm giám sát 24/7. Đơn vị trực, lịch theo dõi và trách nhiệm xử lý phải được xác nhận trong SLA, không mặc định do AQPTech cung cấp."],
  ["compass", "Lắp đặt linh hoạt", "Cân nhắc cột camera, thiết bị gắn container hoặc vị trí có sẵn cho dự án ngắn hạn và dài hạn. Khảo sát nguồn điện, kết nối và nền đặt trước khi triển khai."],
  ["shield-check", "Giảm cảnh báo sai có kiểm chứng", "Kết hợp phân tích video với người xác minh và kiểm thử tại hiện trường. Không cam kết loại bỏ hoàn toàn cảnh báo sai hoặc phát hiện mọi sự cố."],
];

const questions = [
  ["costs", "Chi phí bảo vệ công trường được tính như thế nào?", "Chi phí phụ thuộc diện tích, thời gian triển khai, số điểm quan sát, điều kiện nguồn điện và kết nối, cũng như phạm vi theo dõi và xử lý cảnh báo. Cần khảo sát và thống nhất yêu cầu trước khi lập đề xuất; biểu mẫu này không phải báo giá hoặc xác nhận lịch triển khai."],
  ["importance", "Vì sao cần bảo vệ công trường?", "Vật tư, máy móc và khu vực thi công có thể đối mặt với trộm cắp, phá hoại hoặc ra vào trái phép, ảnh hưởng chi phí và tiến độ. Giám sát kết hợp quy trình hiện trường giúp giảm rủi ro, nhưng không bảo đảm ngăn chặn mọi sự cố. Quyền lợi bảo hiểm phải đối chiếu hợp đồng cụ thể."],
  ["equipment", "Dùng thiết bị nào để giám sát công trường?", "Các nhóm giải pháp phía trên minh họa những hướng như cột camera cơ động, thiết bị gọn gắn tại chỗ, báo động không dây và ảnh nhiệt. Thiết bị thực tế được lựa chọn theo vùng cần bảo vệ, điều kiện môi trường và yêu cầu tích hợp; đây không phải xác nhận AQPTech phân phối mọi cấu hình minh họa."],
  ["connection", "Camera kết nối với trung tâm giám sát như thế nào?", "Camera có thể dùng kết nối 4G/5G để truyền video và hỗ trợ theo dõi từ xa. Trong từng dự án cần đánh giá vùng phủ sóng, băng thông, mã hóa, phân quyền và phương án khi mất mạng. Kiến trúc kết nối, đơn vị giám sát và thời gian phản hồi phải được xác nhận riêng."],
];

export function constructionSecurityPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "construction-site-security");
  const contactUrl = `/contact?interest=${encodeURIComponent(solution.name)}`;
  const related = [
    ["products", products.find((item) => item.slug === "intelligent-video-analytics")],
    ["solutions", solutions.find((item) => item.slug === "gates-access")],
    ["products", products.find((item) => item.slug === "veolink")],
  ];

  return `${referenceHero({
    id: "construction-security-title", title: solution.name,
    subtitle: "Giám sát cơ động. Bảo vệ theo từng giai đoạn.",
    description: solution.description, image: solution.image,
    imageAlt: "Công trường với máy đào và cột camera cơ động, ảnh dùng làm tư liệu tham khảo",
    imageWidth: 1920, imageHeight: 1280,
    actions: `<div class="industry-hero-actions"><a class="home-button" href="#cs-consultation">Trao đổi phương án${icon("arrow-up-right")}</a><a class="industry-video-link" href="#cs-systems">Khám phá giải pháp${icon("arrow-right")}</a></div>`,
  })}
  <nav class="industry-section-nav cs-section-nav" aria-label="Nội dung giải pháp an ninh công trường"><div class="container" style="--industry-nav-count:4">${[["approach", "Phương án bảo vệ"], ["systems", "Giải pháp tham khảo"], ["consultation", "Yêu cầu tư vấn"], ["faq", "Câu hỏi thường gặp"]].map(([id, text], index) => `<a href="#cs-${id}"><span>0${index + 1}</span>${text}${icon("arrow-right")}</a>`).join("")}</div></nav>

  <section class="container industry-overview" aria-labelledby="cs-overview-title"><nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/solutions">Giải pháp</a><span aria-hidden="true">/</span><span aria-current="page">${solution.name}</span></nav><span class="industry-kicker" lang="en">${solution.label}</span><h2 id="cs-overview-title" class="industry-section-title">Bảo vệ tài sản. Giữ nhịp công trình.</h2><div class="industry-overview-grid"><p>Công trường thay đổi mỗi ngày, nhưng vật tư, máy móc và khu vực thi công vẫn cần được bảo vệ. Trộm cắp và phá hoại có thể làm tăng chi phí, gián đoạn công việc và ảnh hưởng tiến độ. Phương án giám sát cần đi cùng lịch thi công, mặt bằng và quy trình của đội vận hành.</p><p>Với mô hình camera cơ động, AQPTech tiếp cận từ tư vấn kiến trúc, kết nối và khả năng tích hợp. Theo dõi 24/7, trung tâm giám sát và lực lượng ứng phó là các phần việc cần được xác nhận riêng theo phạm vi dự án và SLA.</p></div></section>

  <section id="cs-approach" class="cs-approach" aria-labelledby="cs-approach-title"><div class="container">
    <div class="cs-story"><div class="cs-story-copy" data-cs-reveal><span class="industry-kicker">01 / PHƯƠNG ÁN BẢO VỆ</span><h2 id="cs-approach-title" class="industry-section-title">Nhìn bao quát. Triển khai linh hoạt.</h2><ul class="cs-feature-list" role="list">${features.map(([name, title, text]) => `<li>${icon(name)}<div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ul><a class="home-button" href="#cs-consultation">Chia sẻ yêu cầu công trường${icon("arrow-up-right")}</a></div><figure class="cs-media" data-cs-reveal><img src="${workImage}" alt="Nhân sự làm việc tại khu vực thi công, ảnh dùng làm tư liệu tham khảo" width="960" height="640" loading="lazy"></figure></div>
    <div class="cs-story cs-story-reverse"><figure class="cs-media" data-cs-reveal><img src="${consultationImage}" alt="Nhân sự ghi chép khảo sát bên trạm an ninh công trường màu đỏ và trắng" width="1535" height="1024" loading="lazy"></figure><div class="cs-story-copy" data-cs-reveal><span class="industry-kicker">TỪ HIỆN TRƯỜNG ĐẾN QUY TRÌNH</span><h2 class="industry-section-title">Một công trường. Một phương án phù hợp.</h2><p>Camera chỉ là một phần của kế hoạch. Cần xác định vùng ưu tiên, nguồn điện, đường truyền, lịch làm việc và người nhận cảnh báo. Khi mặt bằng thi công thay đổi, vị trí thiết bị và kịch bản theo dõi cũng cần được rà soát.</p><p>Thiết bị cơ động và cấu hình gọn có thể hỗ trợ bố trí linh hoạt. Hiệu quả, chi phí và thời gian triển khai phụ thuộc điều kiện thực tế; không mặc định luôn rẻ hơn phương án khác hoặc bảo đảm tiến độ dự án.</p><div class="cs-operating-flow" role="group" aria-label="Quy trình xử lý cảnh báo"><span>Phát hiện</span>${icon("arrow-right")}<span>Xác minh</span>${icon("arrow-right")}<span>Phối hợp</span></div><a class="cs-inline-link" href="${contactUrl}">Trao đổi về hiện trường của bạn${icon("arrow-up-right")}</a></div></div>
  </div></section>

  <section id="cs-systems" class="cs-systems" aria-labelledby="cs-systems-title"><div class="container"><span class="industry-kicker">02 / GIẢI PHÁP THAM KHẢO</span><h2 id="cs-systems-title" class="industry-section-title">Chọn cấu hình theo bài toán hiện trường.</h2><p class="cs-systems-lead">Chín nhóm giải pháp dưới đây giúp hình dung các phương án giám sát, không phải danh mục sản phẩm AQPTech đã xác nhận phân phối. Khả năng cung cấp, cấu hình và tích hợp cần được đánh giá theo từng dự án.</p><div class="cs-system-list" role="group" aria-label="Chín nhóm giải pháp giám sát công trường">${systems.map((system, index) => `<details class="cs-system" id="cs-system-${system.id}" data-cs-reveal><summary><span class="cs-system-thumb"><img src="${system.image}" alt="${system.alt}" width="480" height="300" loading="lazy"></span><span class="cs-system-summary"><span class="cs-system-number" aria-hidden="true">0${index + 1} / 09</span><strong class="cs-system-name">${system.name}</strong><span class="cs-system-description">${system.brief}</span></span><span class="cs-system-action">Xem chi tiết<span class="sr-only">: ${system.name}</span>${icon("chevron-down")}</span></summary><div class="cs-system-content"><p>${system.detail}</p><dl><dt>Ứng dụng tham khảo</dt><dd>${system.use}</dd></dl><a class="cs-inline-link" href="/contact?interest=${encodeURIComponent(`${solution.name} - ${system.name}`)}">Trao đổi cấu hình này${icon("arrow-up-right")}</a></div></details>`).join("")}</div><p class="cs-source-note">Tư liệu nguồn có mô tả giám sát dùng năng lượng mặt trời trùng với giám sát ảnh nhiệt; phần năng lượng mặt trời ở đây dùng mô tả riêng đã lưu về nguồn cấp bằng tấm pin. Hai mục cũng dùng chung ảnh minh họa trong nguồn. Các thông số phạm vi giám sát và cấu hình ảnh nhiệt cần được đối chiếu tài liệu kỹ thuật, không suy ra từ ảnh này.</p></div></section>

  <section id="cs-consultation" class="cs-consultation" aria-labelledby="cs-consultation-title"><div class="container cs-consultation-layout"><div><span class="industry-kicker">03 / YÊU CẦU TƯ VẤN</span><h2 id="cs-consultation-title" class="industry-section-title">Mỗi công trường. Một phương án riêng.</h2><p>Chia sẻ hiện trạng và nhu cầu để cùng làm rõ hướng triển khai. Những thông tin hữu ích khi bắt đầu:</p><ul class="cs-quote-checklist" role="list"><li>Diện tích, mặt bằng và giai đoạn thi công.</li><li>Vật tư, thiết bị và các vùng cần ưu tiên.</li><li>Nguồn điện, kết nối và lịch theo dõi dự kiến.</li></ul><p>Không gửi mật khẩu, khóa truy cập, hình ảnh nhận diện hoặc dữ liệu nhạy cảm qua biểu mẫu. Phạm vi giám sát, nhân sự ứng phó và SLA sẽ được xác nhận trong đề xuất.</p><a class="cs-inline-link" href="${contactUrl}">Mở trang liên hệ AQPTech${icon("arrow-up-right")}</a></div>
    <form class="cs-quote-form" data-api="contact"><h3>Gửi yêu cầu dự án</h3><p class="cs-required-note">Các trường có dấu * là bắt buộc.</p><div class="cs-form-fields"><label><span>Họ và tên đệm <b aria-hidden="true">*</b></span><input name="lastName" autocomplete="family-name" maxlength="60" required></label><label><span>Tên <b aria-hidden="true">*</b></span><input name="firstName" autocomplete="given-name" maxlength="50" required></label><label class="cs-field-full"><span>Công ty <b aria-hidden="true">*</b></span><input name="company" autocomplete="organization" maxlength="200" required></label><label><span>Email công việc <b aria-hidden="true">*</b></span><input name="email" type="email" autocomplete="email" maxlength="254" required></label><label><span>Số điện thoại</span><input name="phone" type="tel" autocomplete="tel" maxlength="40"></label><label class="cs-field-full"><span>Nhu cầu bảo vệ công trường <b aria-hidden="true">*</b></span><textarea name="message" rows="5" minlength="10" maxlength="5000" required></textarea></label></div><input type="hidden" name="interest" value="${solution.name}"><label class="consent"><input name="consent" type="checkbox" required><span>Tôi đồng ý để AQPTech xử lý thông tin nhằm tư vấn yêu cầu theo <a href="/privacy">chính sách riêng tư</a>.</span></label><label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><button class="home-button" type="submit">Gửi yêu cầu${icon("arrow-up-right")}</button><p class="form-status" role="status" aria-live="polite"></p><p class="cs-form-footnote">Yêu cầu được lưu trên hệ thống website. Đây không phải xác nhận báo giá, lịch triển khai hoặc email đã gửi.</p></form>
  </div></section>

  <section id="cs-faq" class="container cs-faq" aria-labelledby="cs-faq-title"><div><span class="industry-kicker">04 / CÂU HỎI THƯỜNG GẶP</span><h2 id="cs-faq-title" class="industry-section-title">Làm rõ trước khi triển khai.</h2><p>Các câu trả lời làm rõ hướng triển khai và điều kiện áp dụng theo từng dự án.</p><a class="cs-inline-link" href="#cs-consultation">Trao đổi câu hỏi của bạn${icon("arrow-up-right")}</a></div><div class="cs-faq-list">${questions.map(([id, question, answer]) => `<details id="cs-faq-${id}"><summary>${question}${icon("chevron-down")}</summary><div><p>${answer}</p></div></details>`).join("")}</div></section>

  <section class="container cs-related" aria-labelledby="cs-related-title"><span class="industry-kicker">KẾT NỐI NĂNG LỰC AQPTECH</span><h2 id="cs-related-title" class="industry-section-title">Từ giám sát đến điều hành.</h2><div class="cs-related-grid">${related.map(([type, item]) => `<a href="/${type}/${item.slug}" data-cs-reveal>${icon(item.icon)}<h3>${item.menuName || item.name}</h3><p>${item.description}</p><span>Khám phá ${type === "products" ? "sản phẩm" : "giải pháp"}${icon("arrow-up-right")}</span></a>`).join("")}</div></section>
  <div class="container cs-resources"><a class="cs-inline-link" href="https://wt-security.com/en-gb/application/construction-site-security" target="_blank" rel="noopener noreferrer">Nguồn: Tư liệu an ninh công trường<span class="sr-only"> (tiếng Anh, mở tab mới)</span>${icon("arrow-up-right")}</a></div>`;
}

export function setupConstructionSecurity() {
  const root = document.querySelector(".construction-security-page");
  const frame = requestAnimationFrame(() => {
    const target = document.getElementById(location.hash.slice(1));
    if (target && root.contains(target)) target.scrollIntoView({ behavior: "instant" });
  });
  let observer;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("cs-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -24px 0px" });
    root.querySelectorAll("[data-cs-reveal]").forEach((element) => observer.observe(element));
  }
  return () => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
  };
}
