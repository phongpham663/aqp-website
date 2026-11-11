import { referenceHero } from "./about.js";
import { products, solutions } from "./data.js";
const deploymentImage = "/assets/watchtower/event-security/images/wts-be-project-20250911-4--40e08dc6b1.jpg";

const workflow = [
  ["Khảo sát & lập kế hoạch", "Xác định khu vực công cộng, hậu trường, kho tạm, lối thoát và luồng phương tiện. Cùng ban tổ chức làm rõ rủi ro, thời gian hoạt động và trách nhiệm ứng phó."],
  ["Triển khai các lớp giám sát", "Lựa chọn camera, vị trí lắp đặt, mạng nội bộ và nguồn dự phòng. Có thể kết hợp cột camera cơ động, camera gắn container, báo động phòng tạm và cảm biến phù hợp với hiện trường."],
  ["Theo dõi, xác minh & phối hợp", "Hợp nhất video và sự kiện trên giao diện điều hành. Nhân sự xác minh cảnh báo, phối hợp lực lượng an ninh, điều phối giao thông hoặc sơ cứu theo phương án đã thống nhất."],
  ["Đánh giá & kết thúc triển khai", "Rà soát sự kiện, tải hệ thống và hiệu quả từng kịch bản. Bàn giao báo cáo, thu hồi quyền truy cập và xử lý dữ liệu theo thời hạn lưu giữ đã được phê duyệt."],
];

