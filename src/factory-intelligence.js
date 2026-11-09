import { referenceHero } from "./about.js";
import { solutions } from "./data.js";
import connectivityHero from "../assets/auk/images/factory-connectivity-hero.webp";
import gatewayImage from "../assets/auk/images/edge-gateway.webp";
import softwareImage from "../assets/auk/images/software-analytics-hero.webp";
import assetImage from "../assets/auk/images/asset-analysis.webp";
import gapImage from "../assets/auk/images/gap-analysis.webp";
import plantImage from "../assets/auk/images/plant-analysis.webp";
import "./industry-solution.css";
import "./factory-intelligence.css";

const architecture = [
  ["factory", "Máy móc & tín hiệu", "Chọn tài sản, dây chuyền và KPI. Xác định tín hiệu từ cảm biến, trạng thái máy và bộ điều khiển."],
  ["cpu", "Thu thập tại biên", "Dùng cảm biến / edge node hoặc khai thác dữ liệu PLC, máy chủ hiện có, chẳng hạn qua OPC UA."],
  ["network", "Gateway & kết nối", "Tổng hợp và chuyển dữ liệu qua mạng phù hợp như LAN, Wi-Fi hoặc kết nối di động được khảo sát."],
  ["database", "Nền tảng dữ liệu", "Tiếp nhận, chuẩn hóa và lưu trữ dữ liệu. Chọn kiến trúc tại chỗ hoặc cloud theo yêu cầu dự án."],
  ["chart-no-axes-combined", "Phân tích & hành động", "Theo dõi OEE, phân tích tổn thất và kết nối KPI với quy trình cải tiến của đội vận hành."],
];

const analyses = [
  {
    id: "asset", label: "SINGLE ASSET DEEP DIVE", title: "Đi sâu vào từng tài sản.",
    text: "Nhìn rõ trạng thái và hiệu suất của từng máy theo thời gian. Kết hợp tín hiệu thiết bị với bối cảnh sản xuất để nhận biết dừng ngắn, giảm tốc và các sự kiện ảnh hưởng đến đầu ra.",
    image: assetImage, alt: "Giao diện mẫu theo dõi một tài sản với dòng thời gian trạng thái máy, sản lượng tích lũy và chỉ số OEE",
    points: [
      ["Theo dõi từng máy", "Xem trạng thái, xu hướng và lịch sử vận hành theo khung thời gian phù hợp với dữ liệu thu thập."],
      ["Gắn nhãn sự kiện", "Bổ sung nguyên nhân dừng, sự cố hoặc sự kiện để hỗ trợ truy tìm nguyên nhân gốc rễ."],
      ["Gắn mã sản phẩm", "Liên kết SKU, lệnh sản xuất hoặc mã lô với dữ liệu vận hành để cải thiện khả năng truy xuất."],
    ],
  },
  {
    id: "baseline", label: "BASELINE & GAP ANALYSIS", title: "Từ đường cơ sở đến cơ hội cải tiến.",
    text: "Thiết lập thời gian chu kỳ và điều kiện chuẩn theo sản phẩm, sau đó so sánh với vận hành thực tế. Tách tổn thất theo ca, lô và dây chuyền để ưu tiên những vấn đề có ảnh hưởng lớn.",
    image: gapImage, alt: "Giao diện mẫu phân tích chênh lệch với bảng thời gian chuẩn theo sản phẩm và biểu đồ Pareto nguyên nhân tổn thất",
    points: [
      ["Quản lý thời gian chuẩn", "Đánh giá OEE theo đặc tính và chu kỳ chuẩn của từng sản phẩm, thay vì dùng một mức chung cho mọi mã hàng."],
      ["Nhận diện chu kỳ theo lô", "Theo dõi chu kỳ, chuyển đổi sản phẩm và khoảng chờ giữa các lô để đánh giá khác biệt trong vận hành."],
      ["Phân tích Pareto", "Xếp hạng nguyên nhân tổn thất và so sánh giữa ca, dây chuyền hoặc khu vực để xác định ưu tiên cải tiến."],
    ],
  },
  {
    id: "plant", label: "PLANT-WIDE PERFORMANCE", title: "Một góc nhìn cho toàn nhà máy.",
    text: "Kết nối các chỉ số từ từng máy đến dây chuyền và cấp nhà máy. Đi từ bức tranh tổng thể đến chi tiết để tìm điểm nghẽn, nhận biết khác biệt và hỗ trợ phối hợp giữa các bộ phận.",
    image: plantImage, alt: "Bảng điều hành mẫu cấp nhà máy với các ô chỉ số OEE theo máy, dây chuyền và bản đồ nhiệt hiệu suất",
    points: [
      ["Bảng điều hành đa cấp", "So sánh tài sản, nhóm máy và dây chuyền trên cùng hệ thống chỉ số đã được chuẩn hóa."],
      ["Bản đồ nhiệt hiệu suất", "Quan sát biến động theo thời gian để nhận biết dây chuyền hoặc giai đoạn cần xem xét sâu hơn."],
      ["Phân tích tương quan", "Đánh giá quan hệ giữa các thông số quá trình và tình trạng máy. Mô hình dự báo cần dữ liệu lịch sử phù hợp và kiểm thử."],
    ],
  },
];

