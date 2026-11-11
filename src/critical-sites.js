import { solutions } from "./data.js";
import { industrySolutionPage } from "./industry-solution.js";
const facilityImage = "/assets/magal/images/aqp-critical-sites-facility.jpg";
const brochureUrl = "/assets/magal/documents/Critical-Sites-brochure-1--471a598834.pdf";

export function criticalSitesPage({ icon }) {
  const solution = solutions.find((item) => item.slug === "critical-sites");
  return industrySolutionPage({
    icon,
    solution,
    page: {
      hero: {
        subtitle: "Kết nối an ninh, an toàn và vận hành liên tục.",
        description:
          "Sân bay, cơ sở giam giữ, trụ sở cơ quan nhà nước và địa điểm tổ chức sự kiện lớn giữ vai trò quan trọng đối với hoạt động kinh tế và an toàn cộng đồng. AQPTech hướng đến kết nối giám sát, kiểm soát ra vào và dữ liệu vận hành để hỗ trợ bảo vệ tài sản trọng yếu, phối hợp xử lý sự cố và hạn chế gián đoạn trước các nguy cơ thay đổi.",
        imageAlt: "Máy bay và phương tiện phục vụ mặt đất trên sân đỗ sân bay lúc hoàng hôn",
        imageWidth: 1580,
        imageHeight: 760,
        videoUrl: "https://www.youtube.com/watch?v=d2wIFlax6Dg",
        videoLabel: "Video Magal: cơ sở giam giữ",
      },
      overview: {
        title: "Bảo vệ tài sản trọng yếu trên một nền tảng chung",
        paragraphs: [
          "Một sự cố tại cơ sở trọng yếu có thể ảnh hưởng không chỉ đến tài sản mà còn đến con người và hoạt động của nhiều đơn vị liên quan. Giám sát chu vi, quản lý ra vào và quy trình vận hành cần được kết nối để nhận diện tình huống, xác minh nguy cơ và phối hợp phản ứng thay vì xử lý từng hệ thống riêng lẻ.",
          "AQPTech tiếp cận từng dự án từ đặc điểm cơ sở, hạ tầng hiện hữu và yêu cầu an ninh, an toàn. Hợp nhất dữ liệu từ cảm biến, hệ thống video, quản lý cổng và các chỉ số vận hành giúp xây dựng một góc nhìn chung, hỗ trợ ra quyết định và tối ưu sử dụng nguồn lực theo quy trình đã được thống nhất.",
        ],
        systems: [
          ["PIDS", "Phát hiện xâm nhập chu vi"],
          ["VMS", "Quản lý & phân tích video"],
          ["GOS", "Quản lý cổng & luồng ra vào"],
          ["KPI", "Theo dõi hiệu suất vận hành"],
        ],
      },
      capabilities: {
        title: "Từ bảo vệ chu vi đến điều hành an toàn",
        image: facilityImage,
        imageAlt: "Tòa nhà Quốc hội Hoa Kỳ, hình ảnh minh họa cơ sở công quyền trọng yếu",
        imageWidth: 660,
        imageHeight: 880,
        items: [
          {
            id: "critical-sites-intrusion-surveillance",
            label: "Phát hiện & giám sát",
            title: "Phát hiện xâm nhập, giám sát thời gian thực",
            icon: "cctv",
            points: [
              "Tích hợp hệ thống phát hiện xâm nhập chu vi (PIDS) để tăng cường bảo vệ và cảnh báo các dấu hiệu vượt rào, xâm nhập hoặc vi phạm khu vực bảo vệ.",
              "Kết nối hệ thống quản lý video (VMS) với phân tích hình ảnh để hỗ trợ theo dõi thời gian thực, phát hiện đối tượng và nhận diện sự kiện.",
              "Quản lý sự cố trên một luồng xử lý chung để hỗ trợ xác minh cảnh báo, điều phối phản ứng và theo dõi kết quả xử lý.",
            ],
          },
          {
            id: "critical-sites-access-traffic",
            label: "Ra vào & giao thông",
            title: "Kiểm soát ra vào, điều phối luồng phương tiện",
            icon: "truck",
            points: [
              "Kết nối quản lý cổng và kiểm soát truy cập để hỗ trợ kiểm tra người, hành lý, giấy phép, phương tiện và việc đưa tài sản ra khỏi cơ sở tại các điểm ra vào.",
              "Tích hợp đăng ký trước, đặt lịch và điều phối giao thông để hỗ trợ phương tiện đã được phê duyệt đi qua nhanh hơn; mức độ tự động hóa được xác nhận theo quy trình của từng cơ sở.",
            ],
          },
          {
            id: "critical-sites-operations-safety",
            label: "Vận hành & an toàn",
            title: "Vận hành hiệu quả, chủ động quản lý an toàn",
            icon: "settings-2",
            points: [
              "Kết nối thông tin vận hành hằng ngày để hỗ trợ phân bổ nguồn lực, tối ưu quy trình, kiểm soát chi phí và nâng cao năng suất.",
              "Theo dõi các khu vực quan trọng và chỉ số hiệu suất chính (KPI) theo thời gian thực để đo lường hoạt động, nhận diện điểm nghẽn và đánh giá cơ hội cải tiến.",
              "Tích hợp các biện pháp an toàn với giám sát và quy trình xử lý sự cố để hỗ trợ giảm thiểu rủi ro, bảo vệ con người và tài sản.",
            ],
          },
        ],
      },
      benefits: {
        lead: "Kết nối an ninh, an toàn và vận hành giúp cơ sở trọng yếu hướng đến bảo vệ toàn diện hơn, hạn chế thời gian gián đoạn và nâng cao khả năng phối hợp trước các tình huống bất thường.",
        items: [
          {
            icon: "gauge",
            title: "Liên tục & hiệu quả vận hành",
            text: "Quản lý nguồn lực và thông tin thời gian thực hỗ trợ tối ưu quy trình, kiểm soát chi phí và giảm nguy cơ gián đoạn để duy trì hoạt động của cơ sở.",
          },
          {
            icon: "shield-check",
            title: "Tăng cường an ninh",
            text: "Kết hợp phát hiện xâm nhập, giám sát thời gian thực và kiểm soát ra vào để hỗ trợ bảo vệ tài sản trọng yếu và ứng phó với các nguy cơ mới.",
          },
          {
            icon: "check-circle-2",
            title: "An toàn cho con người & tài sản",
            text: "Nhận diện nguy cơ, phối hợp xử lý sự cố và áp dụng các biện pháp giảm thiểu rủi ro để hỗ trợ bảo vệ nhân sự, khách và tài sản trong phạm vi cơ sở.",
          },
        ],
      },
      resources: {
        title: "Tìm hiểu thêm về giải pháp cơ sở trọng yếu",
        brochureUrl,
        sourceName: "Critical Sites",
      },
    },
  });
}
