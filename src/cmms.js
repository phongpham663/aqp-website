import { referenceHero } from "./about.js";
import { products } from "./data.js";

const modules = [
  {
    id: "work-orders", icon: "clipboard-list", label: "WORK ORDER MANAGEMENT",
    title: "Theo sát công việc, từ tiếp nhận đến hoàn tất.",
    description: "Tập trung yêu cầu, phân công và trạng thái trên một luồng xử lý. Đội ngũ vận hành theo dõi trách nhiệm và tiến độ thay vì tìm thông tin trong nhiều bảng tính hoặc tin nhắn.",
    features: [
      "Tạo lệnh công việc bằng mã QR của tài sản hoặc khu vực; phân công cho đội ngũ nội bộ hoặc bên ngoài.",
      "Liên kết yêu cầu, công việc bảo trì và phản hồi; quản lý công việc con trong phiếu sự cố.",
      "Theo dõi tiến độ, trao đổi và nhận thông báo cập nhật; tự động chuyển cấp theo nhóm SLA đã cấu hình.",
    ],
    image: "/assets/servedeck/images/work-order-dashboard.png", width: 1201, height: 565,
    alt: "Danh sách lệnh công việc ServeDeck với loại yêu cầu, bộ phận phụ trách và trạng thái xử lý",
    caption: "Giao diện quản lý lệnh công việc ServeDeck.",
    source: "https://www.servedeck.com/our-solutions/operation-maintenance/work-order-management/",
    sourceLabel: "Quản lý lệnh công việc",
  },
  {
    id: "preventive-maintenance", icon: "calendar-check", label: "PREVENTIVE MAINTENANCE & INSPECTION",
    title: "Chủ động lịch bảo trì. Chuẩn hóa từng lần kiểm tra.",
    description: "Chuyển kế hoạch bảo trì thành lịch công việc và checklist số. Kết nối người lập kế hoạch với kỹ thuật viên để ghi nhận kết quả và theo dõi nghiệm thu.",
    features: [
      "Lập lịch theo ngày, tuần, tháng, năm hoặc phát sinh cho tài sản và khu vực; tự động tạo lệnh công việc.",
      "Cấu hình phân công, checklist và tiêu chí kiểm tra; thực hiện trên ứng dụng di động với ảnh và xác nhận của kỹ thuật viên.",
      "Theo dõi kết quả nghiệm thu, kiểm tra tuân thủ và ghi chỉ số đồng hồ bằng QR theo quy trình được thiết lập.",
    ],
    image: "/assets/servedeck/images/preventive-maintenance.png", width: 1080, height: 720,
    alt: "Giao diện ServeDeck trên laptop hiển thị danh sách lệnh bảo trì phòng ngừa và bộ lọc",
    caption: "Danh sách công việc bảo trì phòng ngừa trên ServeDeck.",
    source: "https://www.servedeck.com/our-solutions/operation-maintenance/preventive-maintenance-inspection/",
    sourceLabel: "Bảo trì phòng ngừa & kiểm tra",
  },
  {
    id: "assets", icon: "boxes", label: "ASSET MANAGEMENT",
    title: "Mỗi tài sản, một hồ sơ vận hành xuyên suốt.",
    description: "Tập trung thông tin thiết bị và lịch sử bảo trì để hiểu tình trạng tài sản. Dữ liệu sự cố, thời gian ngừng hoạt động và chi phí hỗ trợ đánh giá phương án sửa chữa hoặc thay thế.",
    features: [
      "Lưu hãng, model, ngày lắp đặt, bảo hành, ảnh và tài liệu; liên kết hợp đồng dịch vụ và nhà cung cấp.",
      "Quét mã QR để truy cập hồ sơ, báo sự cố và xem lệnh công việc còn tồn đọng của tài sản.",
      "Theo dõi lịch sử sửa chữa, thời gian hỏng, thời gian ngừng hoạt động và báo cáo chi phí bảo trì.",
    ],
    image: "/assets/servedeck/images/asset-history.png", width: 1080, height: 720,
    alt: "Giao diện ServeDeck trên laptop thể hiện lịch sử sự cố và thời gian ngừng hoạt động của tài sản",
    caption: "Lịch sử sự cố và thời gian ngừng hoạt động của tài sản.",
    source: "https://www.servedeck.com/our-solutions/operation-maintenance/asset-management/",
    sourceLabel: "Quản lý tài sản",
  },
];