const aiCases = [
  {
    id: "crowd-density", icon: "chart-no-axes-combined", title: "Mật độ đám đông",
    brief: "Hỗ trợ nhận diện khu vực tập trung đông kéo dài để chủ động kiểm tra và điều tiết luồng người.",
    inputs: "Camera góc cao, vùng quan sát được hiệu chỉnh, số đếm tổng hợp và ngưỡng do ban tổ chức phê duyệt.",
    signal: "Mật độ ước tính vượt ngưỡng trong một khoảng thời gian tại khu vực được cấu hình.",
    action: "Nhân sự xác minh, phối hợp hướng dẫn khách, điều tiết tiếp nhận hoặc mở tuyến di chuyển đã được duyệt.",
    limits: "Che khuất ảnh hưởng độ chính xác. Mật độ không phải áp lực đám đông; không cam kết dự đoán chen lấn hoặc giẫm đạp.",
  },
  {
    id: "queue-monitoring", icon: "gauge", title: "Hàng chờ & luồng ra vào",
    brief: "Theo dõi hàng chờ tại cổng, quầy soát vé và khu dịch vụ để hạn chế tràn sang lối đi.",
    inputs: "Video cửa vào, ranh giới hàng chờ, vùng lưu thông và số liệu lượt qua lại ở dạng tổng hợp.",
    signal: "Hàng chờ vượt vùng quy định hoặc tốc độ tiếp nhận giảm kéo dài; ước tính thời gian chờ khi đã hiệu chỉnh.",
    action: "Đội vận hành kiểm tra, điều chỉnh nhân sự soát vé hoặc hướng dẫn đến cổng còn năng lực tiếp nhận.",
    limits: "Cần kiểm thử với cấu trúc hàng chờ thực tế. Không định danh hoặc theo dõi liên tục từng người qua nhiều camera.",
  },
  {
    id: "restricted-zones", icon: "key-round", title: "Khu vực hạn chế & hậu trường",
    brief: "Hỗ trợ phát hiện vượt ranh giới tại hậu trường, khu thiết bị và kho chứa tài sản tạm thời.",
    inputs: "Camera, vùng hoặc đường ảo, lịch hoạt động và sự kiện kiểm soát ra vào nếu có tích hợp.",
    signal: "Một đối tượng đi qua ranh giới tại khu vực, thời điểm đã được cấu hình cần kiểm tra.",
    action: "Nhân sự đối chiếu quyền tiếp cận, xem lại hình ảnh và tiếp cận hiện trường theo quy trình an ninh.",
    limits: "Vượt ranh giới không tự chứng minh xâm nhập hoặc ý đồ xấu. Cần tính đến nhân viên, nhà thầu và lịch giao nhận hợp lệ.",
  },
  {
    id: "exit-obstruction", icon: "compass", title: "Lối thoát & hành lang bị cản trở",
    brief: "Cảnh báo vật cản lưu lại trong vùng cần duy trì thông thoáng, hỗ trợ kiểm tra lối thoát.",
    inputs: "Camera cố định, mặt bằng lối thoát, vùng hành lang và ngưỡng thời gian tồn tại của vật cản.",
    signal: "Vật thể hoặc tình trạng cản trở tồn tại quá thời gian cho phép trong vùng theo dõi.",
    action: "Nhân sự an toàn kiểm tra và xử lý vật cản theo kế hoạch vận hành, sơ tán đã được phê duyệt.",
    limits: "Phân biệt dòng người đi qua với vật cản cố định. AI không chứng nhận tuân thủ và không thay thế kiểm tra lối thoát trực tiếp.",
  },
  {
    id: "stationary-objects", icon: "search", title: "Vật thể lưu lại cần kiểm tra",
    brief: "Phát hiện vật thể mới xuất hiện và giữ nguyên vị trí tại những khu vực được lựa chọn.",
    inputs: "Video, thay đổi nền, thời gian lưu lại và vùng ưu tiên như lối vào hoặc hành lang.",
    signal: "Một vật thể mới ở trạng thái tĩnh vượt ngưỡng thời gian, cần xem xét ngữ cảnh.",
    action: "Nhân sự được đào tạo xác minh và thực hiện quy trình đồ thất lạc hoặc an ninh của địa điểm.",
    limits: "Không xác định chất nổ, chủ sở hữu hay mức độ nguy hiểm. Hành lý, vật tư và thiết bị sự kiện có thể tạo cảnh báo sai.",
  },
  {
    id: "possible-fall", icon: "headphones", title: "Dấu hiệu té ngã cần hỗ trợ",
    brief: "Hỗ trợ nhận diện một số chuyển động té ngã hoặc người nằm lại để đội ngũ kiểm tra kịp thời.",
    inputs: "Góc camera phù hợp, chuỗi chuyển động và tư thế quan sát được theo thời gian.",
    signal: "Dấu hiệu té ngã hoặc trạng thái nằm lại trong vùng theo dõi, cần nhân sự xác minh.",
    action: "Người vận hành kiểm tra video và điều phối đội sơ cứu khi có căn cứ theo quy trình sự kiện.",
    limits: "Ngồi, nhảy múa và che khuất có thể gây sai lệch. Không chẩn đoán y tế hoặc suy luận tình trạng sức khỏe từ hình ảnh.",
  },
  {
    id: "vehicle-pedestrian", icon: "truck", title: "Giao cắt phương tiện & người đi bộ",
    brief: "Theo dõi xe vào vùng đi bộ hoặc di chuyển sai hướng trong khu giao nhận và tuyến kỹ thuật.",
    inputs: "Video đã hiệu chỉnh, vùng xe và người, hướng lưu thông, lịch giao nhận được phê duyệt.",
    signal: "Phương tiện đi vào vùng dành cho người đi bộ hoặc vượt đường ảo theo hướng bị hạn chế.",
    action: "Điều phối viên xác minh, hướng dẫn lái xe và phân tách luồng di chuyển theo phương án hiện trường.",
    limits: "Không cần nhận diện biển số. Ước tính tốc độ, khoảng cách cần hiệu chỉnh; không dùng kết quả để tự kết luận lỗi hoặc trách nhiệm.",
  },
  {
    id: "heat-smoke", icon: "thermometer", title: "Nhiệt & khói bất thường",
    brief: "Hỗ trợ kiểm tra sớm các dấu hiệu bất thường quanh máy phát điện, khu bếp và thiết bị điện.",
    inputs: "Thiết bị ảnh nhiệt đo nhiệt độ phù hợp hoặc mô-đun phân tích khói được kiểm thử; sự kiện báo cháy nếu có tích hợp.",
    signal: "Biến đổi nhiệt hoặc dấu hiệu khói vượt tiêu chí đã thiết lập cho từng khu vực.",
    action: "Nhân sự phụ trách an toàn cháy kiểm tra và thực hiện phương án khẩn cấp đã được phê duyệt.",
    limits: "Khói sân khấu, hơi nước và ánh sáng có thể gây cảnh báo sai. Không thay thế hệ thống báo cháy được chứng nhận hoặc chỉ huy an toàn.",
  },
];

