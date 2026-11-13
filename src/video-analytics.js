import { industrySolutionPage } from "./industry-solution.js";
import { products } from "./data.js";

export function videoAnalyticsPage({ icon }) {
  const solution = products.find((item) => item.slug === "intelligent-video-analytics");

  return industrySolutionPage({
    icon,
    solution,
    type: "products",
    page: {
      hero: {
        subtitle: "Phân tích video thông minh. Chủ động trước rủi ro.",
        description: solution.description,
        imageAlt: "Camera giám sát và hình ảnh minh họa phân tích, nhận diện phương tiện trên đường",
        imageWidth: 1094,
        imageHeight: 1938,
      },
      overview: {
        title: "Từ hình ảnh đến thông tin hữu ích",
        paragraphs: [
          "Mỗi cơ sở, tình huống sử dụng và khách hàng có yêu cầu giám sát khác nhau. Phân tích video thông minh (IVA) kết hợp thuật toán với dữ liệu hình ảnh để hỗ trợ nhận diện các nguy cơ an toàn, an ninh và cung cấp thông tin phục vụ vận hành khi cần thiết.",
          "AQPTech tiếp cận từ hiện trạng camera, điều kiện ánh sáng, vùng giám sát và quy trình ứng phó để xác định phương án phù hợp. Kết nối phân tích với hệ thống vận hành giúp chuyển sự kiện thành cảnh báo có ngữ cảnh; kết quả vẫn cần được nhân sự phụ trách xác minh, không thay thế hoàn toàn giám sát của con người.",
        ],
        systems: [
          ["IVA", "Phân tích video thông minh"],
          ["PPE", "Trang bị bảo hộ cá nhân"],
          ["HSE", "Sức khỏe, an toàn & môi trường"],
          ["VMS", "Hệ thống quản lý video"],
        ],
      },
      capabilities: {
        title: "Ba góc nhìn. Một nền tảng giám sát.",
        image: solution.image,
        imageAlt: "Minh họa phân tích video với các khung nhận diện phương tiện trong luồng giao thông",
        imageWidth: 1094,
        imageHeight: 1938,
        items: [
          {
            id: "iva-safety-environment",
            label: "An toàn & môi trường",
            title: "Giám sát an toàn & môi trường làm việc",
            icon: "shield-check",
            points: [
              "Theo dõi tuân thủ trang bị bảo hộ cá nhân (PPE) và việc sử dụng đúng thiết bị an toàn lao động.",
              "Phát hiện té ngã và chuyển động bất thường của con người, vật thể để hỗ trợ cảnh báo sớm.",
              "Giám sát hoạt động máy móc và tư thế làm việc theo nguyên tắc công thái học, hỗ trợ bảo vệ sức khỏe người lao động.",
              "Nhận diện và cảnh báo nguy cơ như tràn đổ vật liệu nguy hiểm hoặc hành vi lái xe thiếu an toàn.",
              "Theo dõi điểm tập kết khi có tình huống khẩn cấp và khoảng cách an toàn quanh các hoạt động có nguy cơ.",
            ],
          },
          {
            id: "iva-security",
            label: "An ninh",
            title: "Nhận diện xâm nhập. Kiểm soát khu vực.",
            icon: "key-round",
            points: [
              "Phát hiện xâm nhập hoặc sử dụng sai mục đích tại khu vực hạn chế và lối thoát hiểm.",
              "Theo dõi dữ liệu ảnh nhiệt và mật độ đám đông để hỗ trợ quản lý sức khỏe, an toàn tại khu vực công cộng và nơi làm việc. Chức năng ảnh nhiệt cần thiết bị phù hợp và không thay thế đánh giá y tế.",
            ],
          },
          {
            id: "iva-operational-efficiency",
            label: "Hiệu quả vận hành",
            title: "Hiểu hoạt động. Tối ưu vận hành.",
            icon: "gauge",
            points: [
              "Giám sát hoạt động máy móc và công thái học tại nơi làm việc để hỗ trợ đánh giá hiệu quả vận hành.",
              "Theo dõi việc tuân thủ quy định tại vùng làm việc và sử dụng thiết bị an toàn.",
              "Kết hợp theo dõi ảnh nhiệt và kiểm soát mật độ đám đông để hỗ trợ sức khỏe, an toàn và hiệu quả trong quá trình vận hành.",
            ],
          },
        ],
      },
      benefits: {
        lead: "Khai thác thông tin từ video để hỗ trợ phòng ngừa rủi ro, phản ứng kịp thời và nâng cao hiệu quả. Mỗi kịch bản cần được kiểm thử theo môi trường, dữ liệu và quy trình thực tế.",
        items: [
          { icon: "shield-check", title: "Tăng cường an toàn & tuân thủ", text: "Hỗ trợ giám sát các quy tắc và quy định áp dụng, giúp nhận diện hành vi chưa phù hợp để đội ngũ phụ trách xử lý kịp thời." },
          { icon: "search", title: "Phát hiện sớm nguy cơ tai nạn", text: "Nhận diện té ngã, chuyển động bất thường và sự cố liên quan đến phương tiện để hỗ trợ giảm nguy cơ chấn thương hoặc tai nạn nghiêm trọng." },
          { icon: "chart-no-axes-combined", title: "Nâng cao hiệu quả vận hành", text: "Theo dõi hiệu suất hoạt động của máy móc và tư thế làm việc, hỗ trợ xây dựng môi trường lao động phù hợp và cải thiện năng suất." },
          { icon: "thermometer", title: "Hỗ trợ sức khỏe cộng đồng", text: "Theo dõi ảnh nhiệt bằng thiết bị phù hợp và kiểm soát mật độ đám đông để hỗ trợ quản lý an toàn cho nhân viên, khách và khu vực công cộng." },
          { icon: "key-round", title: "Bảo vệ khu vực hạn chế", text: "Hỗ trợ kiểm soát việc tiếp cận theo quyền cho phép và phát hiện bất thường tại lối thoát hiểm, giúp duy trì các tuyến thoát nạn thông thoáng." },
          { icon: "megaphone", title: "Hỗ trợ sơ tán có trật tự", text: "Theo dõi điểm tập kết để cung cấp thông tin cho lực lượng phụ trách, hỗ trợ sơ tán kịp thời và phối hợp trong tình huống khẩn cấp." },
          { icon: "compass", title: "Chủ động ứng phó nguy cơ", text: "Cảnh báo dấu hiệu tràn đổ hóa chất hoặc hành vi lái xe thiếu an toàn để đội ngũ vận hành đánh giá tình huống và triển khai biện pháp ứng phó." },
        ],
      },
      resources: {
        title: "Trao đổi về kịch bản phân tích video của bạn",
      },
    },
  });
}