export function cmmsPage({ icon }) {
  const product = products.find((item) => item.slug === "servedeck-cmms");
  const contactUrl = `/contact?interest=${encodeURIComponent(product.name)}`;
  const steps = [
    ["qr-code", "Ghi nhận", "Quét QR tài sản hoặc khu vực để tạo yêu cầu và xác định đối tượng cần xử lý."],
    ["users", "Phân công", "Giao việc cho đội ngũ phù hợp và theo dõi SLA theo cấu hình đã thống nhất."],
    ["list-checks", "Thực hiện", "Kỹ thuật viên cập nhật công việc, checklist, ảnh và kết quả tại hiện trường."],
    ["chart-no-axes-combined", "Đánh giá", "Theo dõi nghiệm thu và lịch sử; khai thác báo cáo để cải tiến kế hoạch bảo trì."],
  ];
  const benefits = [
    ["calendar-clock", "Hỗ trợ giảm gián đoạn", "Bảo trì phòng ngừa và lịch sử sự cố giúp đội ngũ chủ động kế hoạch, ưu tiên tài sản cần chú ý và hỗ trợ giảm thời gian ngừng hoạt động."],
    ["workflow", "Rõ trách nhiệm, rõ tiến độ", "Lệnh công việc và SLA được quản lý trên cùng nền tảng, giúp phối hợp giữa người yêu cầu, bộ phận vận hành và kỹ thuật viên."],
    ["chart-column", "Tối ưu bằng dữ liệu thực tế", "Hồ sơ tài sản, kết quả kiểm tra và chi phí bảo trì tạo cơ sở để đánh giá hiệu quả, lập ngân sách và xem xét vòng đời thiết bị."],
  ];

  return `${referenceHero({
    id: "cmms-title", title: "ServeDeck CMMS", subtitle: product.tagline,
    description: product.description,
    image: "/assets/servedeck/images/cmms-hero.jpg", imageWidth: 1600, imageHeight: 625,
    imageAlt: "Minh họa nền tảng ServeDeck trên điện thoại với bối cảnh các tòa nhà",
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Tư vấn CMMS${icon("arrow-up-right")}</a><a class="industry-video-link" href="#cmms-modules">Khám phá tính năng${icon("arrow-down")}</a></div>`,
  })}

  <nav class="industry-section-nav" aria-label="Nội dung nền tảng ServeDeck CMMS"><div class="container"><a href="#cmms-modules"><span>01</span>Năng lực CMMS${icon("arrow-right")}</a><a href="#cmms-workflow"><span>02</span>Quy trình & lợi ích${icon("arrow-right")}</a><a href="#cmms-resources"><span>03</span>Tư liệu & tư vấn${icon("arrow-right")}</a></div></nav>

  <section class="container industry-overview" aria-labelledby="cmms-overview-title">
    <nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/products">Sản phẩm</a><span aria-hidden="true">/</span><span aria-current="page">ServeDeck CMMS</span></nav>
    <span class="industry-kicker" lang="en">MAINTENANCE / ASSETS / OPERATIONS</span>
    <h2 id="cmms-overview-title" class="industry-section-title">Từ bảo trì rời rạc đến vận hành có hệ thống.</h2>
    <div class="industry-overview-grid"><p>CMMS là hệ thống quản lý bảo trì bằng phần mềm. ServeDeck kết nối lệnh công việc, bảo trì phòng ngừa và hồ sơ tài sản, giúp đội ngũ nắm được công việc cần làm, người phụ trách và lịch sử xử lý.</p><p>Phù hợp để xem xét cho tòa nhà, cơ sở sản xuất và đơn vị quản lý nhiều điểm vận hành. AQPTech cùng doanh nghiệp làm rõ danh mục tài sản, quy trình, vai trò người dùng và yêu cầu báo cáo trước khi đề xuất phạm vi triển khai.</p></div>
    <dl class="cmms-summary"><div><dt>${icon("clipboard-list")}Lệnh công việc</dt><dd>Tiếp nhận, phân công, SLA</dd></div><div><dt>${icon("calendar-check")}Bảo trì định kỳ</dt><dd>Lịch, checklist, nghiệm thu</dd></div><div><dt>${icon("boxes")}Hồ sơ tài sản</dt><dd>QR, lịch sử, chi phí</dd></div></dl>
  </section>

  <section id="cmms-modules" class="cmms-modules" aria-labelledby="cmms-modules-title"><div class="container">
    <span class="industry-kicker">01 / NĂNG LỰC NỀN TẢNG</span><h2 id="cmms-modules-title" class="industry-section-title">Kết nối công việc với từng tài sản.</h2>
    <div class="cmms-module-list">${modules.map((module, index) => `<article id="cmms-${module.id}" class="cmms-module" aria-labelledby="cmms-${module.id}-title"><div class="cmms-module-copy"><span class="cmms-module-label">${icon(module.icon)}<span lang="en">0${index + 1} / ${module.label}</span></span><h3 id="cmms-${module.id}-title">${module.title}</h3><p>${module.description}</p><ul>${module.features.map((feature) => `<li>${feature}</li>`).join("")}</ul></div><figure class="cmms-module-media"><img src="${module.image}" alt="${module.alt}" width="${module.width}" height="${module.height}" loading="lazy"><figcaption>${module.caption}<span>Tư liệu ServeDeck, giao diện tiếng Anh.</span></figcaption></figure></article>`).join("")}</div>
  </div></section>

  <section id="cmms-workflow" class="container cmms-workflow" aria-labelledby="cmms-workflow-title"><span class="industry-kicker">02 / QUY TRÌNH & GIÁ TRỊ VẬN HÀNH</span><h2 id="cmms-workflow-title" class="industry-section-title">Một luồng công việc. Thông tin xuyên suốt.</h2><ol class="cmms-steps" role="list">${steps.map(([name, title, text], index) => `<li><div><span aria-hidden="true">0${index + 1}</span>${icon(name)}</div><h3>${title}</h3><p>${text}</p></li>`).join("")}</ol><div class="industry-benefit-grid">${benefits.map(([name, title, text]) => `<article class="industry-benefit">${icon(name)}<h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>

  <section id="cmms-resources" class="container cmms-resources" aria-labelledby="cmms-resources-title"><span class="industry-kicker">03 / TƯ LIỆU & TƯ VẤN</span><h2 id="cmms-resources-title" class="industry-section-title">Bắt đầu từ quy trình và tài sản của bạn.</h2><p>Chuẩn bị danh mục tài sản, lịch bảo trì hiện tại, cách phân công và các báo cáo cần theo dõi. Cùng AQPTech xác định kịch bản dùng thử, tiêu chí đánh giá và phạm vi triển khai phù hợp.</p><div class="industry-resources"><div><h3>Tìm hiểu từ nguồn ServeDeck chính thức</h3><ul class="cmms-source-links">${modules.map((module) => `<li><a href="${module.source}" target="_blank" rel="noopener noreferrer">${module.sourceLabel}${icon("arrow-up-right")}<span class="sr-only"> (tiếng Anh, mở tab mới)</span></a></li>`).join("")}</ul></div><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a></div><p class="industry-scope-note">Nội dung tiếng Việt và hình ảnh tham khảo từ <a href="https://www.servedeck.com" target="_blank" rel="noopener noreferrer">ServeDeck<span class="sr-only"> (mở tab mới)</span></a>; thương hiệu thuộc chủ sở hữu tương ứng. Việc giới thiệu không hàm ý quan hệ đối tác hoặc đại lý được ủy quyền. Phạm vi mô-đun, giấy phép, ngôn ngữ giao diện, mô hình triển khai và khả năng tích hợp cần được xác nhận theo dự án. SLA, lịch và checklist cần được cấu hình; lợi ích phụ thuộc dữ liệu và quy trình thực tế. Quyền sử dụng hình ảnh cần được rà soát trước khi xuất bản thương mại.</p></section>`;
}
