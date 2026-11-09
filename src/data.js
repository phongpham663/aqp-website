import dataCenter from "../assets/velasea/images/telecommunications-data-center-1280x720--06002ae1ee.jpg";
import server from "../assets/velasea/images/rack-server_bezel-980x654--4203de8b61.jpg";
import engineer from "../assets/velasea/images/network-engineer-980x653--a96e90e759.jpg";
import industry from "../assets/velasea/images/industrial-conveyor-980x653--3ff4b4cb38.jpg";
import city from "../assets/velasea/images/smart-city-traffic-cameras-980x585--ebfaa7161b.jpg";
import network from "../assets/velasea/images/network-switch_red-scaled-e1731716154561-980x551--5e162e898b.jpg";
import nvr from "../assets/velasea/images/NVR-server-980x551--ebeb61bd13.jpg";
import edge from "../assets/velasea/images/industrial-panel-pc-980x551--c5987b2ce0.jpg";
import logistics from "../assets/velasea/images/warehouse-980x695--85dcc69407.jpg";
import retail from "../assets/velasea/images/mixed-use-development-retail-980x654--b149e661be.jpg";
import seaports from "../assets/magal/images/aqp-seaports-hero.jpg";
import oilGas from "../assets/magal/images/aqp-oil-gas-hero.jpg";
import nationalBorders from "../assets/magal/images/aqp-national-borders-hero.jpg";
import criticalSites from "../assets/magal/images/aqp-critical-sites-hero.jpg";
import veolink from "../assets/magal/images/Hero-1--899515197d.png";
import videoAnalytics from "../assets/magal/images/Mask-Group-318--7540d761be.png";
import gatesAccess from "../assets/magal/images/Mask-Group-317--578a0a2517.webp";
import eventSecurity from "../assets/watchtower/event-security/images/event-security-hero-1920.jpg";
import constructionSite from "../assets/watchtower/construction-site-security/images/construction-site-hero.webp";
import storeAnalytics from "../assets/opretail/images/store-hero.webp";

export const images = {
  dataCenter,
  server,
  engineer,
  industry,
  city,
  network,
  nvr,
  edge,
  logistics,
  retail,
};

export const companyContact = {
  email: "contact@aqptech.vn",
  phone: "0378053305",
  phoneHref: "tel:+84378053305",
  offices: [
    {
      name: "Phòng Kinh Doanh",
      address: "491/1 Trường Chinh, Phường Tân Bình, Thành phố Hồ Chí Minh",
      lang: "vi",
    },
    {
      name: "Phòng Nghiên cứu và Phát triển",
      address: "216/1 Điện Biên Phủ, Phường Xuân Hòa, Hồ Chí Minh",
      lang: "vi",
    },
    {
      name: "Phòng Thí nghiệm và Đào tạo",
      address: "Lot E2-M1, Saigon Hi-Tech Park (SHTP), Tang Nhon Phu Ward, Ho Chi Minh City",
      lang: "en",
    },
  ],
};