const benefits = [
  ["search", "Minh bạch vận hành", "Một nguồn dữ liệu nhất quán để theo dõi trạng thái, xu hướng và các vấn đề trong sản xuất."],
  ["blocks", "Giải quyết đúng vấn đề", "Phân tích điểm nghẽn và nguyên nhân tổn thất, hỗ trợ đội vận hành chọn hành động có cơ sở."],
  ["gauge", "Quản lý theo vòng PDCA", "Kết nối KPI với chu trình lập kế hoạch, thực hiện, kiểm tra và điều chỉnh theo dữ liệu."],
  ["layers", "Mở rộng theo nhu cầu", "Bắt đầu với tài sản ưu tiên, rồi mở rộng số điểm thu thập, ứng dụng và phạm vi tích hợp."],
];

const integrations = [
  ["ERP", "SAP / Oracle", "Liên kết thông tin sản phẩm, đơn hàng và dữ liệu quản trị."],
  ["MES", "Tulip / Infor", "Trao đổi bối cảnh lệnh sản xuất, trạng thái và quy trình thực thi."],
  ["IoT", "PTC ThingWorx", "Kết nối dữ liệu thiết bị và các ứng dụng giám sát liên quan."],
  ["BI", "Qlik", "Cung cấp dữ liệu và chỉ số phục vụ báo cáo, phân tích bổ sung."],
];

const applications = [
  ["Quản lý hiệu suất số", "Đưa OEE và KPI vào nhịp họp theo ca, ngày hoặc tháng, kết nối mục tiêu quản trị với cải tiến tại hiện trường."],
  ["Giám sát chất lượng", "Kết hợp dữ liệu quá trình và kết quả kiểm tra để theo dõi xu hướng lỗi, hỗ trợ nhận biết dấu hiệu bất thường."],
  ["Năng lượng & phát triển bền vững", "Theo dõi tiêu thụ năng lượng theo tài sản, ca hoặc sản phẩm khi có nguồn đo, tìm cơ hội sử dụng hiệu quả hơn."],
  ["Năng suất lao động", "Kết nối kế hoạch ca, nguồn lực và đầu ra để đánh giá quy trình, hỗ trợ điều phối theo bối cảnh sản xuất."],
  ["Tối ưu hiệu suất tài sản", "Nhận biết thời gian dừng, giảm tốc và điểm nghẽn để xem xét lịch vận hành, cân bằng tải hoặc cách sử dụng máy."],
  ["Bảo trì theo tình trạng", "Theo dõi các thông số và dấu hiệu suy giảm để hỗ trợ kế hoạch bảo trì. Dự báo cần lịch sử, cảm biến và mô hình phù hợp."],
  ["Phân tích tiêu thụ vật liệu", "So sánh sử dụng vật liệu theo mã hàng, lô và dây chuyền để nhận biết chênh lệch, hao hụt và điểm cần kiểm tra."],
];

