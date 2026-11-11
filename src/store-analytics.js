import { referenceHero } from "./about.js";
import { solutions } from "./data.js";
const storeBackground = "/assets/opretail/images/store-background.webp";
const trafficImage = "/assets/opretail/images/traffic-analysis.webp";
const demographicImage = "/assets/opretail/images/demographic-analysis.webp";
const behaviorImage = "/assets/opretail/images/customer-behavior.webp";
const kpiImage = "/assets/opretail/images/store-kpi.webp";
const scenariosImage = "/assets/opretail/images/store-scenarios.webp";
const realTimeImage = "/assets/opretail/images/feature-real-time.webp";
const countingImage = "/assets/opretail/images/feature-accurate-counting.webp";
const aiImage = "/assets/opretail/images/feature-ai-powered.webp";
const reportingImage = "/assets/opretail/images/feature-reporting.webp";

const analyses = [
  {
    id: "traffic", label: "TRAFFIC ANALYSIS", title: "Nắm bắt nhịp khách đến cửa hàng.",
    text: "Theo dõi lượt khách theo giờ, ngày, tuần, tháng và năm. Những xu hướng lưu lượng giúp bạn nhận biết thời điểm cao điểm, đánh giá chiến dịch và lên kế hoạch nhân sự phù hợp hơn.",
    points: ["Đếm lượt ra vào theo thời gian thực", "So sánh xu hướng theo từng khung giờ", "Đánh giá lưu lượng trước và sau chiến dịch"],
    image: trafficImage, width: 1700, height: 920,
    alt: "Giao diện mẫu phân tích lưu lượng với bảng lượt khách theo giờ và biểu đồ so sánh hai ngày",
  },
  {
    id: "audience", label: "DEMOGRAPHIC ANALYSIS", title: "Hiểu rõ hơn nhóm khách của bạn.",
    text: "Khám phá phân bố độ tuổi và giới tính ước lượng ở cấp độ tổng hợp. Có thêm góc nhìn để điều chỉnh danh mục sản phẩm, nội dung truyền thông và cách phục vụ theo từng điểm bán.",
    points: ["Phân bố các nhóm tuổi", "Thống kê giới tính ước lượng", "Phân tích tổng hợp, không xác định danh tính"],
    image: demographicImage, width: 1700, height: 920,
    alt: "Giao diện mẫu thống kê phân bố nhóm tuổi, giới tính và các biểu đồ tỷ trọng khách hàng",
  },
  {
    id: "behavior", label: "CUSTOMER BEHAVIOR", title: "Từ hành vi đến trải nghiệm tốt hơn.",
    text: "Khách dừng ở đâu, quan tâm khu vực nào và chờ bao lâu? Kết hợp thời gian dừng với bản đồ nhiệt để hiểu cách khách tương tác với không gian và sản phẩm, từ đó đánh giá cách bố trí cửa hàng.",
    points: ["Thời gian dừng và mức độ quan tâm sản phẩm", "Bản đồ nhiệt theo khu vực", "Theo dõi hàng đợi và thời gian chờ"],
    image: behaviorImage, width: 850, height: 460,
    alt: "Biểu đồ mẫu thời gian dừng theo khu vực kết hợp bản đồ nhiệt trên mặt bằng cửa hàng",
  },
  {
    id: "performance", label: "STORE KPI ANALYSIS", title: "Đo hiệu quả. So sánh toàn chuỗi.",
    text: "Kết hợp dữ liệu lượt khách và dữ liệu bán hàng để theo dõi KPI trên một bảng điều hành. So sánh cùng kỳ, nhận biết chênh lệch giữa các điểm bán và tìm cơ hội cải thiện dựa trên dữ liệu.",
    points: ["Tỷ lệ khách đi ngang ghé vào cửa hàng", "Tỷ lệ chuyển đổi khi tích hợp dữ liệu POS", "Báo cáo và xếp hạng nhiều cửa hàng"],
    image: kpiImage, width: 826, height: 426,
    alt: "Bảng điều hành KPI mẫu với thẻ chỉ số, biểu đồ lượt khách và xếp hạng nhiều cửa hàng",
  },
];

