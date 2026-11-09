import { referenceHero } from "./about.js";
import { products } from "./data.js";
import brochureUrl from "../assets/magal/documents/Fortis-X-Brochure--22ee02e812.pdf?url";
import "./industry-solution.css";
import "./veolink.css";

const features = [
  ["Khả năng tích hợp", "Kết nối các hệ thống và cảm biến thành một hệ sinh thái thống nhất, hỗ trợ trao đổi dữ liệu và điều hành theo thời gian thực."],
  ["Trực quan hóa tương tác", "Dashboard giúp khám phá dữ liệu trực quan, đi sâu vào từng chỉ số, so sánh xu hướng và nhận diện những mẫu dữ liệu đáng chú ý."],
  ["Xử lý dữ liệu thời gian thực", "Truy cập kịp thời thông tin quan trọng để đánh giá tình huống, hỗ trợ ra quyết định và phản ứng nhanh."],
  ["Hợp nhất dữ liệu", "Kết nối thông tin từ nhiều nguồn để tạo góc nhìn chung về trạng thái hệ thống, sự kiện và hoạt động tại hiện trường."],
  ["Khai thác dữ liệu", "Kết hợp chỉ số hiệu suất (KPI), phân tích video và Business Intelligence (BI) để đánh giá vận hành và tìm cơ hội cải tiến."],
  ["Quản lý nguồn lực", "Hỗ trợ quản lý nhân sự và nguồn lực qua ứng dụng di động, kết nối đội ngũ tại hiện trường với trung tâm điều hành."],
  ["Quản lý sự cố", "Một giao diện thống nhất để phát hiện, phân tích và quản lý sự cố; hỗ trợ phối hợp xử lý theo quy trình."],
  ["Tích hợp Business Intelligence", "Phân tích và trực quan hóa các tập dữ liệu phức tạp để nhận diện xu hướng, khai thác thông tin hữu ích và hỗ trợ hoạch định."],
  ["Triển khai linh hoạt", "Tiếp cận theo mô hình độc lập hoặc trong kiến trúc đa hệ thống. Phương án kết nối được đánh giá theo giao thức, giấy phép và yêu cầu từng dự án."],
];

const integrations = [
  ["truck", "Lực lượng cơ động"],
  ["cctv", "Camera / CCTV"],
  ["blocks", "Cổng thông minh"],
  ["megaphone", "Loa thông báo"],
  ["thermometer", "Ảnh nhiệt"],
  ["scan-line", "Nhận diện biển số"],
  ["shield-check", "An ninh mạng"],
  ["key-round", "Kiểm soát ra vào"],
  ["bot", "Robot & chống drone"],
  ["scan-face", "Nhận diện khuôn mặt"],
  ["database", "Dữ liệu bên ngoài"],
  ["radio", "Cảm biến chu vi"],
];

