import { industrySolutionPage } from "./industry-solution.js";
import { solutions } from "./data.js";
import terminalImage from "../assets/magal/images/aqp-seaports-terminal.jpg";

export function seaportsPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "seaports-terminals");
  const capabilities = [
    {
      id: "operational-dashboards",
      label: "Điều hành vận hành",
      title: "Bảng điều hành vận hành",
      icon: "blocks",
      points: [
        "Hợp nhất dữ liệu từ nhiều nguồn để tạo góc nhìn tổng thể và hỗ trợ hành động kịp thời.",
        "Kết nối các hệ thống nghiệp vụ như TOS, GOS và VTS trên giao diện điều hành chung.",
        "Phân tích, dự báo điểm nghẽn để hỗ trợ tối ưu luồng hàng hóa và hoạt động khai thác cảng.",
        "Thiết kế khả năng mở rộng theo sản lượng, quy mô bến bãi và yêu cầu hiệu năng.",
      ],
    },
    {
      id: "safety-security",
      label: "An toàn & an ninh",
      title: "Quản lý an toàn & an ninh tập trung",
      icon: "shield-check",
      points: [
        "Quản lý sự kiện và phối hợp xử lý sự cố để hỗ trợ phản ứng nhanh, đúng quy trình.",
        "Bộ quy tắc thông minh (Smart Rule Engine) giúp tự động hóa luồng công việc, phát cảnh báo và kích hoạt hành động theo kịch bản.",
        "Tích hợp các mô-đun sức khỏe, an toàn và môi trường (HSE), cùng công cụ cộng tác để hỗ trợ tuân thủ quy trình và quy định áp dụng.",
      ],
    },
    {
      id: "integrated-capabilities",
      label: "Năng lực tích hợp",
      title: "Mở rộng năng lực vận hành tích hợp",
      icon: "network",
      points: [
        "Hệ thống thông tin địa lý (GIS) trực quan hóa vị trí tài sản, phương tiện và sự kiện trên bản đồ.",
        "Phân tích video hỗ trợ giám sát thời gian thực, phát hiện đối tượng và nhận diện sự kiện.",
        "Kết nối hệ thống hải quan và nền tảng logistics để trao đổi dữ liệu, hỗ trợ hoạt động xuyên suốt chuỗi cung ứng.",
      ],
    },
  ];
  const benefits = [
    {
      icon: "chart-no-axes-combined",
      title: "Nâng cao hiệu quả vận hành",
      text: "Tối ưu luồng hàng hóa, giảm chậm trễ cho tàu và xe tải. GIS, video hoặc mô hình bản sao số giúp theo dõi chuyển động hàng hóa và trạng thái thiết bị xếp dỡ.",
    },
    {
      icon: "truck",
      title: "Cải thiện hoạt động tại cổng",
      text: "Tích hợp GOS và xác minh tự động xe tải, tài xế, container để hỗ trợ rút ngắn thời gian chờ và tăng khả năng thông qua cổng.",
    },
    {
      icon: "settings-2",
      title: "Tối ưu sử dụng nguồn lực",
      text: "Hạn chế thời gian ngừng hoạt động, điều phối thiết bị và nhân sự theo nhu cầu thực tế để nâng cao năng suất và kiểm soát chi phí.",
    },
    {
      icon: "compass",
      title: "Ra quyết định kịp thời",
      text: "Kết hợp nhận thức tình huống thời gian thực với dữ liệu hợp nhất để tối ưu quy trình, phân bổ nguồn lực và đưa ra quyết định có cơ sở.",
    },
    {
      icon: "shield-check",
      title: "Tăng cường an toàn",
      text: "Giám sát hoạt động của tàu và khu vực khai thác, phát hiện nguy cơ tiềm ẩn và hỗ trợ đội ngũ vận hành xử lý sớm các tình huống mất an toàn.",
    },
    {
      icon: "gauge",
      title: "Đo lường hiệu suất",
      text: "Tổng hợp thống kê và các chỉ số hiệu suất chính (KPI) để đánh giá hoạt động, theo dõi xu hướng và xác định cơ hội cải tiến khai thác cảng.",
    },
  ];
  const systems = [
    ["TOS", "Quản lý khai thác bến cảng"],
    ["GOS", "Điều hành cổng ra vào"],
    ["PMIS", "Quản lý thông tin cảng"],
    ["VTS", "Giám sát giao thông tàu"],
  ];

  return industrySolutionPage({
    icon,
    solution,
    page: {
      hero: {
        subtitle: "Nâng cao hiệu quả vận hành. Kết nối an toàn & an ninh.",
        description:
          "Sản lượng hàng hóa tăng, nguy cơ an ninh và yêu cầu về môi trường đặt ra những thách thức mới cho cảng biển. AQPTech hướng đến kết nối hệ thống khai thác, dữ liệu và giám sát để hỗ trợ điều hành thời gian thực, phản ứng kịp thời và vận hành bền vững.",
        imageAlt: "Tàu container và hệ thống cần cẩu tại cảng biển vào buổi tối",
        imageWidth: 730,
        imageHeight: 940,
        videoUrl: "https://www.youtube.com/watch?v=dUytsxdoidc",
      },
      overview: {
        title: "Một góc nhìn chung cho toàn bộ cảng",
        paragraphs: [
          "Khi dữ liệu khai thác, kiểm soát ra vào và giám sát được kết nối, đội ngũ điều hành có thể theo dõi tình hình tổng thể thay vì xử lý từng hệ thống riêng lẻ. Việc tích hợp TOS, GOS, PMIS và VTS giúp tăng khả năng phối hợp, nhận diện điểm nghẽn và ứng phó với sự cố, đồng thời tăng cường bảo vệ trước nguy cơ xâm nhập, khủng bố và cướp biển.",
          "AQPTech tiếp cận bài toán từ hiện trạng hạ tầng, quy trình khai thác và yêu cầu an toàn của từng cảng. Phần cứng, phần mềm, khả năng kết nối và tiêu chí hiệu năng được đánh giá cùng nhau để xây dựng phương án triển khai phù hợp.",
        ],
        systems,
      },
      capabilities: {
        title: "Từ dữ liệu đến hành động",
        image: terminalImage,
        imageAlt: "Cần cẩu và bãi container trong khu vực khai thác bến cảng",
        imageWidth: 800,
        imageHeight: 1000,
        items: capabilities,
      },
      benefits: {
        lead: "Kết nối các năng lực kỹ thuật giúp cảng biển hướng đến hiệu quả khai thác cao hơn, tăng cường an ninh và ra quyết định dựa trên dữ liệu để cải thiện hiệu suất vận hành.",
        items: benefits,
      },
      resources: {
        title: "Tìm hiểu thêm về giải pháp cảng biển",
        brochureUrl: "https://www.magalsolutions.com/wp-content/uploads/Seaport-brochure-1.pdf",
        sourceName: "Seaports & Terminals",
      },
    },
  });
}