const features = [
  {
    label: "REAL-TIME", title: "Theo sát hoạt động thực tế.", image: realTimeImage, height: 1200,
    alt: "Khách chọn quần áo trong cửa hàng với biểu đồ lượt khách thời gian thực minh họa",
    text: "Cập nhật lưu lượng và thời gian dừng để đội vận hành có thêm thông tin khi điều phối nhân sự và phục vụ khách.",
  },
  {
    label: "ACCURATE COUNTING", title: "Mỗi lượt đếm cần có ý nghĩa.", image: countingImage, height: 1400,
    alt: "Người đi qua lối vào với khung theo dõi minh họa công nghệ đếm khách",
    text: "Hỗ trợ giảm lượt đếm trùng bằng theo dõi đối tượng. Độ chính xác cần được kiểm thử theo góc camera, mật độ và điều kiện ánh sáng.",
  },
  {
    label: "AI-POWERED", title: "Thêm góc nhìn từ AI.", image: aiImage, height: 1400,
    alt: "Khách và nhân viên tại showroom ô tô với khung phát hiện người minh họa",
    text: "Phân tích hình ảnh hỗ trợ thống kê nhóm khách và hành vi. Kết quả là ước lượng để tham khảo, không phải kết luận về từng cá nhân.",
  },
  {
    label: "COMPREHENSIVE REPORTING", title: "Bức tranh đầy đủ hơn về điểm bán.", image: reportingImage, height: 1200,
    alt: "Không gian bán lẻ với các bảng điều hành, biểu đồ và phễu chuyển đổi minh họa",
    text: "Tổng hợp lượt khách, thời gian dừng và các chỉ số liên quan thành báo cáo, hỗ trợ theo dõi một điểm bán hoặc nhiều chi nhánh.",
  },
];

const scenarios = [
  ["door-open", "Lối vào cửa hàng", "Theo dõi khách đi ngang, lượt ghé vào và xu hướng lưu lượng để đánh giá sức hút của điểm bán."],
  ["scan-line", "Khu trưng bày", "Nhận biết khu vực được quan tâm và thời gian dừng để đánh giá bố cục, vị trí sản phẩm."],
  ["timer", "Quầy thanh toán", "Quan sát hàng đợi và thời gian chờ để có cơ sở điều phối nhân sự vào thời điểm đông khách."],
  ["store", "Nhiều điểm bán", "So sánh dữ liệu theo cùng kỳ và cùng định nghĩa KPI để hiểu sự khác biệt giữa các cửa hàng."],
];

const questions = [
  ["applications", "Store Analytics phù hợp với những mô hình nào?", "Giải pháp có thể tham khảo cho cửa hàng bán lẻ, siêu thị, trung tâm thương mại, showroom hoặc không gian đón khách. Phương án cần dựa trên mặt bằng, vị trí ra vào, mật độ khách và mục tiêu vận hành, không áp dụng một cấu hình duy nhất cho mọi mô hình."],
  ["access", "Có thể xem dữ liệu trên web và ứng dụng không?", "Nền tảng tham chiếu của OP Retail hỗ trợ xem dữ liệu phân tích qua giao diện web và ứng dụng. Phương án thực tế cần xác nhận phiên bản phần mềm, thiết bị được hỗ trợ, phân quyền, nơi lưu trữ và kết nối mạng. AQPTech sẽ làm rõ các điều kiện này theo yêu cầu dự án; website này không phải cổng đăng nhập vào hệ thống phân tích."],
  ["reports", "Có thể xuất Excel và so sánh dữ liệu giữa các cửa hàng không?", "Tư liệu tham chiếu mô tả báo cáo định kỳ và so sánh nhiều điểm bán. Cần xác nhận định dạng xuất Excel, lịch báo cáo, chỉ số và phạm vi dữ liệu của gói phần mềm được chọn. Các cửa hàng nên dùng cùng quy tắc đếm và cùng kỳ so sánh; tỷ lệ chuyển đổi cần thêm dữ liệu giao dịch từ POS hoặc hệ thống bán hàng."],
  ["hardware", "Có tận dụng camera và phần cứng sẵn có không?", "Khả năng tận dụng phụ thuộc mẫu thiết bị, góc lắp, chất lượng hình ảnh, giao thức, giấy phép và khả năng tích hợp của nền tảng. Cần khảo sát và kiểm thử tương thích trước khi chốt phương án; không mặc định mọi camera IP đều đáp ứng các chức năng đếm khách, bản đồ nhiệt hoặc phân tích nhóm tuổi."],
  ["counting", "Hệ thống có thể loại trừ xe đẩy và lượt đếm trùng không?", "Phân loại đối tượng và theo dõi lượt di chuyển có thể hỗ trợ giảm lượt đếm không phù hợp. Việc bỏ qua xe đẩy hoặc các nhóm đối tượng khác phải được xác nhận với thiết bị và thuật toán cụ thể, rồi thử nghiệm trong điều kiện thực tế. Không cam kết loại bỏ hoàn toàn đếm trùng hoặc sai số trong mọi tình huống."],
];

