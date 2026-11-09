import { referenceHero } from "./about.js";
import { services } from "./data.js";
import heroImage from "../assets/magal/images/Masked-image--0237b30221.webp";
import "./professional-services.css";

const lifecycle = [
  {
    id: "planning", short: "Tư vấn & lập kế hoạch", icon: "compass",
    title: "Tư vấn, đánh giá & lập kế hoạch",
    label: "Consultation, Assessment & Planning",
    description: "Hiểu hiện trạng, xác định rủi ro và thống nhất mục tiêu trước khi lựa chọn giải pháp.",
    tasks: [
      "Khảo sát hiện trường và phân tích rủi ro.",
      "Nghiên cứu khả thi và thiết kế giải pháp sơ bộ.",
      "Xác định phương án vận hành tổng thể tại cơ sở (CONOPS).",
      "Lập kế hoạch ngân sách.",
      "Đánh giá yêu cầu tuân thủ và quy định liên quan.",
    ],
    deliverable: "Phạm vi dự án, phương án sơ bộ và ngân sách dự kiến.",
  },
  {
    id: "engineering", short: "Kỹ thuật & thiết kế", icon: "network",
    title: "Kỹ thuật & thiết kế hệ thống",
    label: "Engineering & System Design",
    description: "Kết nối các chuyên ngành và công nghệ trong một kiến trúc có thể triển khai, quản trị và mở rộng.",
    tasks: [
      "Thiết kế liên ngành: xây dựng, điện, IT, cơ khí theo phạm vi dự án.",
      "Xây dựng chiến lược tích hợp công nghệ.",
      "Lập kiến trúc mạng và kế hoạch hạ tầng.",
      "Tích hợp hệ thống của bên thứ ba.",
      "Thiết kế an ninh mạng và bảo mật dữ liệu.",
      "Phát triển chi tiết phương án vận hành CONOPS.",
    ],
    deliverable: "Thiết kế kỹ thuật, kiến trúc mạng và kịch bản vận hành.",
  },
  {
    id: "procurement", short: "Cung ứng & tích hợp", icon: "truck",
    title: "Thu mua & tích hợp hệ thống",
    label: "Procurement & System Integration",
    description: "Đưa thiết kế thành kế hoạch cung ứng rõ ràng, đồng bộ thiết bị và phối hợp các nhà cung cấp.",
    tasks: [
      "Lựa chọn nguồn cung chiến lược.",
      "Quản lý và phối hợp nhà cung cấp.",
      "Điều phối logistics, giao nhận và chuỗi cung ứng.",
    ],
    deliverable: "Danh mục thiết bị, phương án cung ứng và kế hoạch giao nhận.",
  },
  {
    id: "implementation", short: "Triển khai & kiểm thử", icon: "settings-2",
    title: "Lắp đặt, triển khai & đưa vào vận hành",
    label: "Installation, Implementation & Commissioning",
    description: "Từ cấu hình trước đến kiểm thử tại hiện trường, mỗi thành phần được đánh giá trong hệ thống tổng thể.",
    tasks: [
      "Quản lý thi công tại hiện trường theo phạm vi dự án.",
      "Tích hợp giải pháp từ nhiều nhà cung cấp.",
      "Lắp ráp hệ thống và cấu hình trước khi triển khai.",
      "Đảm bảo chất lượng (QA), kiểm thử và xác nhận kết quả.",
      "Đánh giá mức độ sẵn sàng trước khi đưa vào vận hành.",
    ],
    deliverable: "Kết quả kiểm thử và kế hoạch đưa hệ thống vào vận hành.",
  },
  {
    id: "handover", short: "Bàn giao & đào tạo", icon: "graduation-cap",
    title: "Bàn giao, đào tạo & chuyển giao kiến thức",
    label: "Handover, Training & Knowledge Transfer",
    description: "Bàn giao không chỉ là thiết bị. Đội ngũ cần tài liệu, quy trình và kiến thức để chủ động vận hành.",
    tasks: [
      "Kiểm thử nghiệm thu tại hiện trường (SAT).",
      "Đào tạo tại chỗ và từ xa theo nhu cầu.",
      "Xây dựng hướng dẫn vận hành, quy trình SOP và tài liệu.",
      "Xác nhận năng lực, chứng nhận người dùng và đội bảo trì theo phạm vi được duyệt.",
    ],
    deliverable: "Biên bản nghiệm thu, bộ tài liệu và kế hoạch đào tạo.",
  },
  {
    id: "maintenance", short: "Bảo trì & hỗ trợ", icon: "headphones",
    title: "Bảo trì, hỗ trợ & quản lý vòng đời",
    label: "Maintenance, Support & Lifecycle Management",
    description: "Duy trì tính liên tục sau triển khai bằng kế hoạch bảo trì, đầu mối hỗ trợ và trách nhiệm được thống nhất.",
    tasks: [
      "Hỗ trợ sau triển khai và thỏa thuận mức dịch vụ (SLA).",
      "Bảo trì phòng ngừa và khắc phục sự cố.",
      "Quản lý logistics và linh kiện thay thế.",
      "Hỗ trợ kỹ thuật 24/7 theo SLA đã được xác nhận.",
    ],
    deliverable: "Kế hoạch bảo trì, đầu mối hỗ trợ và SLA được thống nhất.",
  },
  {
    id: "upgrades", short: "Nâng cấp & mở rộng", icon: "chart-no-axes-combined",
    title: "Định hướng tương lai & nâng cấp hệ thống",
    label: "Future-Proofing & System Upgrades",
    description: "Chuẩn bị cho những yêu cầu mới bằng đánh giá định kỳ, nâng cấp có lộ trình và phản hồi từ thực tế vận hành.",
    tasks: [
      "Kiểm tra tình trạng hệ thống và đánh giá hiệu năng định kỳ.",
      "Nâng cấp công nghệ và tích hợp các giải pháp mới.",
      "Lập kế hoạch cải tạo và mở rộng hệ thống.",
      "Tiếp nhận phản hồi để tối ưu vận hành liên tục.",
    ],
    deliverable: "Lộ trình nâng cấp theo năng lực hệ thống và mục tiêu phát triển mới.",
  },
];