const benefits = [
  { icon: "gauge", title: "Nâng cao hiệu quả vận hành", text: "Liên kết hệ thống bên thứ ba, nền tảng an toàn, nguồn lực và lực lượng cơ động. KPI và báo cáo giúp đánh giá hiệu suất, hỗ trợ quyết định có cơ sở." },
  { icon: "clock", title: "Giám sát & phản ứng kịp thời", text: "Cảnh báo tức thời và góc nhìn tình huống thống nhất giúp đội ngũ đánh giá nhanh, phối hợp ứng phó và quản lý các tình huống khẩn cấp." },
  { icon: "settings-2", title: "Vận hành trực quan", text: "Bộ công cụ quản lý linh hoạt trên giao diện chung giúp giảm việc chuyển đổi giữa nhiều hệ thống và hỗ trợ thao tác liền mạch." },
  { icon: "map-pin", title: "Không gian vận hành trên GIS", text: "Hiển thị và quản lý tài sản theo vị trí địa lý, kết hợp mô hình 3D của không gian trong nhà và ngoài trời khi dữ liệu và mô-đun phù hợp được triển khai." },
  { icon: "truck", title: "Kết nối đội ngũ hiện trường", text: "Giám sát, thao tác và báo cáo trên thiết bị di động. Thông tin vị trí lực lượng phản ứng hỗ trợ điều phối và phân bổ nguồn lực." },
  { icon: "chart-no-axes-combined", title: "Ra quyết định dựa trên dữ liệu", text: "Kết hợp phân tích video thông minh (IVA) và Business Intelligence (BI) để hỗ trợ xử lý nhanh, đánh giá tình huống và lựa chọn hành động phù hợp." },
  { icon: "search", title: "Thông tin có thể hành động", text: "Hợp nhất nhiều cơ sở dữ liệu từ các phân hệ để nhận diện mối liên hệ, khai thác góc nhìn hữu ích và chuyển thông tin thành hành động." },
  { icon: "network", title: "Phối hợp xuyên suốt", text: "Hỗ trợ cộng tác giữa con người, hệ thống tự hành và nhiều phòng điều khiển. Kết nối thông tin, giao tiếp và điều phối trên toàn khu vực." },
  { icon: "layers", title: "Linh hoạt & sẵn sàng mở rộng", text: "Kiến trúc được định hướng theo nhu cầu phát triển, từ một cơ sở đến nhiều điểm vận hành. Khả năng tùy chỉnh và mở rộng được xác nhận theo phạm vi dự án." },
];