export function storeAnalyticsPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "store-analytics");
  const contactUrl = `/contact?interest=${encodeURIComponent(solution.name)}`;
  const sections = [["analytics", "Phân tích cửa hàng"], ["scenarios", "Ứng dụng thực tế"], ["features", "Tính năng nổi bật"], ["faq", "Câu hỏi thường gặp"]];
  const related = [
    ["bot", "Phân tích video thông minh", "Kết nối dữ liệu hình ảnh với cảnh báo và thông tin phục vụ vận hành.", "/products/intelligent-video-analytics"],
    ["cctv", "Thiết bị & hạ tầng", "Lựa chọn camera, nền tảng tính toán và lưu trữ theo bài toán thực tế.", "/products/ip-video"],
    ["blocks", "Tích hợp & triển khai", "Kết nối phần cứng, phần mềm và quy trình trong một hệ thống đồng bộ.", "/services/integration"],
  ];

  return `<div class="sa-hero-wrap">${referenceHero({
    id: "sa-title", title: solution.name,
    subtitle: "Hiểu cửa hàng. Tối ưu từng quyết định.",
    description: solution.description, image: storeBackground,
    imageAlt: "Không gian bán lẻ dùng làm nền minh họa cho giải pháp phân tích cửa hàng",
    imageWidth: 1920, imageHeight: 1001,
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Yêu cầu tư vấn demo${icon("arrow-up-right")}</a><a class="industry-video-link" href="#sa-analytics">Khám phá giải pháp${icon("arrow-right")}</a></div><p class="sa-hero-note">Từ một điểm bán đến cả chuỗi cửa hàng.</p>`,
  })}<figure class="sa-hero-visual"><img src="${solution.image}" alt="Khách mua sắm, camera và các biểu đồ tỷ lệ ghé vào, chuyển đổi minh họa từ OP Retail" width="1490" height="1038" fetchpriority="high"></figure></div>

  <nav class="industry-section-nav sa-section-nav" aria-label="Nội dung Store Analytics"><div class="container" style="--industry-nav-count:4">${sections.map(([id, label], index) => `<a href="#sa-${id}" data-sa-section-link><span>0${index + 1}</span>${label}${icon("arrow-right")}</a>`).join("")}</div><span class="sa-reading-progress" aria-hidden="true"></span></nav>

  <section class="container industry-overview sa-overview" aria-labelledby="sa-overview-title"><nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/solutions">Giải pháp</a><span aria-hidden="true">/</span><span aria-current="page">Store Analytics</span></nav><div data-sa-reveal><span class="industry-kicker" lang="en">RETAIL INTELLIGENCE</span><h2 id="sa-overview-title" class="industry-section-title">Biến lượt ghé thăm thành thông tin hữu ích.</h2><div class="industry-overview-grid"><p>Mỗi lượt khách, mỗi khu vực được quan tâm và mỗi khoảng thời gian chờ đều mang lại một góc nhìn về cửa hàng. Store Analytics kết hợp đếm khách và phân tích dữ liệu để bạn hiểu rõ hơn điều đang diễn ra, thay vì chỉ nhìn vào doanh thu cuối ngày.</p><p>Từ lưu lượng, nhóm khách và hành vi đến KPI điểm bán, nền tảng phân tích giúp kết nối thông tin trong một bảng điều hành. AQPTech tiếp cận từ mục tiêu kinh doanh, hiện trạng thiết bị và yêu cầu dữ liệu để cùng xây dựng phương án phù hợp.</p></div></div><div class="sa-data-flow" aria-label="Từ thu thập dữ liệu đến quyết định vận hành">${[["cctv", "Thu thập dữ liệu"], ["chart-no-axes-combined", "Phân tích xu hướng"], ["gauge", "Hỗ trợ quyết định"]].map(([name, text], index) => `<div>${icon(name)}<span>${text}</span>${index < 2 ? icon("arrow-right") : ""}</div>`).join("")}</div></section>

  <section id="sa-analytics" class="container sa-analytics" aria-labelledby="sa-analytics-title" data-sa-section><div class="sa-section-heading" data-sa-reveal><span class="industry-kicker">01 / PHÂN TÍCH CỬA HÀNG</span><h2 id="sa-analytics-title" class="industry-section-title">Bốn góc nhìn. Một bức tranh vận hành.</h2></div><div class="sa-analysis-list">${analyses.map((item, index) => `<article id="sa-${item.id}" class="sa-analysis-row" aria-labelledby="sa-${item.id}-title"><div class="sa-analysis-media" data-sa-reveal><img src="${item.image}" alt="${item.alt}" width="${item.width}" height="${item.height}" loading="lazy"></div><div class="sa-analysis-copy" data-sa-reveal style="--sa-delay:90ms"><span class="sa-label" lang="en">0${index + 1} / ${item.label}</span><h3 id="sa-${item.id}-title">${item.title}</h3><p>${item.text}</p><ul role="list">${item.points.map((point) => `<li>${icon("check")}${point}</li>`).join("")}</ul></div></article>`).join("")}</div><p class="sa-image-note">Giao diện và số liệu trong hình là minh họa từ OP Retail, không phải dữ liệu của khách hàng AQPTech.</p></section>

  <section id="sa-scenarios" class="sa-scenarios" aria-labelledby="sa-scenarios-title" data-sa-section><div class="container"><div class="sa-section-heading" data-sa-reveal><span class="industry-kicker">02 / ỨNG DỤNG THỰC TẾ</span><h2 id="sa-scenarios-title" class="industry-section-title">Hiểu từng khu vực trong cửa hàng.</h2><p>Thông tin được đặt đúng ngữ cảnh, từ lối vào đến khu trưng bày và quầy thanh toán.</p></div><figure class="sa-scenario-map" data-sa-reveal><img src="${scenariosImage}" alt="Sơ đồ minh họa camera quan sát lối vào, khu trưng bày và quầy thanh toán trong một cửa hàng" width="1480" height="894" loading="lazy"><span class="sa-map-label sa-map-entrance" aria-hidden="true">Lưu lượng ra vào</span><span class="sa-map-label sa-map-floor" aria-hidden="true">Thời gian dừng & bản đồ nhiệt</span><span class="sa-map-label sa-map-queue" aria-hidden="true">Hàng đợi & thời gian chờ</span><figcaption>Sơ đồ ứng dụng tham khảo. Vị trí, vùng quan sát và chỉ số thực tế được xác định khi khảo sát.</figcaption></figure><div class="sa-scenario-grid">${scenarios.map(([name, title, text], index) => `<article data-sa-reveal style="--sa-delay:${(index % 2) * 80}ms"><span class="sa-scenario-number">0${index + 1}</span>${icon(name)}<h3>${title}</h3><p>${text}</p></article>`).join("")}</div><aside class="sa-privacy" aria-labelledby="sa-privacy-title" data-sa-reveal>${icon("shield-check")}<div><h3 id="sa-privacy-title">Dữ liệu hữu ích. Quyền riêng tư được cân nhắc.</h3><p>Ưu tiên dữ liệu tổng hợp và phương án đếm không định danh. Công nghệ ReID trong tư liệu tham chiếu có thể dùng đặc trưng trang phục, dáng người thay vì nhận diện danh tính. Phân tích độ tuổi, giới tính là ước lượng; mục đích xử lý, thông báo, phân quyền và thời gian lưu giữ cần được làm rõ trước khi triển khai.</p></div></aside></div></section>

  <section id="sa-features" class="container sa-features" aria-labelledby="sa-features-title" data-sa-section><div class="sa-section-heading" data-sa-reveal><span class="industry-kicker">03 / TÍNH NĂNG NỔI BẬT</span><h2 id="sa-features-title" class="industry-section-title">Từ dữ liệu đến hành động mỗi ngày.</h2><p>Các nhóm tính năng được lựa chọn và kiểm thử theo điều kiện của từng điểm bán.</p></div><div class="sa-feature-grid">${[features.slice(0, 2), features.slice(2)].map((column) => `<div class="sa-feature-column">${column.map((item) => `<article class="sa-feature" data-sa-reveal><img src="${item.image}" alt="${item.alt}" width="1200" height="${item.height}" loading="lazy"><div class="sa-feature-copy"><span class="sa-label" lang="en">${item.label}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join("")}</div>`).join("")}</div></section>

  <section id="sa-faq" class="container sa-faq" aria-labelledby="sa-faq-title" data-sa-section><div class="sa-section-heading" data-sa-reveal><span class="industry-kicker">04 / CÂU HỎI THƯỜNG GẶP</span><h2 id="sa-faq-title" class="industry-section-title">Làm rõ trước khi bắt đầu.</h2></div><div class="sa-faq-list">${questions.map(([id, question, answer]) => `<details id="sa-faq-${id}" data-sa-reveal><summary>${question}${icon("chevron-down")}</summary><div><p>${answer}</p></div></details>`).join("")}</div><a class="sa-inline-link" href="${contactUrl}">Trao đổi nhu cầu cụ thể${icon("arrow-up-right")}</a></section>

  <section class="container sa-explore" aria-labelledby="sa-explore-title"><div data-sa-reveal><span class="industry-kicker">KHÁM PHÁ THÊM</span><h2 id="sa-explore-title" class="industry-section-title">Kết nối dữ liệu với nền tảng phù hợp.</h2></div><div class="sa-explore-grid">${related.map(([name, title, text, href]) => `<a href="${href}" data-sa-reveal>${icon(name)}<h3>${title}</h3><p>${text}</p><span>Tìm hiểu thêm${icon("arrow-up-right")}</span></a>`).join("")}</div></section>

  <section id="sa-contact" class="sa-contact home-texture" aria-labelledby="sa-contact-title"><div class="container sa-contact-inner" data-sa-reveal><span class="industry-kicker">CÙNG AQPTECH XÂY DỰNG GIẢI PHÁP</span><h2 id="sa-contact-title">Đưa dữ liệu vào quyết định tiếp theo.</h2><p>Chia sẻ mô hình cửa hàng, số điểm bán và các chỉ số bạn muốn theo dõi. Cùng làm rõ thiết bị, nền tảng phân tích và phương án tích hợp phù hợp.</p><div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Yêu cầu tư vấn demo${icon("arrow-up-right")}</a><a class="industry-video-link" href="/services/integration">Tìm hiểu dịch vụ tích hợp${icon("arrow-right")}</a></div></div></section>
  <div class="container sa-resources"><p>Hình ảnh và giao diện minh họa thuộc OVOPARK / OP Retail, không hàm ý quan hệ đối tác hoặc kết quả triển khai AQPTech. Chức năng, giấy phép, độ chính xác và khả năng tích hợp được xác nhận theo cấu hình và thử nghiệm thực tế.</p><a class="sa-inline-link" href="https://www.opretail.com/products/op-analytics" target="_blank" rel="noopener noreferrer">Nguồn: People counting analytics / OP Retail<span class="sr-only"> (tiếng Anh, mở tab mới)</span>${icon("arrow-up-right")}</a></div>`;
}

export function setupStoreAnalytics() {
  const root = document.querySelector(".store-analytics-page");
  const nav = root.querySelector(".sa-section-nav");
  const sections = [...root.querySelectorAll("[data-sa-section]")];
  const links = [...root.querySelectorAll("[data-sa-section-link]")];
  let frame = 0;

  function update() {
    frame = 0;
    const positions = sections.map((section) => section.getBoundingClientRect());
    const readingLine = Math.min(window.innerHeight * 0.4, 300);
    let current = 0;
    positions.forEach((position, index) => {
      if (position.top <= readingLine) current = index;
    });
    const distance = positions.at(-1).bottom - positions[0].top;
    const progress = Math.max(0, Math.min(1, (readingLine - positions[0].top) / distance));
    nav.style.setProperty("--sa-progress", progress.toFixed(4));
    links.forEach((link, index) => {
      link.classList.toggle("is-current", index === current);
      if (index === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
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
        entry.target.classList.add("sa-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    root.querySelectorAll("[data-sa-reveal]").forEach((element) => observer.observe(element));
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