const questions = [
  ["machines", "Có thể kết nối máy cũ hoặc nhiều loại thiết bị không?", "Có thể khảo sát hai hướng: bổ sung cảm biến / edge node hoặc khai thác dữ liệu từ PLC, máy chủ và mạng máy hiện có. Khả năng tương thích phụ thuộc tín hiệu, giao thức, điều kiện lắp đặt và quyền truy cập. Không mặc định mọi máy, mọi hãng đều kết nối được ngay; cần thử nghiệm trước khi nhân rộng."],
  ["industries", "Factory Intelligence phù hợp với những ngành nào?", "Mô hình có thể tham khảo cho thực phẩm và đồ uống, hàng tiêu dùng, ép nhựa, điện tử, gia công cơ khí hoặc bao bì. Phương án cần dựa trên quy trình liên tục hay theo lô, đặc điểm thiết bị, dữ liệu sẵn có và mục tiêu vận hành, không dùng một cấu hình chung cho mọi nhà máy."],
  ["data", "Những loại dữ liệu nào có thể được phân tích?", "Các nguồn thường được xem xét gồm trạng thái máy, thời gian chu kỳ, số lượng sản phẩm, thời gian dừng, nguyên nhân sự kiện, SKU, mã lô, chất lượng, năng lượng hoặc vật liệu. Chỉ thu thập dữ liệu có nguồn đo và quyền sử dụng phù hợp. Định nghĩa KPI, tần suất lấy mẫu, chất lượng và thời gian lưu giữ cần được thống nhất trước khi triển khai."],
  ["environment", "Môi trường nhà máy ảnh hưởng đến hệ thống thế nào?", "Nhiệt độ, độ ẩm, bụi, rung, nguồn điện và nhiễu có thể ảnh hưởng thiết bị và truyền thông. Cần chọn phần cứng, vị trí lắp, giao tiếp và mạng theo điều kiện thực tế, xác nhận các thông số bảo vệ cần thiết bằng tài liệu và kiểm thử; không suy ra độ bền môi trường chỉ từ hình minh họa."],
  ["deployment", "Việc triển khai và mở rộng được thực hiện ra sao?", "Nên bắt đầu bằng khảo sát, chọn tài sản ưu tiên, thống nhất KPI và thử nghiệm thu thập dữ liệu. Sau khi đánh giá kết quả mới chuẩn hóa cấu hình để mở rộng. Tiến độ phụ thuộc hiện trạng máy, điện, mạng, tích hợp và lịch sản xuất; thời gian thử nghiệm, nghiệm thu và bàn giao được xác nhận theo từng dự án."],
  ["security", "Dữ liệu và các tích hợp API được bảo vệ thế nào?", "Cần làm rõ nơi lưu trữ, phân quyền, bảo vệ đường truyền, sao lưu, nhật ký thay đổi và quản trị khóa API. Lưu đệm, khôi phục khi mất kết nối và giới hạn thao tác với máy phải được kiểm thử theo thiết bị, phần mềm được chọn. Không mặc định kết nối thu thập dữ liệu được phép điều khiển máy; phạm vi truy cập và mọi thay đổi cần được phê duyệt."],
];

