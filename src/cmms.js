import { referenceHero } from "./about.js";
import { images, products } from "./data.js";

const modules = [
  {
    id: "work-orders", icon: "clipboard-list", label: "WORK ORDER MANAGEMENT",
    title: "Theo sát công việc, từ tiếp nhận đến hoàn tất.",
    description: "Tập trung yêu cầu, phân công và trạng thái trên một luồng xử lý. Đội ngũ vận hành theo dõi trách nhiệm và tiến độ thay vì tìm thông tin trong nhiều bảng tính hoặc tin nhắn.",
    features: [
      "Ghi nhận yêu cầu theo tài sản hoặc khu vực, đặt mức ưu tiên và phân công cho đội ngũ phù hợp.",
      "Theo dõi trạng thái, người phụ trách và thời hạn; tập trung checklist, hình ảnh và trao đổi trong từng lệnh công việc.",
      "Ghi nhận kết quả, nghiệm thu và lưu lịch sử xử lý; theo dõi SLA theo quy trình đã cấu hình.",
    ],
    image: "/assets/cmms/images/work-orders.svg", width: 1200, height: 780,
    alt: "Hình minh họa CMMS quản lý lệnh công việc theo ba trạng thái: tiếp nhận, đang thực hiện và hoàn tất",
    caption: "Minh họa tiếp nhận, phân công và theo dõi tiến độ lệnh công việc.",
  },
  {
    id: "preventive-maintenance", icon: "calendar-check", label: "PREVENTIVE MAINTENANCE & INSPECTION",
    title: "Chủ động lịch bảo trì. Chuẩn hóa từng lần kiểm tra.",
    description: "Chuyển kế hoạch bảo trì thành lịch công việc và checklist số. Kết nối người lập kế hoạch với kỹ thuật viên để ghi nhận kết quả và theo dõi nghiệm thu.",
    features: [
      "Lập lịch bảo trì định kỳ theo từng tài sản, nhóm thiết bị hoặc khu vực; tạo công việc theo kế hoạch.",
      "Chuẩn hóa checklist và tiêu chí kiểm tra; ghi nhận chỉ số, hình ảnh và kết quả thực hiện tại hiện trường.",
      "Theo dõi công việc đến hạn, quá hạn và kết quả nghiệm thu để điều chỉnh kế hoạch bảo trì.",
    ],
    image: "/assets/cmms/images/preventive-maintenance.svg", width: 1200, height: 780,
    alt: "Hình minh họa lịch bảo trì theo tuần và checklist kiểm tra máy bơm trong CMMS",
    caption: "Minh họa lịch bảo trì, checklist và mức độ hoàn thành công việc.",
  },
  {
    id: "assets", icon: "boxes", label: "ASSET MANAGEMENT",
    title: "Mỗi tài sản, một hồ sơ vận hành xuyên suốt.",
    description: "Tập trung thông tin thiết bị và lịch sử bảo trì để hiểu tình trạng tài sản. Dữ liệu sự cố, thời gian ngừng hoạt động và chi phí hỗ trợ đánh giá phương án sửa chữa hoặc thay thế.",
    features: [
      "Tập trung mã tài sản, vị trí, thông số thiết bị, bảo hành và tài liệu kỹ thuật trong một hồ sơ.",
      "Liên kết tài sản với lệnh công việc, lịch bảo trì và lịch sử xử lý; hỗ trợ tra cứu bằng mã QR theo cấu hình.",
      "Theo dõi sự cố, thời gian ngừng hoạt động, vật tư và chi phí để hỗ trợ đánh giá vòng đời thiết bị.",
    ],
    image: "/assets/cmms/images/asset-management.svg", width: 1200, height: 780,
    alt: "Hình minh họa hồ sơ máy bơm trong CMMS với vị trí, tình trạng và dòng thời gian bảo trì",
    caption: "Minh họa hồ sơ tài sản và lịch sử bảo trì xuyên suốt vòng đời thiết bị.",
  },
];