export function veolinkPage({ icon }) {
  const solution = products.find((item) => item.slug === "veolink");
  const contactUrl = `/contact?interest=${encodeURIComponent(solution.name)}`;
  const nodes = integrations.map(([nodeIcon, label], index) => {
    const angle = (index * Math.PI) / 6 - Math.PI / 2;
    return { icon: nodeIcon, label, x: 50 + 40 * Math.cos(angle), y: 50 + 40 * Math.sin(angle) };
  });

  return `${referenceHero({
    id: "veolink-title",
    title: "Veolink",
    subtitle: "Mạnh mẽ. Liền mạch. Sẵn sàng mở rộng.",
    description: solution.description,
    image: solution.image,
    imageAlt: "Nhân viên điều hành theo dõi dữ liệu và màn hình giám sát tại trung tâm điều khiển",
    imageWidth: 1208,
    imageHeight: 1081,
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Tư vấn Veolink${icon("arrow-up-right")}</a><a class="industry-video-link" href="https://www.youtube.com/watch?v=80EWEtl7aCA" target="_blank" rel="noopener noreferrer">${icon("play")}Xem video Fortis X<span class="sr-only"> (tư liệu Magal, tiếng Anh, mở tab mới)</span></a></div>`,
  })}

  <nav class="industry-section-nav" aria-label="Nội dung giải pháp Veolink"><div class="container" style="--industry-nav-count:3"><a href="#veolink-features"><span>01</span>Năng lực kỹ thuật${icon("arrow-right")}</a><a href="#veolink-benefits"><span>02</span>Lợi ích giải pháp${icon("arrow-right")}</a><a href="#veolink-resources"><span>03</span>Tài liệu & tư vấn${icon("arrow-right")}</a></div></nav>

  <section class="container industry-overview" aria-labelledby="veolink-overview-title">
    <nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/products">Sản phẩm</a><span aria-hidden="true">/</span><span aria-current="page">Veolink</span></nav>
    <span class="industry-kicker" lang="en">${solution.label}</span>
    <h2 id="veolink-overview-title" class="industry-section-title">Nhiều hệ thống. Một góc nhìn điều hành.</h2>
    <div class="industry-overview-grid"><p>Khi camera, cảm biến, kiểm soát ra vào và dữ liệu vận hành hoạt động riêng lẻ, thông tin dễ bị phân tán. Veolink hướng đến kết nối các phân hệ trên một giao diện chung, hỗ trợ quản lý công việc hằng ngày và phối hợp trong tình huống khẩn cấp.</p><p>Nội dung được xây dựng theo mô hình điều hành tích hợp C5I, tham khảo giải pháp Fortis X của Magal. AQPTech tiếp cận từ hiện trạng hạ tầng, quy trình và nhu cầu của từng cơ sở để xác định phương án tích hợp phù hợp.</p></div>
  </section>

  <section id="veolink-features" class="container veolink-features" aria-labelledby="veolink-features-title">
    <span class="industry-kicker">01 / NĂNG LỰC KỸ THUẬT</span>
    <h2 id="veolink-features-title" class="industry-section-title">Kết nối dữ liệu. Chủ động vận hành.</h2>
    <div class="veolink-feature-layout"><div><ol class="veolink-feature-list">${features.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join("")}</ol><div class="veolink-feature-actions"><a class="home-button" href="${contactUrl}">Tư vấn & báo giá${icon("arrow-up-right")}</a><a class="about-inline-link" href="/contact?interest=${encodeURIComponent("Hỗ trợ & góp ý Veolink")}">Yêu cầu & góp ý${icon("arrow-right")}</a></div></div>
      <figure class="veolink-integration"><div class="veolink-network" role="group" aria-label="Sơ đồ minh họa Veolink kết nối 12 nhóm hệ thống"><svg class="veolink-network-lines" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="26"/>${nodes.map((node) => `<line x1="50" y1="50" x2="${node.x}" y2="${node.y}"/>`).join("")}</svg><div class="veolink-network-hub">${icon("network")}<strong lang="en">VEOLINK</strong><span>Điều hành tích hợp</span><small lang="en">C5I</small></div><ul class="veolink-network-nodes">${nodes.map((node) => `<li style="--node-x:${node.x}%;--node-y:${node.y}%">${icon(node.icon)}<span>${node.label}</span></li>`).join("")}</ul></div><figcaption>Sơ đồ các nhóm hệ thống tham khảo từ Fortis X. Khả năng kết nối thực tế phụ thuộc giao thức, thiết bị và các mô-đun được lựa chọn.</figcaption></figure>
    </div>
  </section>

  <section id="veolink-benefits" class="veolink-benefits" aria-labelledby="veolink-benefits-title"><div class="container"><span class="industry-kicker">02 / GIÁ TRỊ VẬN HÀNH</span><h2 id="veolink-benefits-title" class="industry-section-title">Từ thông tin đến hành động.</h2><p class="veolink-benefits-lead">Một nền tảng kết nối để hiểu rõ tình huống, phối hợp hiệu quả và thích ứng cùng sự phát triển của hệ thống.</p><div class="industry-benefit-grid">${benefits.map((item) => `<article class="industry-benefit">${icon(item.icon)}<h3>${item.title}</h3><p>${item.text}</p></article>`).join("")}</div></div></section>

  <section id="veolink-resources" class="container veolink-resources" aria-labelledby="veolink-resources-title"><span class="industry-kicker">03 / TÀI LIỆU & TƯ VẤN</span><h2 id="veolink-resources-title" class="industry-section-title">Bắt đầu từ nhu cầu của bạn.</h2><div class="industry-resources"><div><h3>Khám phá mô hình điều hành tích hợp C5I</h3><a href="${brochureUrl}" target="_blank" rel="noopener noreferrer">${icon("download")}Xem brochure Fortis X${icon("arrow-up-right")}<span class="sr-only"> (PDF tiếng Anh, mở tab mới)</span></a></div><a class="home-button" href="${contactUrl}">Trao đổi với AQPTech${icon("arrow-up-right")}</a></div><p class="industry-scope-note">Nội dung và hình ảnh tham khảo từ Fortis X của Magal Solutions, không phải tài liệu sản phẩm Veolink đã được xác nhận. Việc tham khảo không hàm ý Veolink là Fortis X hoặc có quan hệ đối tác với Magal. Tính năng, giấy phép, khả năng tích hợp và phạm vi cung cấp cần được xác nhận theo từng dự án.</p></section>`;
}