export const products = [
  {
    slug: "ai-computing",
    name: "AI & GPU Computing",
    category: "AI & Edge",
    icon: "cpu",
    image: server,
    tagline: "Sức mạnh tính toán cho những ý tưởng lớn.",
    description:
      "Hạ tầng GPU cho suy luận AI, thị giác máy tính và các tác vụ xử lý chuyên sâu. Cấu hình được lựa chọn theo mô hình, dữ liệu và quy mô triển khai thực tế.",
    features: [
      "Lựa chọn GPU theo tải huấn luyện và suy luận",
      "Cân đối CPU, bộ nhớ, nguồn và tản nhiệt",
      "Triển khai từ trung tâm dữ liệu đến biên",
    ],
    applications: "Phân tích hình ảnh, trợ lý AI, nghiên cứu và mô phỏng.",
  },
  {
    slug: "servers",
    name: "Máy chủ doanh nghiệp",
    category: "Máy chủ",
    icon: "server",
    image: server,
    tagline: "Nền tảng ổn định. Khả năng mở rộng linh hoạt.",
    description:
      "Máy chủ rack và tower cho ứng dụng doanh nghiệp, ảo hóa và xử lý dữ liệu. Thiết kế hướng đến tính ổn định, khả năng quản trị và nhu cầu nâng cấp dài hạn.",
    features: [
      "Cấu hình theo ứng dụng và số người dùng",
      "Thiết kế dự phòng nguồn và lưu trữ",
      "Quản trị từ xa và giám sát hệ thống",
    ],
    applications: "Ảo hóa, cơ sở dữ liệu, ứng dụng ERP và trung tâm dữ liệu.",
  },
  {
    slug: "storage",
    name: "Hệ thống lưu trữ",
    category: "Lưu trữ",
    icon: "database",
    image: dataCenter,
    tagline: "Dữ liệu sẵn sàng. Doanh nghiệp tiếp bước.",
    description:
      "Giải pháp lưu trữ tập trung và sao lưu được thiết kế theo dung lượng, tốc độ truy cập, thời gian lưu giữ và yêu cầu khôi phục của doanh nghiệp.",
    features: [
      "Lựa chọn NAS, SAN hoặc lưu trữ máy chủ",
      "Đánh giá RAID và dung lượng hữu dụng",
      "Xây dựng phương án sao lưu và khôi phục",
    ],
    applications: "Lưu trữ video, dữ liệu dùng chung và sao lưu hệ thống.",
  },
  {
    slug: "ip-video",
    name: "Giám sát IP & NVR",
    category: "Giám sát",
    icon: "cctv",
    image: nvr,
    tagline: "Nhìn rõ hơn. Vận hành an tâm hơn.",
    description:
      "Hệ thống ghi hình và quản lý video theo số lượng camera, bitrate, thời gian lưu trữ và yêu cầu phân tích. Phần cứng được cân đối cho toàn bộ luồng dữ liệu.",
    features: [
      "Tính toán băng thông và dung lượng ghi hình",
      "Lựa chọn cấu hình theo nền tảng VMS",
      "Kết hợp phân tích video và kiểm soát truy cập",
    ],
    applications: "Nhà máy, tòa nhà, bán lẻ và hệ thống giám sát đa điểm.",
  },
  {
    slug: "networking",
    name: "Hạ tầng mạng",
    category: "Kết nối",
    icon: "network",
    image: network,
    tagline: "Kết nối liền mạch, từ lõi đến biên.",
    description:
      "Thiết kế hạ tầng kết nối cho dữ liệu, camera và thiết bị công nghiệp. Kiến trúc mạng được xây dựng theo tải sử dụng, phân vùng và yêu cầu bảo mật.",
    features: [
      "Switch, PoE và kết nối tốc độ cao",
      "Phân vùng mạng và kiểm soát truy cập",
      "Thiết kế dự phòng và theo dõi hiệu năng",
    ],
    applications: "Mạng doanh nghiệp, trung tâm dữ liệu và hệ thống camera IP.",
  },
  {
    slug: "edge-industrial",
    name: "Edge & Industrial PC",
    category: "AI & Edge",
    icon: "factory",
    image: edge,
    tagline: "Đưa năng lực xử lý đến nơi cần nhất.",
    description:
      "Máy tính công nghiệp và thiết bị edge cho tự động hóa, thu thập dữ liệu và thị giác máy tính tại hiện trường, được chọn theo điều kiện môi trường thực tế.",
    features: [
      "Lựa chọn thiết kế không quạt và cổng I/O",
      "Đánh giá nhiệt độ, độ rung và vị trí lắp đặt",
      "Tích hợp thiết bị ngoại vi và ứng dụng AI",
    ],
    applications: "Dây chuyền sản xuất, kiosk, IoT và điều khiển công nghiệp.",
  },
  {
    slug: "veolink",
    name: "Veolink",
    category: "Phần mềm",
    tagline: "Nhiều hệ thống. Một nền tảng điều hành.",
    icon: "network",
    image: veolink,
    label: "INTEGRATED OPERATIONS / C5I",
    description:
      "Kết nối hệ thống giám sát, cảm biến và dữ liệu trên một nền tảng điều hành thống nhất. Hỗ trợ quản lý vận hành hằng ngày, phối hợp xử lý sự cố và mở rộng theo nhu cầu.",
    features: [
      "Tích hợp các hệ thống và cảm biến",
      "Trực quan hóa và xử lý dữ liệu thời gian thực",
      "Quản lý sự cố, nguồn lực và phối hợp ứng phó",
    ],
    productSlugs: ["ip-video", "ai-computing", "networking"],
    applications: "Điều hành tích hợp C5I, giám sát đa hệ thống và phối hợp xử lý sự cố.",
  },
  {
    slug: "intelligent-video-analytics",
    name: "Intelligent Video Analytics",
    category: "Phần mềm",
    tagline: "Từ hình ảnh đến thông tin hữu ích.",
    icon: "cctv",
    image: videoAnalytics,
    label: "INTELLIGENT VIDEO ANALYTICS / IVA",
    description:
      "Phân tích video thông minh giúp nhận diện nguy cơ an toàn, an ninh và khai thác thông tin vận hành từ hình ảnh. Kết nối với hệ thống hiện hữu để hỗ trợ cảnh báo thời gian thực và giảm phụ thuộc vào việc theo dõi thủ công liên tục.",
    features: [
      "Giám sát an toàn và môi trường làm việc",
      "Phát hiện xâm nhập và quản lý khu vực hạn chế",
      "Theo dõi hoạt động và nâng cao hiệu quả vận hành",
    ],
    productSlugs: ["ip-video", "ai-computing", "edge-industrial"],
    applications: "Phân tích an toàn, an ninh và hoạt động từ video theo từng kịch bản triển khai.",
  },
];