export function factoryIntelligencePage({ icon }) {
  const solution = solutions.find((item) => item.slug === "factory-intelligence");
  const contactUrl = `/contact?interest=${encodeURIComponent(solution.name)}`;
  const sections = [["connectivity", "Kiến trúc IoT"], ["analytics", "Phân tích dữ liệu"], ["applications", "Giá trị & tích hợp"], ["faq", "Câu hỏi thường gặp"]];

  return `<div class="fi-hero-wrap">${referenceHero({
    id: "fi-title", title: solution.name, subtitle: "Dữ liệu nhà máy. Hành động rõ ràng.",
    description: solution.description, image: solution.image,
    imageWidth: 980, imageHeight: 653,
    imageAlt: "Môi trường sản xuất công nghiệp dùng làm nền minh họa cho giải pháp phân tích nhà máy",
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Yêu cầu tư vấn demo${icon("arrow-up-right")}</a><a class="industry-video-link" href="https://youtu.be/cEvl_PURLuo" target="_blank" rel="noopener noreferrer">${icon("play")}Xem video tham khảo<span class="sr-only"> (mở tab mới)</span></a></div>`,
  })}<figure class="fi-hero-visual"><img src="${connectivityHero}" alt="Minh họa máy công nghiệp kết nối với bộ thu thập dữ liệu, ăng-ten và các vùng tín hiệu" width="1440" height="1000" fetchpriority="high"></figure></div>

  <nav class="industry-section-nav fi-section-nav" aria-label="Nội dung Factory Intelligence"><div class="container" style="--industry-nav-count:4">${sections.map(([id, label], index) => `<a href="#fi-${id}" data-fi-section-link><span>0${index + 1}</span>${label}${icon("arrow-right")}</a>`).join("")}</div><span class="fi-reading-progress" aria-hidden="true"></span></nav>

  <section class="container industry-overview fi-overview" aria-labelledby="fi-overview-title"><nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/solutions">Giải pháp</a><span aria-hidden="true">/</span><span aria-current="page">Factory Intelligence</span></nav><div data-fi-reveal><span class="industry-kicker" lang="en">CONNECTED MANUFACTURING</span><h2 id="fi-overview-title" class="industry-section-title">Từ tín hiệu máy đến quyết định vận hành.</h2><div class="industry-overview-grid"><p>Mỗi lần máy dừng, mỗi chu kỳ kéo dài và mỗi lô sản phẩm đều mang thông tin về hiệu quả sản xuất. Factory Intelligence kết nối dữ liệu tại hiện trường với bối cảnh vận hành để bạn hiểu điều đang diễn ra và tìm hướng cải tiến có cơ sở.</p><p>AQPTech tiếp cận từ mục tiêu và hiện trạng: nguồn tín hiệu, phần cứng tại biên, kết nối, nền tảng dữ liệu và khả năng tích hợp. Bắt đầu từ tài sản ưu tiên, làm rõ KPI và thử nghiệm trước khi mở rộng sang dây chuyền hoặc toàn nhà máy.</p></div></div></section>

  <section id="fi-connectivity" class="fi-connectivity" aria-labelledby="fi-connectivity-title" data-fi-section><div class="container"><div class="fi-section-heading" data-fi-reveal><span class="industry-kicker">01 / KIẾN TRÚC IoT</span><h2 id="fi-connectivity-title" class="industry-section-title">Kết nối từ hiện trường. Mở rộng theo nhu cầu.</h2></div><div class="fi-connectivity-inner"><figure class="fi-media" data-fi-reveal><img src="${gatewayImage}" alt="Sơ đồ minh họa edge node, gateway, ăng-ten và các thiết bị kết nối xung quanh" width="1024" height="576" loading="lazy"><figcaption>Minh họa mô hình thu thập tại biên và kết nối thiết bị.</figcaption></figure><div data-fi-reveal style="--fi-delay:90ms"><h3>Bắt đầu từ nguồn dữ liệu sẵn có.</h3><ul class="fi-connectivity-points" role="list">${[["Thiết kế theo hiện trạng", "Bổ sung cảm biến hoặc tích hợp dữ liệu đang có trên máy, PLC và hệ thống sản xuất."], ["Xử lý tại biên", "Tổng hợp tín hiệu gần nguồn thu thập để xem xét độ trễ, băng thông và tính liên tục của dữ liệu."], ["Triển khai theo mô đun", "Chọn phạm vi thử nghiệm phù hợp, rồi chuẩn hóa cấu hình để mở rộng từng bước."]].map(([title, text]) => `<li>${icon("check")}<div><h4>${title}</h4><p>${text}</p></div></li>`).join("")}</ul><a class="fi-inline-link" href="/products/edge-industrial">Tìm hiểu nền tảng công nghiệp${icon("arrow-up-right")}</a></div></div><ol class="fi-flow" role="list" aria-label="Năm lớp từ máy móc đến phân tích vận hành">${architecture.map(([name, title, text], index) => `<li class="fi-flow-step" data-fi-reveal style="--fi-delay:${index * 60}ms"><div class="fi-flow-top"><span aria-hidden="true">0${index + 1}</span>${icon(name)}</div><h3>${title}</h3><p>${text}</p></li>`).join("")}</ol><aside class="fi-security" aria-labelledby="fi-security-title" data-fi-reveal>${icon("shield-check")}<div><h3 id="fi-security-title">Thiết kế an toàn theo vòng đời dữ liệu.</h3><p>Xác định phân quyền, bảo vệ đường truyền, lưu trữ và phục hồi trước khi triển khai. Tần suất lấy mẫu, độ trễ và số điểm kết nối phải được tính theo cảm biến, băng thông và cấu hình thực tế.</p><div class="fi-security-tags"><span>Phân quyền</span><span>Bảo vệ đường truyền</span><span>Sao lưu & phục hồi</span><span>Quản trị truy cập API</span></div></div></aside></div></section>

  <section id="fi-analytics" class="container fi-analytics" aria-labelledby="fi-analytics-title" data-fi-section><div class="fi-section-heading" data-fi-reveal><span class="industry-kicker">02 / PHÂN TÍCH DỮ LIỆU</span><h2 id="fi-analytics-title" class="industry-section-title">Ba góc nhìn. Một nguồn dữ liệu thống nhất.</h2></div><div class="fi-software-overview"><div data-fi-reveal><h3>Nhìn rõ hiệu suất, không chỉ nhìn sản lượng.</h3><p>Chuẩn hóa các thành phần của OEE để liên kết thời gian vận hành, tốc độ và chất lượng. Từ dữ liệu gốc đến chỉ số nhất quán cho từng máy, dây chuyền và nhà máy.</p><span class="fi-oee-formula" lang="en">OEE = A &times; P &times; Q</span><dl class="fi-oee-components"><div><dt lang="en">Availability</dt><dd>Mức độ sẵn sàng</dd></div><div><dt lang="en">Performance</dt><dd>Hiệu suất vận hành</dd></div><div><dt lang="en">Quality</dt><dd>Tỷ lệ sản phẩm đạt</dd></div></dl></div><figure class="fi-media" data-fi-reveal style="--fi-delay:90ms"><img src="${softwareImage}" alt="Giao diện mẫu với phân tích Pareto, chỉ số OEE và dòng thời gian trạng thái sản xuất" width="1310" height="886" loading="lazy"></figure></div><div class="fi-analysis-list">${analyses.map((item, index) => `<article id="fi-${item.id}" class="fi-analysis-row" aria-labelledby="fi-${item.id}-title"><figure class="fi-media" data-fi-reveal><img src="${item.image}" alt="${item.alt}" width="1220" height="688" loading="lazy"></figure><div class="fi-analysis-copy" data-fi-reveal style="--fi-delay:90ms"><span class="fi-analysis-number" aria-hidden="true">0${index + 1}</span><span class="fi-label" lang="en">${item.label}</span><h3 id="fi-${item.id}-title">${item.title}</h3><p>${item.text}</p><ul class="fi-analysis-points" role="list">${item.points.map(([title, text]) => `<li>${icon("check")}<div><h4>${title}</h4><p>${text}</p></div></li>`).join("")}</ul></div></article>`).join("")}</div><p class="fi-image-note">Các giao diện và số liệu trong hình là dữ liệu minh họa, không phải kết quả triển khai hoặc dữ liệu khách hàng AQPTech.</p></section>

  <section id="fi-applications" class="fi-applications" aria-labelledby="fi-applications-title" data-fi-section><div class="container"><div class="fi-section-heading" data-fi-reveal><span class="industry-kicker">03 / GIÁ TRỊ & TÍCH HỢP</span><h2 id="fi-applications-title" class="industry-section-title">Kết nối mục tiêu vận hành với dữ liệu.</h2><p>Thông tin có giá trị khi được đưa vào quy trình ra quyết định và cải tiến của đội vận hành.</p></div><div class="fi-benefit-grid">${benefits.map(([name, title, text], index) => `<article class="fi-benefit" data-fi-reveal style="--fi-delay:${(index % 2) * 70}ms">${icon(name)}<h3>${title}</h3><p>${text}</p></article>`).join("")}</div><section id="fi-integrations" class="fi-integrations" aria-labelledby="fi-integrations-title"><div data-fi-reveal><span class="fi-label">API & HỆ THỐNG HIỆN CÓ</span><h3 id="fi-integrations-title">Đưa dữ liệu vào đúng hệ sinh thái.</h3><p>Các nhóm nền tảng dưới đây là ví dụ từ mô hình tham khảo. Khả năng kết nối phụ thuộc API, phiên bản, giấy phép, cấu trúc dữ liệu và kiểm thử tích hợp; không hàm ý quan hệ đối tác hoặc kết nối sẵn cho mọi hệ thống.</p></div><div class="fi-integration-grid">${integrations.map(([type, examples, text]) => `<article class="fi-integration" data-fi-reveal><span lang="en">${type}</span><h4 lang="en">${examples}</h4><p>${text}</p></article>`).join("")}</div><a class="fi-inline-link" href="/services/integration">Trao đổi phương án tích hợp API${icon("arrow-up-right")}</a></section><div class="fi-use-case-heading" data-fi-reveal><h3>Một nền tảng dữ liệu. Nhiều hướng ứng dụng.</h3><p>Xác định mục tiêu và nguồn dữ liệu phù hợp trước khi chọn tính năng. Hiệu quả được đánh giá theo KPI, thử nghiệm và thay đổi vận hành thực tế.</p></div><div class="fi-use-case-grid">${applications.map(([title, text]) => `<article class="fi-use-case" data-fi-reveal>${icon("check")}<div><h4>${title}</h4><p>${text}</p></div></article>`).join("")}</div></div></section>

  <section id="fi-faq" class="container fi-faq" aria-labelledby="fi-faq-title" data-fi-section><div class="fi-section-heading" data-fi-reveal><span class="industry-kicker">04 / CÂU HỎI THƯỜNG GẶP</span><h2 id="fi-faq-title" class="industry-section-title">Làm rõ trước khi bắt đầu.</h2></div><div class="fi-faq-list">${questions.map(([id, title, text]) => `<details id="fi-faq-${id}" data-fi-reveal><summary>${title}${icon("chevron-down")}</summary><div><p>${text}</p></div></details>`).join("")}</div><a class="fi-inline-link" href="/support">Xem thông tin hỗ trợ${icon("arrow-up-right")}</a></section>

  <section id="fi-contact" class="fi-contact home-texture" aria-labelledby="fi-contact-title"><div class="container fi-contact-inner" data-fi-reveal><span class="industry-kicker">CÙNG AQPTECH XÂY DỰNG GIẢI PHÁP</span><h2 id="fi-contact-title">Bắt đầu từ một tài sản. Hướng đến toàn nhà máy.</h2><p>Chia sẻ quy trình, hiện trạng máy móc và KPI bạn muốn cải thiện. Cùng làm rõ phương án thu thập dữ liệu, nền tảng phân tích và phạm vi thử nghiệm phù hợp.</p><div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Yêu cầu tư vấn demo${icon("arrow-up-right")}</a><a class="industry-video-link" href="/services/integration">Tìm hiểu tích hợp & triển khai${icon("arrow-right")}</a></div></div></section><div class="container fi-scope-note"><p>Hình ảnh giao diện và minh họa tham khảo từ Auk Industries. Chúng không hàm ý quan hệ đối tác hoặc kết quả triển khai AQPTech. Tính năng, hiệu quả, phạm vi bảo mật và tiến độ được xác nhận theo cấu hình, nguồn dữ liệu và thử nghiệm thực tế.</p></div>`;
}

export function setupFactoryIntelligence() {
  const root = document.querySelector(".factory-intelligence-page");
  const nav = root.querySelector(".fi-section-nav");
  const sections = [...root.querySelectorAll("[data-fi-section]")];
  const links = [...root.querySelectorAll("[data-fi-section-link]")];
  let frame = 0;

  function update() {
    frame = 0;
    const positions = sections.map((section) => section.getBoundingClientRect());
    const readingLine = Math.max(window.innerWidth > 760 ? nav.getBoundingClientRect().bottom + 24 : 0, Math.min(window.innerHeight * 0.4, 300));
    let current = 0;
    positions.forEach((position, index) => { if (position.top <= readingLine) current = index; });
    const distance = positions.at(-1).bottom - positions[0].top;
    const progress = Math.max(0, Math.min(1, (readingLine - positions[0].top) / distance));
    nav.style.setProperty("--fi-progress", progress.toFixed(4));
    links.forEach((link, index) => {
      link.classList.toggle("is-current", index === current);
      if (index === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }

  let observer;
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("fi-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    root.querySelectorAll("[data-fi-reveal]").forEach((element) => observer.observe(element));
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
