import { solutions } from "./data.js";
import { industrySolutionPage } from "./industry-solution.js";
import facilityImage from "../assets/magal/images/aqp-oil-gas-facility.jpg";
import "./oil-gas.css";

export function oilGasPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "oil-gas");
  return industrySolutionPage({
    icon,
    solution,
    page: {
      hero: {
        subtitle: "Tăng cường an toàn. Duy trì vận hành liên tục.",
        description:
          "Cơ sở dầu khí cần một góc nhìn toàn diện về an toàn, an ninh và hoạt động khai thác. AQPTech hướng đến kết nối dữ liệu thời gian thực với dữ liệu lịch sử, tích hợp các hệ thống vận hành và môi trường để hỗ trợ ra quyết định kịp thời, giảm thiểu rủi ro và tăng khả năng ứng phó trước các mối đe dọa.",
        imageAlt: "Các tháp công nghệ và hệ thống đường ống tại cơ sở dầu khí vào buổi tối",
        imageWidth: 730,
        imageHeight: 1000,
        videoUrl: "https://www.youtube.com/watch?v=9Lw3nhERT5Q",
      },
      overview: {
        title: "Kết nối an toàn với hiệu quả vận hành",
        paragraphs: [
          "Dữ liệu phân tán giữa các hệ thống khai thác, bảo vệ và giám sát môi trường có thể làm chậm việc nhận diện nguy cơ. Hợp nhất thông tin hiện tại và lịch sử giúp đội ngũ điều hành nắm bắt tình huống, đánh giá xu hướng và phối hợp xử lý sự cố trên một góc nhìn chung.",
          "AQPTech tiếp cận từng dự án từ hiện trạng cơ sở, quy trình an toàn và yêu cầu duy trì hoạt động. GIS, phân tích video, cảm biến IoT, kiểm soát ra vào và các hệ thống hiện hữu được đánh giá cùng hạ tầng tính toán để xây dựng phương án tích hợp phù hợp.",
        ],
        systems: [
          ["HSE", "Sức khỏe, an toàn & môi trường"],
          ["GIS", "Bản đồ tài sản & sự kiện"],
          ["IoT", "Cảm biến tại hiện trường"],
          ["KPI", "Đo lường hiệu suất vận hành"],
        ],
      },
      capabilities: {
        title: "Chủ động trước rủi ro. Liên tục trong vận hành.",
        image: facilityImage,
        imageAlt: "Hệ thống tháp và thiết bị công nghệ trong khu vực nhà máy dầu khí",
        imageWidth: 800,
        imageHeight: 1400,
        items: [
          {
            id: "fast-decision-making",
            label: "Ra quyết định",
            title: "Ra quyết định nhanh, dựa trên dữ liệu",
            icon: "compass",
            points: [
              "Theo dõi tình huống thời gian thực để có cái nhìn tổng thể về hoạt động và hỗ trợ quyết định có cơ sở.",
              "Hợp nhất dữ liệu thời gian thực với dữ liệu lịch sử để nhận diện xu hướng và cung cấp thông tin có thể hành động.",
              "Giám sát các thông số vận hành, tối ưu quy trình và hỗ trợ phân bổ nguồn lực hiệu quả.",
            ],
          },
          {
            id: "integrated-capabilities",
            label: "Năng lực tích hợp",
            title: "Tích hợp hệ thống, mở rộng khả năng bảo vệ",
            icon: "network",
            points: [
              "GIS trực quan hóa vị trí tài sản, lực lượng và sự kiện trên bản đồ điều hành.",
              "Phân tích video thông minh hỗ trợ giám sát và quản lý cổng ra vào để cải thiện hiệu quả vận hành.",
              "Kết nối lực lượng tuần tra và ứng phó lưu động để phối hợp xử lý tình huống an ninh tại hiện trường.",
              "Tích hợp cảm biến phát hiện xâm nhập chu vi nhằm tăng khả năng nhận diện và cảnh báo các mối đe dọa.",
              "Khai thác nguồn dữ liệu bên ngoài để bổ sung bối cảnh và tạo góc nhìn vận hành đầy đủ hơn.",
            ],
          },
          {
            id: "pipeline-monitoring",
            label: "Giám sát đường ống",
            title: "Giám sát đường ống & tính toàn vẹn hệ thống",
            icon: "cctv",
            points: [
              "Phân tích an toàn hỗ trợ giám sát trang bị bảo hộ cá nhân (PPE), phát hiện lửa và khói; kết hợp cảm biến IoT để theo dõi dấu hiệu rò rỉ và nguy cơ tại hiện trường.",
              "Thiết kế các kịch bản giám sát chuyên biệt để chủ động giảm thiểu rủi ro và hỗ trợ duy trì hoạt động liên tục.",
              "Khả năng tích hợp robot và công nghệ chống thiết bị bay không người lái (anti-drone) được đánh giá theo phạm vi, điều kiện và quy định của từng dự án.",
              "Kết hợp hình ảnh nhiệt để bổ sung khả năng phát hiện bất thường và nhận diện mối đe dọa.",
            ],
          },
          {
            id: "performance-reports",
            label: "KPI & báo cáo",
            title: "KPI, báo cáo & kiểm soát vận hành",
            icon: "gauge",
            points: [
              "Phân tích các chỉ số hiệu suất chính (KPI) và báo cáo để phục vụ đánh giá hoạt động, lập kế hoạch và ra quyết định chiến lược.",
              "Tích hợp nhận diện khuôn mặt và kiểm soát truy cập để hỗ trợ xác minh danh tính, quản lý quyền ra vào theo chính sách của cơ sở.",
              "Kết nối các biện pháp an ninh mạng để bảo vệ dữ liệu và tài sản số của hệ thống.",
              "Nhận dạng biển số (LPR) hỗ trợ xác minh phương tiện, kết hợp quản lý cổng thông minh để điều phối luồng ra vào.",
              "Tích hợp hệ thống thông báo công cộng (Public Address) để truyền đạt hướng dẫn và hỗ trợ phối hợp khi xảy ra sự cố.",
            ],
          },
        ],
      },
      benefits: {
        lead: "Kết nối dữ liệu và các lớp bảo vệ giúp đơn vị vận hành dầu khí hướng đến giảm thiểu rủi ro, bảo vệ tài sản và nâng cao khả năng duy trì hoạt động trước các tình huống bất thường.",
        items: [
          {
            icon: "shield-check",
            title: "An toàn hơn, vận hành bền vững hơn",
            text: "Hợp nhất năng lực quản lý và tối ưu quy trình để nâng cao nhận thức tình huống, phối hợp bảo vệ và tăng khả năng ứng phó của cơ sở.",
          },
          {
            icon: "headphones",
            title: "Quản lý khẩn cấp hiệu quả",
            text: "Hỗ trợ chuẩn hóa quy trình an toàn và tuân thủ yêu cầu áp dụng. Kết hợp giám sát PPE, phát hiện té ngã, cảnh báo trộm cắp hoặc hành vi bạo lực để phối hợp xử lý sự cố.",
          },
          {
            icon: "settings-2",
            title: "Kiểm soát chi phí vận hành",
            text: "Hạn chế thời gian ngừng hoạt động và tối ưu sử dụng nguồn lực để hỗ trợ tăng năng suất, nâng cao hiệu quả khai thác và giảm chi phí phát sinh.",
          },
        ],
      },
      resources: {
        title: "Tìm hiểu thêm về giải pháp dầu khí",
        brochureUrl: "https://www.magalsolutions.com/wp-content/uploads/Oil-Gas-brochure-1.pdf",
        sourceName: "Oil & Gas",
      },
    },
  });
}