export const catalogProducts = products.filter((item) => ["veolink", "intelligent-video-analytics"].includes(item.slug));

export const solutions = [
  {
    slug: "gates-access",
    completed: true,
    name: "Gates & Access",
    menuName: "Cổng & kiểm soát ra vào",
    icon: "key-round",
    image: gatesAccess,
    label: "GATES & ACCESS / ACS",
    description:
      "Kiểm soát ra vào giúp xác thực người dùng, bảo vệ tài sản và quản lý khu vực hạn chế. Kết nối đầu đọc, khóa điện tử, thiết bị sinh trắc học và dữ liệu sự kiện để hỗ trợ quản trị quyền truy cập trên một nền tảng thống nhất.",
    needs: [
      "Xác thực và phân quyền theo vai trò",
      "Quản trị tập trung, giám sát và truy vết sự kiện",
      "Tích hợp an ninh và hệ thống tòa nhà thông minh",
    ],
    productSlugs: ["ip-video", "networking", "edge-industrial"],
  },
  {
    slug: "event-security",
    completed: true,
    name: "Event Security",
    menuName: "An ninh sự kiện",
    icon: "shield-check",
    image: eventSecurity,
    label: "EVENT SECURITY / AI-ASSISTED OPERATIONS",
    description:
      "Kết hợp giám sát video, hạ tầng kết nối và phân tích AI để hỗ trợ bảo vệ sự kiện. Từ khu vực công cộng đến hậu trường và kho tạm, phương án được xây dựng theo mặt bằng, rủi ro và quy trình phối hợp thực tế.",
    needs: [
      "Giám sát khu vực tổ chức và điều phối an ninh",
      "Phân tích mật độ, hàng chờ và cảnh báo bằng AI",
      "Kết nối dữ liệu với đội ngũ vận hành tại hiện trường",
    ],
    productSlugs: ["ip-video", "networking", "edge-industrial", "ai-computing", "storage"],
  },
  {
    slug: "construction-site-security",
    completed: true,
    name: "An ninh công trường",
    icon: "cctv",
    image: constructionSite,
    label: "CONSTRUCTION SITE SECURITY",
    description:
      "Kết hợp camera cơ động, phân tích video và quy trình xác minh cảnh báo để hỗ trợ bảo vệ vật tư, thiết bị và các vùng ưu tiên tại công trường. Phương án được xây dựng theo mặt bằng, tiến độ thi công và phạm vi dịch vụ được thống nhất.",
    needs: [
      "Giám sát vật tư, máy móc và khu vực thi công",
      "Triển khai linh hoạt theo mặt bằng và tiến độ",
      "Xác minh cảnh báo và phối hợp theo quy trình",
    ],
    productSlugs: ["ip-video", "networking", "edge-industrial", "ai-computing", "storage"],
  },
  {
    slug: "seaports-terminals",
    completed: true,
    name: "Cảng biển & bến cảng",
    icon: "ship",
    image: seaports,
    label: "SEAPORTS & TERMINALS",
    description:
      "Kết nối dữ liệu vận hành, giám sát an toàn và an ninh để hỗ trợ quản lý cảng biển, bến cảng trên một nền tảng tích hợp.",
    needs: [
      "Bảng điều hành vận hành tập trung",
      "Quản lý an toàn và an ninh",
      "Tích hợp GIS, phân tích video và hệ thống cảng",
    ],
    productSlugs: ["ip-video", "ai-computing", "networking"],
  },
  {
    slug: "oil-gas",
    completed: true,
    name: "Dầu khí",
    icon: "fuel",
    image: oilGas,
    label: "OIL & GAS",
    description:
      "Kết nối dữ liệu vận hành, an toàn và an ninh để hỗ trợ bảo vệ cơ sở dầu khí, quản lý rủi ro và duy trì hoạt động liên tục.",
    needs: [
      "Nhận thức tình huống và ra quyết định kịp thời",
      "Tích hợp GIS, video và cảm biến hiện trường",
      "Giám sát đường ống và phát hiện nguy cơ",
      "Theo dõi KPI và báo cáo vận hành",
    ],
    productSlugs: ["ip-video", "edge-industrial", "networking"],
  },
  {
    slug: "national-borders",
    completed: true,
    name: "Biên giới quốc gia",
    icon: "shield-check",
    image: nationalBorders,
    label: "NATIONAL BORDERS",
    description:
      "Kết nối giám sát, phát hiện xâm nhập và dữ liệu điều hành để hỗ trợ bảo vệ tuyến biên giới, xác minh tại cửa khẩu và phối hợp ứng phó kịp thời.",
    needs: [
      "Giám sát tuyến biên giới ngày và đêm",
      "Phát hiện xâm nhập và xác minh danh tính",
      "Hợp nhất dữ liệu và phân tích tình huống",
      "Bảo mật thông tin và điều hành tập trung",
    ],
    productSlugs: ["ip-video", "ai-computing", "networking"],
  },
  {
    slug: "critical-sites",
    completed: true,
    name: "Cơ sở trọng yếu",
    icon: "building-2",
    image: criticalSites,
    label: "CRITICAL SITES",
    description:
      "Kết nối giám sát, kiểm soát ra vào và điều hành an ninh để hỗ trợ bảo vệ sân bay, cơ sở hạ tầng trọng yếu và duy trì hoạt động liên tục.",
    needs: [
      "Giám sát và phát hiện nguy cơ",
      "Bảo vệ chu vi và kiểm soát ra vào",
      "Phối hợp xử lý sự cố trên nền tảng tích hợp",
    ],
    productSlugs: ["ip-video", "ai-computing", "networking"],
  },
  {
    slug: "store-analytics",
    completed: true,
    name: "Store Analytics",
    menuName: "Store Analytics - Phân tích cửa hàng",
    icon: "chart-no-axes-combined",
    image: storeAnalytics,
    label: "STORE ANALYTICS",
    description:
      "Kết nối dữ liệu lượt khách, hành vi mua sắm và hiệu quả điểm bán trên một nền tảng phân tích. Hiểu nhịp vận hành, đánh giá trải nghiệm khách hàng và hỗ trợ ra quyết định cho từng cửa hàng hoặc toàn chuỗi.",
    needs: [
      "Theo dõi lưu lượng và xu hướng lượt khách",
      "Phân tích thời gian dừng, bản đồ nhiệt và hàng đợi",
      "Kết hợp dữ liệu điểm bán để đánh giá KPI đa cửa hàng",
    ],
    productSlugs: ["ip-video", "ai-computing", "edge-industrial", "networking"],
  },
  {
    slug: "factory-intelligence",
    completed: true,
    name: "Factory Intelligence",
    menuName: "Factory Intelligence - Nhà máy thông minh",
    icon: "factory",
    image: industry,
    label: "FACTORY INTELLIGENCE",
    description:
      "Kết nối dữ liệu máy móc, thiết bị và dây chuyền để hiểu rõ hoạt động sản xuất. Kết hợp thu thập tại biên, phân tích OEE và thông tin vận hành để hỗ trợ cải tiến từ từng tài sản đến toàn nhà máy.",
    needs: [
      "Thu thập và chuẩn hóa dữ liệu từ máy móc, cảm biến và hệ thống hiện có",
      "Phân tích OEE, thời gian dừng, chu kỳ sản xuất và tổn thất",
      "Kết nối KPI nhà máy với ERP, MES, IoT và công cụ BI theo dự án",
    ],
    productSlugs: ["edge-industrial", "ai-computing", "networking", "storage"],
  },
  {
    slug: "data-centers",
    name: "Trung tâm dữ liệu",
    icon: "server",
    image: dataCenter,
    label: "DATA CENTER",
    description:
      "Kiến trúc máy chủ, lưu trữ và mạng cho một nền tảng dữ liệu ổn định, dễ quản trị và sẵn sàng mở rộng.",
    needs: [
      "Đánh giá tải và khả năng tăng trưởng",
      "Thiết kế kiến trúc ảo hóa và lưu trữ",
      "Dự phòng, sao lưu và giám sát vận hành",
    ],
    productSlugs: ["servers", "storage", "networking"],
  },
  {
    slug: "industrial",
    name: "Công nghiệp & sản xuất",
    icon: "factory",
    image: industry,
    label: "SMART INDUSTRY",
    description:
      "Kết nối dữ liệu, tự động hóa và xử lý tại biên để xây dựng quy trình sản xuất thông minh hơn.",
    needs: [
      "Thu thập dữ liệu từ thiết bị hiện trường",
      "Thị giác máy tính cho kiểm tra chất lượng",
      "Phần cứng phù hợp môi trường nhà máy",
    ],
    productSlugs: ["edge-industrial", "ai-computing", "networking"],
  },
  {
    slug: "smart-cities",
    name: "Đô thị & hạ tầng",
    icon: "building-2",
    image: city,
    label: "CONNECTED CITY",
    description:
      "Hạ tầng tính toán và video giúp kết nối các điểm giám sát, hỗ trợ quản lý đô thị và công trình.",
    needs: [
      "Quản lý video tập trung và đa điểm",
      "Phân tích sự kiện với AI tại biên",
      "Thiết kế lưu trữ và kết nối dự phòng",
    ],
    productSlugs: ["ip-video", "ai-computing", "storage"],
  },
  {
    slug: "logistics",
    name: "Kho vận & logistics",
    icon: "truck",
    image: logistics,
    label: "LOGISTICS",
    description:
      "Hệ thống hỗ trợ theo dõi hàng hóa, giám sát kho bãi và liên kết dữ liệu trong chuỗi cung ứng.",
    needs: [
      "Giám sát khu vực kho và điểm xuất nhập",
      "Kết nối ứng dụng quản lý kho",
      "Xử lý dữ liệu tại các điểm vận hành",
    ],
    productSlugs: ["edge-industrial", "ip-video", "servers"],
  },
  {
    slug: "retail",
    name: "Bán lẻ & tòa nhà",
    icon: "store",
    image: retail,
    label: "RETAIL & BUILDINGS",
    description:
      "Nền tảng công nghệ cho vận hành tòa nhà, trải nghiệm khách hàng và giám sát nhiều chi nhánh.",
    needs: [
      "Giám sát và quản lý từ xa",
      "Kết nối các điểm bán và hệ thống nội bộ",
      "Phân tích video theo nhu cầu vận hành",
    ],
    productSlugs: ["ip-video", "networking", "edge-industrial"],
  },
  {
    slug: "education",
    name: "Giáo dục & nghiên cứu",
    icon: "graduation-cap",
    image: server,
    label: "EDUCATION & RESEARCH",
    description:
      "Hạ tầng tính toán cho phòng thí nghiệm, mô phỏng, nghiên cứu AI và dịch vụ số trong giáo dục.",
    needs: [
      "Tính toán GPU cho nghiên cứu",
      "Lưu trữ và chia sẻ dữ liệu",
      "Ảo hóa môi trường học tập và ứng dụng",
    ],
    productSlugs: ["ai-computing", "servers", "storage"],
  },
];

