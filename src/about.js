import { catalogProducts, companyContact, completedSolutions } from "./data.js";
import designImage from "../assets/velasea/images/60aa5b6bf4bfe13ec9e0857f_Design--2186dc83f6.jpg";
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

export function aboutPage({ icon }) {
  const contactUrl = `/contact?interest=${encodeURIComponent("Tư vấn giải pháp")}`;
  const principles = [
    {
      icon: "compass",
      title: "Đúng nhu cầu",
      text: "Lựa chọn công nghệ theo ứng dụng, hiện trạng, ngân sách và điều kiện vận hành; không bắt đầu bằng một danh sách thiết bị.",
    },
    {
      icon: "layers",
      title: "Đồng bộ hệ thống",
      text: "Xem xét phần cứng, phần mềm và dữ liệu trong cùng một kiến trúc; kiểm chứng khả năng tích hợp trước khi triển khai.",
    },
    {
      icon: "shield-check",
      title: "Rõ ràng khi hợp tác",
      text: "Thống nhất phạm vi, cấu hình, tiêu chí nghiệm thu và chính sách hỗ trợ theo yêu cầu cụ thể của từng dự án.",
    },
  ];
  const capabilities = [
    {
      icon: "server",
      title: "Hạ tầng tính toán & OEM",
      text: "Xây dựng nền tảng phần cứng cho ứng dụng chuyên dụng, từ trung tâm dữ liệu đến thiết bị tại hiện trường.",
      points: [
        "Máy chủ, lưu trữ, mạng, GPU và máy tính công nghiệp.",
        "Cấu hình, nhận diện OEM và kế hoạch nhân rộng theo dự án.",
      ],
      links: [{ name: "Thiết kế hệ thống OEM", href: "/services/oem" }],
    },
    {
      icon: "cctv",
      title: "Giám sát & phân tích thông minh",
      text: "Kết nối giám sát IP, phân tích video và nền tảng điều hành để hỗ trợ nhận biết tình huống và phối hợp xử lý.",
      points: [
        "Tích hợp camera, cảm biến và dữ liệu sự kiện.",
        "Phân tích an ninh, an toàn và thông tin vận hành.",
      ],
      links: catalogProducts.map((item) => ({ name: item.name, href: `/products/${item.slug}` })),
    },
    {
      icon: "settings-2",
      title: "Tích hợp & hỗ trợ vòng đời",
      text: "Đồng hành từ tư vấn và thiết kế đến tích hợp, kiểm thử, bàn giao và kế hoạch duy trì hệ thống.",
      points: [
        "Cấu hình, tích hợp ứng dụng và hướng dẫn vận hành.",
        "Bảo trì, hỗ trợ và nâng cấp theo phạm vi đã thống nhất.",
      ],
      links: [
        { name: "Tích hợp & triển khai", href: "/services/integration" },
        { name: "Đồng hành vòng đời", href: "/services/lifecycle" },
      ],
    },
  ];
  const steps = [
    {
      title: "Hiểu đúng bài toán",
      text: "Làm rõ ứng dụng, quy mô, hạ tầng hiện có và những giới hạn về ngân sách, môi trường, thời gian.",
      output: "Yêu cầu & phạm vi dự án",
    },
    {
      title: "Thiết kế & kiểm chứng",
      text: "Đề xuất kiến trúc, lựa chọn cấu hình và xây dựng phương án tích hợp cùng tiêu chí kiểm thử.",
      output: "Phương án & tiêu chí kỹ thuật",
    },
    {
      title: "Tích hợp & bàn giao",
      text: "Cấu hình, kiểm thử và nghiệm thu theo phạm vi thống nhất; chuẩn bị tài liệu, hướng dẫn vận hành.",
      output: "Hệ thống & tài liệu vận hành",
    },
    {
      title: "Duy trì & phát triển",
      text: "Xây dựng kế hoạch hỗ trợ, bảo trì và nâng cấp để hệ thống tiếp tục đáp ứng nhu cầu sử dụng.",
      output: "Kế hoạch hỗ trợ & nâng cấp",
    },
  ];
  const questions = [
    {
      title: "AQPTech hỗ trợ những hình thức hợp tác nào?",
      text: "Chúng tôi làm việc cùng doanh nghiệp cần hệ thống cho vận hành, đơn vị tích hợp cần cấu hình cho dự án và đối tác phần mềm cần nền tảng OEM theo nhận diện riêng. Phạm vi hợp tác được xác nhận từ yêu cầu cụ thể.",
    },
    {
      title: "Có thể tận dụng hệ thống hiện có không?",
      text: "Hệ thống hiện hữu là một phần của quá trình khảo sát. Khả năng kết nối camera, cảm biến, hạ tầng mạng và phần mềm cần được đánh giá theo giao thức, cấu hình và quyền tích hợp; không mặc định mọi thiết bị đều tương thích.",
    },
    {
      title: "Cần chuẩn bị gì cho buổi tư vấn đầu tiên?",
      text: "Bạn có thể chia sẻ ứng dụng, hiện trạng hệ thống, quy mô và địa điểm triển khai, ngân sách dự kiến cùng mốc thời gian mong muốn. Nếu chưa có cấu hình, hãy bắt đầu từ bài toán cần giải quyết.",
    },
  ];

  return `${referenceHero({
    id: "about-title",
    title: "Về AQPTech",
    subtitle: "Từ bài toán thực tế đến hệ thống đồng bộ.",
    description: "AQPTech thiết kế, tích hợp và hỗ trợ hệ thống công nghệ cho doanh nghiệp, đơn vị tích hợp và đối tác phần mềm. Chúng tôi kết nối hạ tầng tính toán, giám sát thông minh và giải pháp OEM theo yêu cầu để phục vụ mục tiêu vận hành của từng dự án.",
    imageAlt: "Hình ảnh minh họa nhóm kỹ sư trao đổi và lập kế hoạch thiết kế hệ thống",
    imageWidth: 2160,
    imageHeight: 1230,
    actions: `<div class="about-hero-actions"><a class="home-button" href="${contactUrl}">Trao đổi nhu cầu${icon("arrow-up-right")}</a><a class="about-hero-link" href="#about-capabilities">Khám phá năng lực${icon("arrow-right")}</a></div><span class="about-hero-note">Hình ảnh minh họa, không phải nhân sự AQPTech.</span>`,
  })}

  <section class="container about-profile" aria-labelledby="about-profile-title">
    <div class="about-profile-intro">
      <div class="about-section-heading"><span class="about-kicker">01 / VỀ CHÚNG TÔI</span><h2 id="about-profile-title">Công nghệ đúng.<br><span>Giá trị thật.</span></h2></div>
      <div class="about-profile-copy">
        <p>Trong một hệ thống công nghệ, hiệu năng chỉ là một phần của bài toán. Khả năng tương thích, điều kiện triển khai, cách quản trị và kế hoạch nâng cấp đều ảnh hưởng đến giá trị sử dụng lâu dài.</p>
        <p>Vì vậy, AQPTech bắt đầu từ ứng dụng và nhu cầu thực tế. Từ nền tảng máy chủ, lưu trữ, mạng đến AI, video và điện toán biên, chúng tôi lựa chọn cấu hình và phương án tích hợp để các thành phần cùng phục vụ một mục tiêu.</p>
        <p class="about-mission">Mục tiêu của chúng tôi: giúp bạn xây dựng hệ thống phù hợp hôm nay và có hướng phát triển cho ngày mai.</p>
        <ul class="about-audiences" role="list" aria-label="Những đơn vị AQPTech đồng hành"><li>Doanh nghiệp</li><li>Đơn vị tích hợp</li><li>Đối tác phần mềm & OEM</li></ul>
      </div>
    </div>
    <div class="about-principles">${principles.map((item) => `<div>${icon(item.icon)}<h3>${item.title}</h3><p>${item.text}</p></div>`).join("")}</div>
  </section>

  <section id="about-capabilities" class="about-capabilities" aria-labelledby="about-capabilities-title"><div class="container">
    <div class="about-section-heading about-heading-row"><div><span class="about-kicker">02 / NĂNG LỰC</span><h2 id="about-capabilities-title">Kết nối từ hạ tầng<br>đến vận hành thông minh.</h2></div><p>Một hệ thống cần nhiều thành phần, nhưng không nên là những phần rời rạc. AQPTech kết nối nền tảng tính toán, ứng dụng và dịch vụ kỹ thuật trong cùng một phương án.</p></div>
    <div class="about-capability-grid">${capabilities.map((item, index) => `<section class="about-capability" aria-labelledby="about-capability-${index}"><div class="about-capability-top">${icon(item.icon)}<span aria-hidden="true">0${index + 1}</span></div><h3 id="about-capability-${index}">${item.title}</h3><p>${item.text}</p><ul role="list">${item.points.map((point) => `<li>${point}</li>`).join("")}</ul><div class="about-capability-links">${item.links.map((link) => `<a class="about-inline-link" href="${link.href}">${link.name}${icon("arrow-up-right")}</a>`).join("")}</div></section>`).join("")}</div>
    <p class="about-scope-note">Cấu hình, tính năng phần mềm, giấy phép và khả năng tương thích được đánh giá, xác nhận theo từng dự án.</p>
  </div></section>

  <section class="container about-applications" aria-labelledby="about-applications-title">
    <div class="about-section-heading about-heading-row"><div><span class="about-kicker">03 / LĨNH VỰC ỨNG DỤNG</span><h2 id="about-applications-title">Giải pháp gắn với<br>môi trường vận hành.</h2></div><div><p>Từ kiểm soát ra vào và an ninh sự kiện đến bảo vệ hạ tầng trọng yếu, phân tích bán lẻ và nhà máy thông minh. Mỗi lĩnh vực có yêu cầu riêng về dữ liệu, an toàn và cách phối hợp hệ thống.</p><a class="about-inline-link" href="/solutions">Khám phá giải pháp theo lĩnh vực${icon("arrow-up-right")}</a></div></div>
    <div class="about-solution-grid">${completedSolutions.map((item) => `<a href="/solutions/${item.slug}">${icon(item.icon)}<span>${item.menuName || item.name}</span>${icon("arrow-up-right")}</a>`).join("")}</div>
  </section>

  <section id="about-process" class="about-process" aria-labelledby="about-process-title"><div class="container">
    <div class="about-section-heading about-heading-row"><div><span class="about-kicker">04 / CÁCH LÀM VIỆC</span><h2 id="about-process-title">Rõ ràng từ yêu cầu<br>đến bàn giao.</h2></div><p>Không chỉ lựa chọn thiết bị. Chúng tôi nhìn vào toàn bộ hành trình của hệ thống, từ nhu cầu ban đầu đến vận hành và phát triển dài hạn.</p></div>
    <ol class="about-process-steps" role="list">${steps.map((step, index) => `<li><span class="about-step-number" aria-hidden="true">0${index + 1}</span><h3>${step.title}</h3><p>${step.text}</p><div class="about-step-output"><span>ĐẦU RA ĐỀ XUẤT</span>${step.output}</div></li>`).join("")}</ol>
    <div class="about-process-footer"><p>Các bước, đầu ra, trách nhiệm và mức dịch vụ (SLA) được thống nhất theo phạm vi từng dự án.</p><a class="about-inline-link" href="/services">Tìm hiểu dịch vụ chuyên nghiệp${icon("arrow-up-right")}</a></div>
  </div></section>

  <section class="container about-questions" aria-labelledby="about-questions-title">
    <div class="about-section-heading"><span class="about-kicker">05 / TRƯỚC KHI BẮT ĐẦU</span><h2 id="about-questions-title">Một vài điều<br>bạn có thể muốn biết.</h2><p>Chưa cần một cấu hình hoàn chỉnh để bắt đầu cuộc trao đổi.</p></div>
    <div class="about-question-list">${questions.map((item) => `<details><summary>${item.title}${icon("plus")}</summary><p>${item.text}</p></details>`).join("")}</div>
  </section>

  <section class="about-contact" aria-labelledby="about-contact-title"><div class="container about-contact-inner">
    <div><span class="about-kicker">CÙNG XÂY DỰNG ĐIỀU TIẾP THEO</span><h2 id="about-contact-title">Hệ thống tiếp theo bắt đầu<br>từ bài toán của bạn.</h2><p>Chia sẻ ứng dụng, thách thức và kế hoạch triển khai. Cùng AQPTech tìm ra phương án phù hợp.</p></div>
    <div class="about-contact-actions"><a class="home-button" href="${contactUrl}">Bắt đầu cuộc trao đổi${icon("arrow-up-right")}</a><a href="mailto:${companyContact.email}">${icon("mail")}${companyContact.email}</a><a href="${companyContact.phoneHref}">${icon("phone")}${companyContact.phone}</a></div>
  </div></section>`;
}