export function cmmsPage({ icon }) {
  const product = products.find((item) => item.slug === "cmms");
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
    id: "cmms-title", title: product.name, subtitle: product.tagline,
    description: product.description,
    image: images.engineer, imageWidth: 980, imageHeight: 653,
    imageAlt: "Kỹ thuật viên sử dụng máy tính bảng để kiểm tra thiết bị tại hiện trường",
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Tư vấn CMMS${icon("arrow-up-right")}</a><a class="industry-video-link" href="#cmms-modules">Khám phá tính năng${icon("arrow-down")}</a></div>`,
  })}

  <nav class="industry-section-nav" aria-label="Nội dung CMMS"><div class="container"><a href="#cmms-modules"><span>01</span>Năng lực CMMS${icon("arrow-right")}</a><a href="#cmms-workflow"><span>02</span>Quy trình & lợi ích${icon("arrow-right")}</a><a href="#cmms-resources"><span>03</span>Tư vấn & triển khai${icon("arrow-right")}</a></div></nav>

  <section class="container industry-overview" aria-labelledby="cmms-overview-title">
    <nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/products">Sản phẩm</a><span aria-hidden="true">/</span><span aria-current="page">CMMS</span></nav>
    <span class="industry-kicker" lang="en">MAINTENANCE / ASSETS / OPERATIONS</span>
    <h2 id="cmms-overview-title" class="industry-section-title">Từ bảo trì rời rạc đến vận hành có hệ thống.</h2>
    <div class="industry-overview-grid"><p>CMMS (Computerized Maintenance Management System) là hệ thống quản lý bảo trì bằng phần mềm. Kết nối lệnh công việc, kế hoạch bảo trì và hồ sơ tài sản để đội ngũ nắm được việc cần làm, người phụ trách và lịch sử xử lý trên cùng một hệ thống.</p><p>Phù hợp để xem xét cho tòa nhà, cơ sở sản xuất và đơn vị quản lý nhiều điểm vận hành. AQPTech cùng doanh nghiệp làm rõ danh mục tài sản, quy trình, vai trò người dùng và yêu cầu báo cáo trước khi đề xuất phạm vi triển khai.</p></div>
    <dl class="cmms-summary"><div><dt>${icon("clipboard-list")}Lệnh công việc</dt><dd>Tiếp nhận, phân công, SLA</dd></div><div><dt>${icon("calendar-check")}Bảo trì định kỳ</dt><dd>Lịch, checklist, nghiệm thu</dd></div><div><dt>${icon("boxes")}Hồ sơ tài sản</dt><dd>QR, lịch sử, chi phí</dd></div></dl>
  </section>

  <section id="cmms-modules" class="cmms-modules" aria-labelledby="cmms-modules-title"><div class="container">
    <span class="industry-kicker">01 / NĂNG LỰC NỀN TẢNG</span><h2 id="cmms-modules-title" class="industry-section-title">Kết nối công việc với từng tài sản.</h2>
    <div class="cmms-module-list">${modules.map((module, index) => `<article id="cmms-${module.id}" class="cmms-module" aria-labelledby="cmms-${module.id}-title"><div class="cmms-module-copy"><span class="cmms-module-label">${icon(module.icon)}<span lang="en">0${index + 1} / ${module.label}</span></span><h3 id="cmms-${module.id}-title">${module.title}</h3><p>${module.description}</p><ul>${module.features.map((feature) => `<li>${feature}</li>`).join("")}</ul></div><figure class="cmms-module-media"><img src="${module.image}" alt="${module.alt}" width="${module.width}" height="${module.height}" loading="lazy"><figcaption>${module.caption}<span>Hình minh họa chức năng với dữ liệu mẫu.</span></figcaption></figure></article>`).join("")}</div>
  </div></section>

  <section id="cmms-workflow" class="container cmms-workflow" aria-labelledby="cmms-workflow-title"><span class="industry-kicker">02 / QUY TRÌNH & GIÁ TRỊ VẬN HÀNH</span><h2 id="cmms-workflow-title" class="industry-section-title">Một luồng công việc. Thông tin xuyên suốt.</h2><ol class="cmms-steps" role="list">${steps.map(([name, title, text], index) => `<li><div><span aria-hidden="true">0${index + 1}</span>${icon(name)}</div><h3>${title}</h3><p>${text}</p></li>`).join("")}</ol><div class="industry-benefit-grid">${benefits.map(([name, title, text]) => `<article class="industry-benefit">${icon(name)}<h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>

  <section id="cmms-resources" class="container cmms-resources" aria-labelledby="cmms-resources-title"><span class="industry-kicker">03 / TƯ VẤN & TRIỂN KHAI</span><h2 id="cmms-resources-title" class="industry-section-title">Bắt đầu từ quy trình và tài sản của bạn.</h2><p>Chuẩn bị danh mục tài sản, lịch bảo trì hiện tại, cách phân công và các báo cáo cần theo dõi. Cùng AQPTech xác định kịch bản dùng thử, tiêu chí đánh giá và phạm vi triển khai phù hợp.</p><div class="industry-resources"><div><h3>Chuẩn bị cho triển khai CMMS</h3><ul class="cmms-readiness-list"><li>${icon("boxes")}<span>Danh mục tài sản, vị trí và mức độ ưu tiên của thiết bị.</span></li><li>${icon("calendar-check")}<span>Lịch bảo trì, checklist kiểm tra và quy trình nghiệm thu.</span></li><li>${icon("users")}<span>Vai trò người dùng, cách phân công và yêu cầu báo cáo.</span></li></ul></div><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a></div><p class="industry-scope-note">Phạm vi mô-đun, phân quyền, mô hình triển khai và khả năng tích hợp được xác định theo nhu cầu dự án. SLA, lịch và checklist cần được cấu hình; hiệu quả phụ thuộc dữ liệu và quy trình thực tế. Hình ảnh chức năng sử dụng dữ liệu minh họa, không phải ảnh chụp giao diện của một nhà cung cấp cụ thể.</p></section>`;
}