export const completedSolutions = solutions.filter((solution) => solution.completed);

export const services = [
  {
    slug: "oem",
    name: "Thiết kế hệ thống OEM",
    icon: "blocks",
    tag: "BUILT FOR YOUR BUSINESS",
    description:
      "Biến yêu cầu phần mềm và sản phẩm của bạn thành một hệ thống phần cứng nhất quán, có thể triển khai và nhân rộng.",
    features: [
      "Phân tích yêu cầu và lựa chọn nền tảng",
      "Tùy chỉnh cấu hình và nhận diện theo dự án",
      "Kiểm thử tương thích và chuẩn hóa cấu hình",
      "Lập kế hoạch cung ứng và vòng đời sản phẩm",
    ],
  },
  {
    slug: "integration",
    name: "Tích hợp & triển khai",
    icon: "settings-2",
    tag: "FROM DESIGN TO DEPLOYMENT",
    description:
      "Một đầu mối xuyên suốt từ thiết kế, tích hợp, kiểm thử đến bàn giao. Giảm khoảng cách giữa bản vẽ kỹ thuật và hệ thống vận hành thực tế.",
    features: [
      "Khảo sát hiện trạng và tư vấn kiến trúc",
      "Cài đặt, cấu hình và tích hợp ứng dụng",
      "Kiểm thử tải và nghiệm thu theo yêu cầu",
      "Tài liệu vận hành và hướng dẫn bàn giao",
    ],
  },
  {
    slug: "lifecycle",
    name: "Đồng hành vòng đời",
    icon: "shield-check",
    tag: "BEYOND THE DEPLOYMENT",
    description:
      "Hệ thống cần được chăm sóc sau khi đưa vào sử dụng. Xây dựng kế hoạch bảo trì, quản trị và nâng cấp phù hợp với nhu cầu vận hành.",
    features: [
      "Tư vấn theo dõi và quản trị từ xa",
      "Phối hợp xử lý sự cố và bảo hành",
      "Đánh giá nhu cầu nâng cấp định kỳ",
      "Lập kế hoạch thay thế và chuyển đổi",
    ],
  },
];