const infrastructure = [
  ["ip-video", "Camera, VMS & ghi hình", "Chọn góc nhìn, độ phân giải, bitrate và khả năng ghi hình theo vùng ưu tiên, thời gian hoạt động của sự kiện."],
  ["networking", "Mạng nội bộ & kết nối", "Thiết kế PoE, phân vùng mạng, băng thông và dự phòng. Xác định phương án vận hành khi mất đường truyền."],
  ["edge-industrial", "Xử lý tại hiện trường", "Thiết bị edge phù hợp môi trường triển khai, cân nhắc xử lý cục bộ để giảm nhu cầu truyền video ra ngoài."],
  ["ai-computing", "Năng lực suy luận AI", "Cấu hình GPU và phần mềm theo số camera, mô hình, tần suất xử lý và độ trễ cảnh báo đã thống nhất."],
  ["storage", "Lưu trữ & kiểm soát dữ liệu", "Thiết lập dung lượng, thời hạn lưu giữ, phân quyền, mã hóa và nhật ký truy cập theo mục đích được phê duyệt."],
];

export function eventSecurityPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "event-security");
  const contactUrl = `/contact?interest=${encodeURIComponent(solution.name)}`;
  const aiContactUrl = `/contact?interest=${encodeURIComponent("Event Security - Tư vấn ứng dụng AI")}`;

  return `${referenceHero({
    id: "event-security-title",
    title: "Event Security",
    subtitle: "An ninh sự kiện. Chủ động cùng AI.",
    description: solution.description,
    image: solution.image,
    imageAlt: "Góc nhìn từ trên cao của đám đông tại một sự kiện marathon, tư liệu tham khảo từ Watchtower",
    imageWidth: 1920,
    imageHeight: 1078,
    actions: `<div class="industry-hero-actions"><a class="home-button" href="${contactUrl}">Tư vấn an ninh sự kiện${icon("arrow-up-right")}</a><a class="industry-video-link" href="#event-ai">${icon("cpu")}Khám phá bài toán AI</a></div>`,
  })}

  <nav class="industry-section-nav" aria-label="Nội dung giải pháp Event Security"><div class="container" style="--industry-nav-count:4"><a href="#event-workflow"><span>01</span>Phương án triển khai${icon("arrow-right")}</a><a href="#event-ai"><span>02</span>Ứng dụng AI${icon("arrow-right")}</a><a href="#event-infrastructure"><span>03</span>Hạ tầng tích hợp${icon("arrow-right")}</a><a href="#event-consultation"><span>04</span>Tư vấn & phạm vi${icon("arrow-right")}</a></div></nav>

  <section class="container industry-overview" aria-labelledby="event-overview-title"><nav class="industry-breadcrumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a><span aria-hidden="true">/</span><a href="/solutions">Giải pháp</a><span aria-hidden="true">/</span><span aria-current="page">Event Security</span></nav><span class="industry-kicker" lang="en">${solution.label}</span><h2 id="event-overview-title" class="industry-section-title">Một kế hoạch. Nhiều lớp bảo vệ.</h2><div class="industry-overview-grid"><p>Từ lễ hội, hội chợ đến sự kiện thể thao, nhu cầu an ninh không chỉ nằm ở khu vực tập trung khách. Cần tính đến hậu trường, kho chứa tài sản tạm thời, tuyến giao nhận và lối thoát; kết hợp giám sát video, mạng tại địa điểm và nhân sự để theo dõi tình huống trong thời gian diễn ra sự kiện.</p><p>Trong mô hình tham khảo của Watchtower, camera được quản lý từ trung tâm báo động riêng và kết hợp lực lượng tại hiện trường. AQPTech tiếp cận từ tư vấn kiến trúc, thiết kế và khả năng tích hợp; trung tâm giám sát, lực lượng ứng phó và trách nhiệm liên hệ cơ quan chức năng phải được xác nhận theo phạm vi dự án, không mặc định là dịch vụ AQPTech cung cấp.</p></div></section>

  <section id="event-workflow" class="event-workflow" aria-labelledby="event-workflow-title"><div class="container"><span class="industry-kicker">01 / PHƯƠNG ÁN TRIỂN KHAI</span><h2 id="event-workflow-title" class="industry-section-title">Chuẩn bị trước. Phối hợp trong. Đánh giá sau.</h2><div class="event-workflow-layout"><ol class="event-workflow-steps">${workflow.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join("")}</ol><figure class="event-deployment"><img src="${deploymentImage}" alt="Thiết bị Watchtower đang được triển khai tại địa điểm sự kiện" width="1600" height="1200" loading="lazy"><figcaption>Ảnh triển khai tham khảo từ Watchtower Security Solutions, không phải nhân sự hoặc công trình của AQPTech.</figcaption></figure></div></div></section>

  <section id="event-ai" class="event-ai" aria-labelledby="event-ai-title"><div class="container"><span class="industry-kicker">02 / BÀI TOÁN AI ĐỀ XUẤT</span><h2 id="event-ai-title" class="industry-section-title">Phân tích tín hiệu. Hỗ trợ quyết định.</h2><p class="event-ai-intro">Tám kịch bản dưới đây là định hướng ứng dụng AI do AQPTech đề xuất để đánh giá theo dự án, không phải danh sách tính năng Watchtower đã xác nhận. Cảnh báo giúp ưu tiên việc kiểm tra, không tự kết luận vi phạm, ý đồ hay mức độ nguy hiểm.</p><div class="event-ai-grid">${aiCases.map((item, index) => `<article id="event-ai-${item.id}" class="event-ai-card" aria-labelledby="event-ai-${item.id}-title"><div class="event-ai-card-top"><span>AI / ${String(index + 1).padStart(2, "0")}</span>${icon(item.icon)}</div><h3 id="event-ai-${item.id}-title">${item.title}</h3><p>${item.brief}</p><details><summary>Xem kịch bản & điều kiện<span class="sr-only">: ${item.title}</span>${icon("chevron-down")}</summary><dl><div><dt>Dữ liệu đầu vào</dt><dd>${item.inputs}</dd></div><div><dt>Tín hiệu cảnh báo</dt><dd>${item.signal}</dd></div><div><dt>Con người xử lý</dt><dd>${item.action}</dd></div><div><dt>Giới hạn cần lưu ý</dt><dd>${item.limits}</dd></div></dl><a class="event-ai-consult" href="/contact?interest=${encodeURIComponent(`Event Security - AI: ${item.title}`)}">Trao đổi bài toán này${icon("arrow-up-right")}</a></details></article>`).join("")}</div><div class="event-alert-flow" role="group" aria-label="Quy trình xử lý cảnh báo AI"><span>Camera / cảm biến</span>${icon("arrow-right")}<span>Phân tích & tạo sự kiện</span>${icon("arrow-right")}<span>Nhân sự xác minh</span>${icon("arrow-right")}<span>Phối hợp ứng phó</span></div><p class="event-ai-note">Không có cam kết loại bỏ hoàn toàn cảnh báo sai hoặc phát hiện mọi sự cố. Quy trình thủ công và phương án dự phòng vẫn phải được duy trì.</p></div></section>

  <section id="event-infrastructure" class="container event-infrastructure" aria-labelledby="event-infrastructure-title"><span class="industry-kicker">03 / HẠ TẦNG TÍCH HỢP</span><h2 id="event-infrastructure-title" class="industry-section-title">Từ hiện trường đến bàn điều hành.</h2><div class="event-infrastructure-layout"><div><p>Cột camera cơ động, camera gắn container, bộ báo động cho phòng tạm hoặc ảnh nhiệt là những hình thức tham khảo từ Watchtower. Thiết bị thực tế được lựa chọn theo địa điểm, môi trường, thời gian lắp đặt và yêu cầu vận hành.</p><p>AQPTech cân đối hạ tầng tính toán, kết nối và lưu trữ cho phương án được thống nhất. Không mặc định mọi camera, nền tảng hoặc mô-đun đều tương thích.</p><div class="event-related"><h3>Kết nối các lớp giải pháp</h3><a href="/products/veolink">Veolink / Điều hành tích hợp${icon("arrow-up-right")}</a><a href="/products/intelligent-video-analytics">Intelligent Video Analytics${icon("arrow-up-right")}</a><a href="/solutions/gates-access">Gates & Access / Kiểm soát ra vào${icon("arrow-up-right")}</a></div></div><div class="event-infrastructure-list">${infrastructure.map(([slug, title, text]) => { const product = products.find((item) => item.slug === slug); return `<a href="/products/${slug}">${icon(product.icon)}<div><h3>${title}</h3><p>${text}</p><span>Xem nhóm hạ tầng: ${product.name}</span></div>${icon("arrow-up-right")}</a>`; }).join("")}</div></div></section>

  <section class="event-guardrails" aria-labelledby="event-guardrails-title"><div class="container"><span class="industry-kicker">ĐIỀU KIỆN TRIỂN KHAI</span><h2 id="event-guardrails-title" class="industry-section-title">An toàn và quyền riêng tư ngay từ thiết kế.</h2><div class="industry-benefit-grid"><article class="industry-benefit">${icon("shield-check")}<h3>Giới hạn dữ liệu & mục đích</h3><p>Ưu tiên số liệu tổng hợp, không nhận diện khuôn mặt, phân loại nhân khẩu học hoặc chấm điểm con người. Video gốc vẫn có thể là dữ liệu cá nhân: cần căn cứ xử lý, thông báo tại địa điểm, giới hạn vùng quay, phân quyền và thời hạn lưu giữ. Không giám sát khu vực riêng tư.</p></article><article class="industry-benefit">${icon("headphones")}<h3>Nhân sự xác minh & chỉ huy</h3><p>Thống nhất người nhận cảnh báo, quy trình kiểm tra và đầu mối điều phối. AI không thay thế lực lượng an ninh, sơ cứu, kiểm tra lối thoát hoặc hệ thống báo cháy được chứng nhận; không tự đưa ra quyết định bất lợi đối với người tham dự.</p></article><article class="industry-benefit">${icon("check-circle-2")}<h3>Kiểm thử trước khi vận hành</h3><p>Thực hiện thử nghiệm PoC với ngày/đêm, thời tiết, che khuất, cao điểm và hiệu ứng sân khấu. Đánh giá cảnh báo sai, bỏ sót, độ trễ, mất mạng và mất nguồn; thống nhất ngưỡng, tiêu chí nghiệm thu và phương án dự phòng.</p></article></div></div></section>

  <section id="event-consultation" class="container event-consultation" aria-labelledby="event-consultation-title"><span class="industry-kicker">04 / TƯ VẤN & PHẠM VI</span><h2 id="event-consultation-title" class="industry-section-title">Bắt đầu từ bài toán sự kiện của bạn.</h2><p>Chia sẻ loại sự kiện, địa điểm, thời gian dự kiến, quy mô ước tính và khu vực cần giám sát để cùng đánh giá phương án. Không gửi video người tham dự, mật khẩu, khóa truy cập hoặc dữ liệu nhạy cảm qua biểu mẫu liên hệ.</p><div class="event-consultation-actions"><a class="home-button" href="${contactUrl}">Trao đổi phương án sự kiện${icon("arrow-up-right")}</a><a class="event-ai-cta" href="${aiContactUrl}">Tư vấn ứng dụng AI${icon("arrow-up-right")}</a></div></section>`;
}
