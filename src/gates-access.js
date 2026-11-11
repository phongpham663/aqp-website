import { industrySolutionPage } from "./industry-solution.js";
import { solutions } from "./data.js";

export function gatesAccessPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "gates-access");

  return industrySolutionPage({
    icon,
    solution,
    page: {
      hero: {
        subtitle: "Đúng người. Đúng khu vực. Đúng thời điểm.",
        description: solution.description,
        imageAlt: "Xe tải đi qua làn kiểm soát tại khu vực cổng ra vào vào ban đêm",
        imageWidth: 839,
        imageHeight: 1397,
      },
      overview: {
        title: "Kiểm soát ra vào. Kết nối an ninh.",
        paragraphs: [
          "Hệ thống kiểm soát ra vào (ACS) là một thành phần quan trọng trong bảo vệ tài sản và quản lý khu vực hạn chế. Đầu đọc thẻ, khóa điện tử và thiết bị sinh trắc học hỗ trợ xác minh thông tin xác thực, quản lý quyền tiếp cận không gian vật lý và các hệ thống số được tích hợp.",
          "Trong giải pháp tham khảo của Magal, ACS là một phần của nền tảng Fortis X C5I. Fortis X hỗ trợ quản lý nhiều hệ thống ACS từ các nhà cung cấp phần cứng, phần mềm khác nhau, đồng thời kết nối với hệ thống tòa nhà thông minh và logic cửa liên động. Khả năng tích hợp cần được đánh giá theo giao thức, thiết bị và giấy phép thực tế.",
          "Cửa liên động (interlock) điều khiển trình tự mở cửa để hỗ trợ hạn chế tiếp cận trái phép. Tích hợp tòa nhà thông minh có thể kích hoạt chiếu sáng khi mở khóa hoặc điều chỉnh hệ thống điều hòa, thông gió (HVAC) khi không gian không có người sử dụng. AQPTech đánh giá các kịch bản này theo từng dự án; logic liên động phải được thiết kế cùng yêu cầu thoát hiểm và phương án vận hành an toàn.",
        ],
        systems: [
          ["ACS", "Hệ thống kiểm soát ra vào"],
          ["C5I", "Nền tảng điều hành tích hợp"],
          ["Interlock", "Logic cửa liên động"],
          ["HVAC", "Điều hòa & thông gió"],
        ],
      },
      capabilities: {
        title: "Tính năng & cấu hình tham khảo",
        image: solution.image,
        imageAlt: "Minh họa cổng kiểm soát phương tiện và các làn ra vào tại một cơ sở",
        imageWidth: 839,
        imageHeight: 1397,
        items: [
          {
            id: "gates-access-authentication",
            label: "Xác thực & quản trị",
            title: "Quyền truy cập được quản lý rõ ràng",
            icon: "key-round",
            points: [
              "<strong>Phương thức xác thực:</strong> Hỗ trợ thẻ mã hóa bảo mật, mã PIN, dữ liệu sinh trắc học và thông tin xác thực trên thiết bị di động theo thiết bị, mô-đun được lựa chọn.",
              "<strong>Cấp độ truy cập & phân quyền:</strong> Thiết lập quyền theo vai trò và cấp bậc, xác định khu vực được phép tiếp cận phù hợp với nhiệm vụ, trách nhiệm của người dùng.",
              "<strong>Khả năng mở rộng:</strong> Bổ sung người dùng, điểm ra vào hoặc mở rộng đến nhiều địa điểm theo nhu cầu phát triển của cơ sở.",
              "<strong>Quản trị tập trung:</strong> Cấu hình phần mềm, quản lý người dùng, thiết lập quy tắc, tạo báo cáo và theo dõi sự kiện trên giao diện chung.",
            ],
          },
          {
            id: "gates-access-integration",
            label: "Tích hợp & vận hành",
            title: "Kết nối hệ thống. Chủ động vận hành.",
            icon: "network",
            points: [
              "<strong>Khả năng tích hợp:</strong> Kết nối với giám sát video, hệ thống báo động và các phân hệ an ninh tương thích để hỗ trợ quản lý tổng thể.",
              "<strong>Truy cập & giám sát từ xa:</strong> Quản lý hệ thống, theo dõi sự kiện qua kết nối được cấp quyền và bảo mật phù hợp.",
              "<strong>Anti-passback & truy cập theo thời gian:</strong> Kiểm soát việc sử dụng lại thông tin xác thực không đúng trình tự ra vào và áp dụng quyền truy cập theo lịch được thiết lập.",
              "<strong>Dự phòng & chuyển đổi khi có sự cố:</strong> Xây dựng phương án dự phòng, chuyển đổi hoạt động để hỗ trợ giảm gián đoạn; cơ chế cụ thể cần được kiểm thử theo kiến trúc triển khai.",
              "<strong>Giao diện tùy chỉnh:</strong> Công cụ quản lý trực quan, có thể tùy chỉnh để theo dõi rõ các sự kiện ra vào và phục vụ quy trình vận hành.",
            ],
          },
        ],
      },
      benefits: {
        lead: "Kết hợp xác thực, phân quyền và dữ liệu sự kiện để bảo vệ khu vực, đơn giản hóa quản trị và thích ứng cùng quy mô vận hành của doanh nghiệp.",
        items: [
          { icon: "shield-check", title: "Tăng cường an ninh & truy vết", text: "Cấp quyền cho người dùng được phê duyệt tại các khu vực xác định, hỗ trợ giảm nguy cơ xâm nhập trái phép. Nhật ký ra vào giúp phát hiện, xác minh và phản ứng với sự cố kịp thời." },
          { icon: "network", title: "Vận hành hiệu quả & tích hợp liền mạch", text: "Kết nối các thành phần an ninh trên một nền tảng quản lý chung để đơn giản hóa kiểm soát ra vào, giảm thao tác quản trị lặp lại và hỗ trợ nâng cao hiệu quả." },
          { icon: "key-round", title: "Bảo vệ khu vực & quản lý khách", text: "Thiết lập quyền truy cập và lịch ra vào để bảo vệ tài sản nhạy cảm. Quy trình quản lý khách được xây dựng theo yêu cầu xác thực, khu vực và thời gian được phép tiếp cận." },
          { icon: "layers", title: "Mở rộng linh hoạt & hỗ trợ tuân thủ", text: "Điều chỉnh quy tắc, lịch truy cập khi cơ sở phát triển hoặc nhu cầu thay đổi. Hỗ trợ đáp ứng yêu cầu bảo vệ tài sản và quyền riêng tư; mức độ tuân thủ cần được đánh giá theo quy định áp dụng." },
        ],
      },
      resources: {
        title: "Trao đổi về hệ thống kiểm soát ra vào của bạn",
        sourceName: "Gates & Access trên nền tảng Fortis X C5I",
        sourceUrl: "https://www.magalsolutions.com/gates-access/",
      },
    },
  });
}
