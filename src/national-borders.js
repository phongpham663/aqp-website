import { solutions } from "./data.js";
import { industrySolutionPage } from "./industry-solution.js";
const fenceImage = "/assets/magal/images/aqp-national-borders-fence.jpg";

export function nationalBordersPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "national-borders");
  return industrySolutionPage({
    icon,
    solution,
    page: {
      hero: {
        subtitle: "Tăng cường an ninh tuyến đầu. Kết nối toàn tuyến biên giới.",
        description:
          "Biên giới là tuyến đầu bảo vệ chủ quyền và an ninh quốc gia. Địa hình rộng, điều kiện thời tiết thay đổi và nguy cơ vượt biên trái phép đặt ra yêu cầu giám sát nhiều lớp. AQPTech hướng đến kết nối cảm biến, hình ảnh và dữ liệu điều hành để hỗ trợ phát hiện sớm, xác minh tình huống và phối hợp ứng phó kịp thời.",
        imageAlt: "Hàng rào bảo vệ biên giới chạy dọc vùng núi dưới bầu trời xanh",
        imageWidth: 695,
        imageHeight: 400,
      },
      overview: {
        title: "Một góc nhìn chung từ tuyến biên giới đến cửa khẩu",
        paragraphs: [
          "Bảo vệ biên giới đòi hỏi kết hợp giám sát dọc tuyến với kiểm soát tại các cửa khẩu. Những khu vực xa, địa hình phức tạp và thay đổi về ánh sáng, thời tiết khiến từng công nghệ riêng lẻ khó đáp ứng toàn bộ nhu cầu. Kết nối các lớp bảo vệ giúp đội ngũ điều hành nhận diện nguy cơ xâm nhập, buôn lậu và các hoạt động trái phép trên một góc nhìn tổng thể.",
          "AQPTech tiếp cận từng dự án từ hiện trạng hạ tầng, phạm vi tuyến và quy trình phối hợp tại hiện trường. Camera, hình ảnh nhiệt, radar, cảm biến chu vi và hệ thống xác minh được đánh giá cùng hạ tầng tính toán, lưu trữ và truyền thông để xây dựng phương án tích hợp phù hợp với điều kiện triển khai.",
        ],
        systems: [
          ["CCTV", "Camera & hình ảnh nhiệt"],
          ["PIDS", "Phát hiện xâm nhập chu vi"],
          ["GIS", "Bản đồ tuyến & sự kiện"],
          ["C5I", "Chỉ huy, điều hành & thông tin"],
        ],
      },
      capabilities: {
        title: "Giám sát nhiều lớp. Phối hợp trên một nền tảng.",
        image: fenceImage,
        imageAlt: "Hàng rào an ninh và địa hình miền núi dọc tuyến biên giới",
        imageWidth: 730,
        imageHeight: 1077,
        items: [
          {
            id: "border-surveillance",
            label: "Giám sát & theo dõi",
            title: "Giám sát toàn tuyến, ngày và đêm",
            icon: "cctv",
            points: [
              "Hợp nhất nhiều công nghệ giám sát để mở rộng độ bao phủ và tạo góc nhìn chung về tuyến biên giới.",
              "Kết hợp camera CCTV với hình ảnh nhiệt để hỗ trợ theo dõi, ghi hình và nhận diện hiện diện trong các điều kiện ánh sáng khác nhau.",
              "Tích hợp hình ảnh và dữ liệu từ thiết bị bay không người lái (drone/UAV) để bổ sung quan sát tại các khu vực xa, theo điều kiện và quy định của từng dự án.",
              "Kết nối radar để hỗ trợ phát hiện, theo dõi phương tiện, tàu thuyền hoặc thiết bị bay có dấu hiệu vượt biên trái phép.",
            ],
          },
          {
            id: "border-intrusion-verification",
            label: "Phát hiện & xác minh",
            title: "Phát hiện xâm nhập, xác minh tại cửa khẩu",
            icon: "shield-check",
            points: [
              "Kết hợp cảm biến chu vi và thuật toán phát hiện để cảnh báo các dấu hiệu vượt hàng rào hoặc xâm nhập trái phép, hỗ trợ lực lượng tại hiện trường xác minh sự kiện.",
              "Tích hợp xác minh sinh trắc học bằng vân tay hoặc nhận diện khuôn mặt tại các điểm kiểm soát. Việc xử lý dữ liệu và phân quyền truy cập cần tuân thủ quy định áp dụng.",
            ],
          },
          {
            id: "border-data-intelligence",
            label: "Dữ liệu & phân tích",
            title: "Hợp nhất dữ liệu, làm rõ tình huống",
            icon: "database",
            points: [
              "Kết nối dữ liệu từ camera, radar, cảm biến và hệ thống xác minh để phân tích xu hướng, nhận diện bất thường và hỗ trợ ra quyết định có cơ sở.",
              "Kết hợp giám sát thời gian thực với phân tích dữ liệu để làm rõ bối cảnh sự kiện, hỗ trợ phát hiện nguy cơ và cung cấp thông tin phục vụ ứng phó.",
            ],
          },
          {
            id: "border-security-communication",
            label: "Bảo mật & điều hành",
            title: "Truyền thông bảo mật, chỉ huy tập trung",
            icon: "network",
            points: [
              "Tích hợp các biện pháp an ninh mạng để bảo vệ kênh truyền thông, tính toàn vẹn dữ liệu và khả năng duy trì hoạt động của hệ thống.",
              "Kết nối trung tâm chỉ huy với lực lượng hiện trường để chia sẻ thông tin thời gian thực, điều phối nguồn lực và hỗ trợ phản ứng kịp thời trước sự cố.",
            ],
          },
        ],
      },
      benefits: {
        lead: "Kết nối giám sát, phát hiện và điều hành giúp đơn vị quản lý biên giới hướng đến tăng cường an ninh, nâng cao nhận thức tình huống và sử dụng nguồn lực hiệu quả hơn trên toàn tuyến.",
        items: [
          {
            icon: "shield-check",
            title: "Tăng cường bảo vệ biên giới",
            text: "Giám sát nhiều lớp hỗ trợ phát hiện các hoạt động trái phép, cảnh báo nguy cơ xâm nhập và phối hợp bảo vệ tuyến biên giới.",
          },
          {
            icon: "map-pin",
            title: "Nâng cao nhận thức tình huống",
            text: "Hợp nhất thông tin từ nhiều điểm giám sát để đội ngũ điều hành theo dõi vị trí, diễn biến và bối cảnh của các sự kiện.",
          },
          {
            icon: "clock",
            title: "Phát hiện nguy cơ kịp thời",
            text: "Kết nối cảnh báo từ cảm biến và hình ảnh giúp nhận diện dấu hiệu bất thường sớm hơn, hỗ trợ xác minh và ứng phó đúng lúc.",
          },
          {
            icon: "check-circle-2",
            title: "Cải thiện kiểm soát cửa khẩu",
            text: "Xác minh sinh trắc học hỗ trợ kiểm tra danh tính và giảm nguy cơ gian lận tại các điểm kiểm soát theo quy trình được phê duyệt.",
          },
          {
            icon: "settings-2",
            title: "Vận hành hiệu quả, phối hợp liên tục",
            text: "Thông tin thời gian thực và điều hành tập trung hỗ trợ phân bổ lực lượng, chia sẻ tình huống và phối hợp giữa các đơn vị.",
          },
          {
            icon: "chart-no-axes-combined",
            title: "Ra quyết định dựa trên dữ liệu",
            text: "Phân tích dữ liệu tổng hợp để nhận diện xu hướng và bất thường, hỗ trợ lập kế hoạch giám sát và chủ động quản lý rủi ro.",
          },
        ],
      },
      resources: {
        title: "Tìm hiểu thêm về giải pháp biên giới quốc gia",
        sourceName: "National Borders",
      },
    },
  });
}
