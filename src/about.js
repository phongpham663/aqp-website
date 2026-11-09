import { products, solutions, services } from "./data.js";
import designImage from "../assets/velasea/images/60aa5b6bf4bfe13ec9e0857f_Design--2186dc83f6.jpg";
import companyImage from "../assets/velasea/images/commercial-office-complex-980x653--dacd576d2c.jpg";
import "./about.css";

export function referenceHero({
  id,
  title,
  subtitle,
  description,
  image = designImage,
  imageAlt = "Nhóm kỹ sư trao đổi và lập kế hoạch thiết kế hệ thống",
  imageWidth = 2000,
  imageHeight = 1139,
  actions = "",
}) {
  return `<section class="about-reference-hero" aria-labelledby="${id}">
    <img class="about-hero-photo" src="${image}" alt="${imageAlt}" width="${imageWidth}" height="${imageHeight}" fetchpriority="high">
    <div class="about-hero-geometry" aria-hidden="true"></div>
    <div class="container about-hero-inner"><div class="about-hero-panel">
      <h1 id="${id}">${title}</h1><h2>${subtitle}</h2><p>${description}</p>${actions}
    </div></div>
  </section>`;
}

export function aboutPage({ icon, logo }) {
  const principles = [
    {
      icon: "compass",
      title: "Thiết kế từ nhu cầu",
      text: "Bắt đầu với ứng dụng, điều kiện vận hành và mục tiêu phát triển của doanh nghiệp.",
    },
    {
      icon: "shield-check",
      title: "Chất lượng có cơ sở",
      text: "Đánh giá tương thích, kiểm thử cấu hình và làm rõ tiêu chí bàn giao.",
    },
    {
      icon: "headphones",
      title: "Đồng hành dài hạn",
      text: "Tính đến quản trị, hỗ trợ, nâng cấp và thay thế ngay từ giai đoạn thiết kế.",
    },
  ];
  const groups = [
    {
      title: "Hạ tầng doanh nghiệp",
      type: "products",
      items: products.filter((item) =>
        ["servers", "storage", "networking"].includes(item.slug),
      ),
    },
    {
      title: "AI, giám sát & điện toán biên",
      type: "products",
      items: products.filter((item) =>
        ["ai-computing", "ip-video", "edge-industrial"].includes(item.slug),
      ),
    },
    { title: "Giải pháp theo lĩnh vực", type: "solutions", items: solutions },
    { title: "Dịch vụ & vòng đời hệ thống", type: "services", items: services },
  ];
  const network = [
    "servers",
    "storage",
    "networking",
    "ai-computing",
    "ip-video",
    "edge-industrial",
  ].map((slug) => products.find((item) => item.slug === slug));

  return `${referenceHero({ id: "about-title", title: "Về AQPTech", subtitle: "Thúc đẩy mạnh mẽ sự phát triển", description: "AQPTech tập trung vào thiết kế và tích hợp hệ thống tính toán, hạ tầng công nghệ và giải pháp OEM theo yêu cầu. Chúng tôi kết nối phần cứng, phần mềm và chuyên môn kỹ thuật để cùng doanh nghiệp xây dựng nền tảng phù hợp cho từng bài toán." })}

  <section class="container about-reference-profile" aria-label="Giới thiệu và định hướng AQPTech">
    <div class="about-company-column">
      <figure class="about-company-photo"><img src="${companyImage}" alt="Minh họa môi trường ứng dụng công nghệ trong doanh nghiệp" width="980" height="653" loading="lazy"><figcaption>Hình ảnh minh họa môi trường doanh nghiệp.</figcaption></figure>
      <h2>Chúng tôi là AQPTech</h2>
      <p>Công nghệ chỉ thực sự có giá trị khi giải quyết đúng nhu cầu. AQPTech tiếp cận mỗi dự án từ ứng dụng, quy mô triển khai và nguồn lực của doanh nghiệp, thay vì bắt đầu bằng một danh sách thiết bị có sẵn.</p>
      <div class="about-principles">${principles.map((item) => `<div>${icon(item.icon)}<div><h3>${item.title}</h3><p>${item.text}</p></div></div>`).join("")}</div>
      <a class="home-button" href="/contact">Trao đổi với chúng tôi</a>
    </div>
    <div class="about-purpose-column">
      <div class="about-reference-kicker"><span>Cần một giải pháp phù hợp?</span>${icon("arrow-right")}<a href="/solutions">Khám phá giải pháp</a></div>
      <h2>Sứ mệnh & định hướng</h2>
      <section class="about-purpose-block"><span>01 / SỨ MỆNH</span><h3>Đưa công nghệ phù hợp đến từng bài toán.</h3><p>Giúp doanh nghiệp lựa chọn nền tảng tính toán và hạ tầng dựa trên nhu cầu thực tế. Cân đối hiệu năng, mức độ tương thích, khả năng quản trị và chi phí để hệ thống phục vụ tốt mục tiêu vận hành.</p></section>
      <section class="about-purpose-block"><span>02 / CÁCH TIẾP CẬN</span><h3>Không chỉ cung cấp thiết bị. Kiến tạo một hệ thống.</h3><p>Máy chủ, lưu trữ, mạng, giám sát IP và AI cần được xem xét như các thành phần của một hệ thống đồng bộ. Chúng tôi chú trọng khâu tích hợp, kiểm thử và kế hoạch triển khai thay vì đánh giá từng thiết bị riêng lẻ.</p></section>
      <section class="about-purpose-block"><span>03 / ĐỒNG HÀNH</span><h3>Một đối tác, xuyên suốt hành trình.</h3><p>Từ khảo sát và tư vấn đến thiết kế OEM, tích hợp và hỗ trợ vòng đời. Phạm vi công việc, cấu hình, thời gian và chính sách dịch vụ được làm rõ theo yêu cầu cụ thể của từng dự án.</p></section>
      <a class="about-inline-link" href="/services">Tìm hiểu cách AQPTech đồng hành${icon("arrow-up-right")}</a>
    </div>
  </section>

  <section class="container about-capabilities" aria-labelledby="about-capabilities-title">
    <h2 id="about-capabilities-title">Kết nối công nghệ. Mở rộng khả năng.</h2>
    <p class="about-capabilities-lead">Từ trung tâm dữ liệu đến thiết bị tại biên, lựa chọn và kết nối các nền tảng để xây dựng một hệ thống phù hợp với doanh nghiệp.</p>
    <div class="about-capability-network" role="group" aria-label="Sơ đồ sáu nền tảng công nghệ của AQPTech">
      <svg class="about-network-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#d5d5d5" stroke-width="2"><path d="M250 75H325Q350 75 350 100V225Q350 250 375 250H425"/><path d="M250 250H425"/><path d="M250 425H325Q350 425 350 400V275Q350 250 375 250H425"/><path d="M575 250H625Q650 250 650 225V100Q650 75 675 75H750"/><path d="M575 250H750"/><path d="M575 250H625Q650 250 650 275V400Q650 425 675 425H750"/></g><g fill="#cc0033"><circle cx="250" cy="75" r="5"/><circle cx="250" cy="250" r="5"/><circle cx="250" cy="425" r="5"/><circle cx="750" cy="75" r="5"/><circle cx="750" cy="250" r="5"/><circle cx="750" cy="425" r="5"/></g></svg>
      <div class="about-network-hub"><span class="brand">${logo()}</span><p>Thiết kế · Tích hợp · Hỗ trợ</p></div>
      ${network.map((item, index) => `<a class="about-network-node" href="/products/${item.slug}" style="--network-column:${index < 3 ? 1 : 3};--network-row:${(index % 3) + 1}">${icon(item.icon)}<h3>${item.name}</h3><span>${item.category}${icon("arrow-up-right")}</span></a>`).join("")}
    </div>
    <p class="about-network-caption">Sơ đồ minh họa các nhóm năng lực, không phải sơ đồ địa điểm văn phòng.</p>
    <div class="about-capability-directory">${groups.map((group) => `<section><h3>${group.title}</h3>${group.items.map((item) => `<details><summary>${item.name}</summary><p>${item.description}</p><a class="about-inline-link" href="/${group.type}/${item.slug}">Khám phá chi tiết${icon("arrow-up-right")}</a></details>`).join("")}</section>`).join("")}</div>
    <div class="about-contact-strip"><div><h2>Cùng xây dựng điều tiếp theo.</h2><p>Chia sẻ ứng dụng, thách thức và kế hoạch triển khai của bạn.</p></div><a class="home-button" href="/contact?interest=Tư%20vấn%20giải%20pháp">Bắt đầu cuộc trao đổi${icon("arrow-up-right")}</a></div>
  </section>`;
}