export const articles = [
  {
    slug: "edge-ai",
    category: "AI & EDGE",
    time: "6 phút đọc",
    title: "Edge AI: đưa trí tuệ nhân tạo đến gần dữ liệu hơn",
    image: edge,
    summary:
      "Khi độ trễ, băng thông và quyền riêng tư trở thành ưu tiên, xử lý tại biên mở ra một hướng triển khai AI thực tế.",
    sections: [
      [
        "Vì sao xử lý tại biên?",
        "Thay vì gửi mọi dữ liệu về trung tâm, Edge AI xử lý dữ liệu ngay tại camera, gateway hoặc máy tính công nghiệp. Cách tiếp cận này có thể giảm độ trễ và lưu lượng truyền tải, đặc biệt ở những nơi kết nối không ổn định.",
      ],
      [
        "Chọn phần cứng từ bài toán thực tế",
        "Hãy bắt đầu bằng số luồng dữ liệu, độ phân giải, mô hình AI và thời gian phản hồi cần đạt. CPU, GPU hoặc bộ tăng tốc cần được lựa chọn cùng bộ nhớ, giao tiếp I/O và điều kiện tản nhiệt. Không có một cấu hình duy nhất phù hợp với mọi mô hình.",
      ],
      [
        "Đừng bỏ qua vận hành",
        "Một mô hình chạy tốt trong phòng thử nghiệm chưa chắc ổn định ngoài hiện trường. Cần kiểm tra nhiệt độ, nguồn điện, khả năng cập nhật từ xa, an toàn dữ liệu và phương án phục hồi trước khi nhân rộng.",
      ],
    ],
  },
  {
    slug: "nvr-storage",
    category: "HẠ TẦNG & LƯU TRỮ",
    time: "5 phút đọc",
    title: "Thiết kế lưu trữ cho giám sát IP: không chỉ là dung lượng",
    image: nvr,
    summary:
      "Số lượng camera chỉ là điểm khởi đầu. Bitrate, thời gian lưu giữ và tốc độ ghi quyết định cấu hình phù hợp.",
    sections: [
      [
        "Bắt đầu với luồng video",
        "Dung lượng lưu trữ phụ thuộc vào bitrate trung bình, số lượng camera, thời gian ghi mỗi ngày và thời gian lưu giữ. Với hệ thống có bitrate biến đổi, cần đo hoặc ước lượng theo điều kiện hình ảnh thực tế và dành dư địa cho tăng trưởng.",
      ],
      [
        "Dung lượng thô không phải dung lượng sử dụng",
        "RAID, ổ dự phòng và hệ thống tệp đều ảnh hưởng đến dung lượng hữu dụng. Cần tính cả tốc độ ghi đồng thời và khả năng đọc khi người dùng truy xuất video trong giờ cao điểm.",
      ],
      [
        "Xây dựng phương án khôi phục",
        "RAID không thay thế cho sao lưu. Hãy xác định dữ liệu nào cần bảo vệ riêng, thời gian chấp nhận gián đoạn và quy trình thay ổ hoặc phục hồi sau sự cố.",
      ],
    ],
  },
  {
    slug: "oem-checklist",
    category: "GÓC NHÌN KỸ THUẬT",
    time: "7 phút đọc",
    title: "Từ ý tưởng đến hệ thống: chuẩn bị gì cho một dự án OEM?",
    image: engineer,
    summary:
      "Một bộ yêu cầu rõ ràng giúp phần cứng, phần mềm và kế hoạch cung ứng đi cùng một hướng ngay từ đầu.",
    sections: [
      [
        "Mô tả ứng dụng trước cấu hình",
        "Liệt kê chức năng của sản phẩm, môi trường lắp đặt, số người dùng và các chỉ số hiệu năng cần đạt. Những thông tin này là cơ sở để cân đối phần cứng thay vì bắt đầu bằng một danh sách linh kiện.",
      ],
      [
        "Kiểm thử trước khi chuẩn hóa",
        "Tạo cấu hình mẫu, chạy ứng dụng thực tế và ghi lại kết quả kiểm thử. Cần xác nhận tương thích driver, firmware, khả năng phục hồi và độ ổn định khi tải cao.",
      ],
      [
        "Tính đến toàn bộ vòng đời",
        "Dự án OEM cần kế hoạch cho nguồn cung, thay đổi linh kiện, cập nhật phần mềm và xử lý bảo hành. Thống nhất tiêu chí nghiệm thu và trách nhiệm của các bên giúp giảm rủi ro khi triển khai nhiều hệ thống.",
      ],
    ],
  },
];