export function professionalServicesPage({ icon }) {
  const contactUrl = `/contact?interest=${encodeURIComponent("Professional Services - Tư vấn vòng đời dự án")}`;
  const pillars = [
    ["Đổi mới có mục tiêu", "Lựa chọn công nghệ từ bài toán thực tế, không chỉ từ danh sách thiết bị."],
    ["Tích hợp đồng bộ", "Kết nối phần cứng, phần mềm và quy trình trong một hệ thống nhất quán."],
    ["Vận hành dài hạn", "Tính đến đào tạo, bảo trì và khả năng nâng cấp ngay từ giai đoạn thiết kế."],
  ];

  return `${referenceHero({
    id: "professional-services-title",
    title: "Professional Services",
    subtitle: "Không chỉ triển khai. Đồng hành dài hạn.",
    description: "AQPTech kết nối chuyên môn kỹ thuật, tư duy đổi mới và năng lực tích hợp để xây dựng giải pháp theo vòng đời dự án. Từ khảo sát ban đầu đến triển khai, bàn giao và hỗ trợ vận hành, mỗi giai đoạn đều được làm rõ theo nhu cầu của doanh nghiệp.",
    image: heroImage,
    imageAlt: "Ảnh minh họa nhân sự trực hệ thống tại phòng điều hành, tham khảo từ Magal Solutions",
    imageWidth: 939,
    imageHeight: 969,
    actions: `<div class="ps-hero-actions"><a class="home-button" href="${contactUrl}">Trao đổi dự án${icon("arrow-up-right")}</a><a class="ps-text-link" href="#ps-lifecycle">Khám phá 7 giai đoạn${icon("arrow-right")}</a></div>`,
  })}

  <section class="container ps-overview" aria-labelledby="ps-overview-title">
    <nav class="ps-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><span aria-current="page">Dịch vụ chuyên nghiệp</span></nav>
    <span class="ps-kicker">DỊCH VỤ CHUYÊN NGHIỆP</span>
    <div class="ps-intro-grid"><h2 id="ps-overview-title">Từ kế hoạch đầu tiên<br>đến giá trị dài hạn.</h2><div><p>Một dự án không kết thúc khi hệ thống được bật lên. Thiết kế, cung ứng, triển khai và hỗ trợ cần được nhìn như những phần nối tiếp của cùng một hành trình.</p><p>Tham khảo cách tiếp cận vòng đời dự án của Magal Solutions, AQPTech kết nối các giai đoạn với nhu cầu hạ tầng, tích hợp và OEM của doanh nghiệp. Phạm vi và trách nhiệm được thống nhất riêng cho từng dự án.</p></div></div>
    <div class="ps-pillars">${pillars.map(([title, text], index) => `<article class="ps-pillar" data-ps-reveal style="--ps-delay:${index * 70}ms"><span>0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>
  </section>

  <section id="ps-lifecycle" class="ps-lifecycle" aria-labelledby="ps-lifecycle-title"><div class="container">
    <div class="ps-lifecycle-layout">
      <aside class="ps-lifecycle-aside">
        <span class="ps-kicker" lang="en">OUR PROJECT LIFECYCLE APPROACH</span>
        <h2 id="ps-lifecycle-title">Một hành trình.<br>Bảy giai đoạn kết nối.</h2>
        <p>Từ việc hiểu nhu cầu đến duy trì và mở rộng hệ thống. Khám phá từng giai đoạn hoặc chọn phần bạn quan tâm.</p>
        <div class="ps-read-state" aria-label="Giai đoạn đang đọc"><span>GIAI ĐOẠN ĐANG ĐỌC</span><strong data-ps-current>01</strong><small>/ 07</small></div>
        <nav class="ps-stage-nav" aria-label="Các giai đoạn trong vòng đời dự án">${lifecycle.map((stage, index) => `<a href="#ps-stage-${stage.id}" data-ps-stage-link${index === 0 ? ' class="is-current" aria-current="step"' : ""}><span class="ps-nav-number">0${index + 1}</span><span>${stage.short}</span></a>`).join("")}</nav>
        <a class="ps-text-link" href="${contactUrl}">Bắt đầu từ dự án của bạn${icon("arrow-up-right")}</a>
      </aside>
      <ol class="ps-stages" role="list">${lifecycle.map((stage, index) => `<li id="ps-stage-${stage.id}" class="ps-stage${index === 0 ? " is-current" : ""}" data-ps-stage aria-labelledby="ps-stage-${stage.id}-title"><div class="ps-stage-body" data-ps-reveal>
        <div class="ps-stage-header"><span class="ps-stage-number" aria-hidden="true">0${index + 1}</span><span class="ps-stage-icon">${icon(stage.icon)}</span></div>
        <span class="ps-stage-label" lang="en">${stage.label}</span><h3 id="ps-stage-${stage.id}-title">${stage.title}</h3><p class="ps-stage-description">${stage.description}</p>
        <ul class="ps-stage-checks" role="list">${stage.tasks.map((task) => `<li>${icon("check")}<span>${task}</span></li>`).join("")}</ul>
        <div class="ps-stage-deliverable"><span>ĐẦU RA ĐỀ XUẤT</span><p>${stage.deliverable}</p></div>
      </div></li>`).join("")}</ol>
    </div>
    <div class="ps-scope-note">${icon("shield-check")}<p>Khung 7 giai đoạn được tham khảo từ Magal Solutions; các đầu ra là đề xuất để thảo luận theo dự án. Phần việc chuyên ngành, thi công, chứng nhận và hỗ trợ 24/7 chỉ được triển khai khi đã xác nhận phạm vi, đơn vị thực hiện phù hợp và thỏa thuận dịch vụ.</p></div>
  </div></section>

  <section class="container ps-services" aria-labelledby="ps-services-title"><span class="ps-kicker">NĂNG LỰC AQPTECH</span><h2 id="ps-services-title">Giải pháp cho từng bài toán.</h2><p>Kết nối cách tiếp cận vòng đời với các nhóm dịch vụ hiện có của AQPTech.</p><div class="ps-service-grid">${services.map((service, index) => `<a class="ps-service-card" href="/services/${service.slug}" data-ps-reveal style="--ps-delay:${index * 70}ms">${icon(service.icon)}<span class="ps-service-tag" lang="en">${service.tag}</span><h3>${service.name}</h3><p>${service.description}</p><span class="ps-service-link">Khám phá dịch vụ${icon("arrow-up-right")}</span></a>`).join("")}</div></section>

  <section class="ps-commitment" aria-labelledby="ps-commitment-title"><div class="container ps-commitment-grid"><div><span class="ps-kicker">ĐỒNG HÀNH VỀ CHẤT LƯỢNG</span><h2 id="ps-commitment-title">Dự án hôm nay.<br>Giá trị cho ngày mai.</h2><div class="ps-commitment-actions"><a class="home-button" href="${contactUrl}">Cùng xây dựng dự án${icon("arrow-up-right")}</a><a class="ps-text-link" href="/support">Tìm hiểu hỗ trợ${icon("arrow-right")}</a></div></div><div><p>Đổi mới, tích hợp và hiệu quả vận hành là nền tảng của một giải pháp có giá trị dài hạn. Chúng tôi hướng đến việc kết nối toàn bộ hành trình, từ đánh giá ban đầu đến triển khai và hỗ trợ sau bàn giao.</p><p>Chia sẻ hiện trạng hệ thống, mục tiêu và kế hoạch của doanh nghiệp để cùng làm rõ phương án phù hợp. Không gửi mật khẩu, khóa truy cập hoặc dữ liệu nhạy cảm qua biểu mẫu liên hệ.</p></div></div></section>

  <div class="container ps-resources"><p>Khung vòng đời và ảnh phòng điều hành tham khảo từ Magal Solutions, không phải ảnh công trình hoặc nhân sự của AQPTech. Việc tham khảo không hàm ý quan hệ đối tác hay chứng nhận. Khả năng cung cấp, thời gian, chi phí và SLA được xác nhận riêng.</p><a class="ps-text-link" href="https://www.magalsolutions.com/our-professional-services/" target="_blank" rel="noopener noreferrer">Nguồn: Professional Services / Magal<span class="sr-only"> (tiếng Anh, mở tab mới)</span>${icon("arrow-up-right")}</a></div>`;
}

export function setupProfessionalServices() {
  const root = document.querySelector(".professional-services-page");
  const list = root.querySelector(".ps-stages");
  const stages = [...root.querySelectorAll("[data-ps-stage]")];
  const links = [...root.querySelectorAll("[data-ps-stage-link]")];
  const currentLabel = root.querySelector("[data-ps-current]");
  let frame = 0;

  function update() {
    frame = 0;
    const positions = stages.map((stage) => stage.getBoundingClientRect());
    const readingLine = Math.min(window.innerHeight * 0.45, 380);
    const distance = positions.at(-1).bottom - positions[0].top;
    const progress = Math.max(0, Math.min(1, (readingLine - positions[0].top) / distance));
    let current = 0;
    positions.forEach((position, index) => {
      if (position.top <= readingLine) current = index;
    });
    list.style.setProperty("--ps-progress", progress.toFixed(4));
    currentLabel.textContent = String(current + 1).padStart(2, "0");
    stages.forEach((stage, index) => {
      stage.classList.toggle("is-current", index === current);
      stage.classList.toggle("is-complete", index < current);
      links[index].classList.toggle("is-current", index === current);
      if (index === current) links[index].setAttribute("aria-current", "step");
      else links[index].removeAttribute("aria-current");
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  let observer;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("ps-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    root.querySelectorAll("[data-ps-reveal]").forEach((element) => observer.observe(element));
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  frame = requestAnimationFrame(() => {
    const target = document.getElementById(location.hash.slice(1));
    if (target && root.contains(target)) target.scrollIntoView({ behavior: "instant" });
    update();
  });

  return () => {
    observer?.disconnect();
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}
