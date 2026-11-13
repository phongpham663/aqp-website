import { industrySolutionPage } from "./industry-solution.js";
import { products } from "./data.js";

export function fortisoptixPage({ icon }) {
  const product = products.find((item) => item.slug === "fortisoptix");

  return industrySolutionPage({
    icon,
    solution: product,
    type: "products",
    page: {
      hero: {
        subtitle: product.tagline,
        description: product.description,
        imageAlt: product.imageAlt,
        imageWidth: product.imageWidth,
        imageHeight: product.imageHeight,
      },
      overview: {
        title: "Từ mô hình AI đến luồng tự động hóa trực quan.",
        paragraphs: [
          "FortisOptix định hướng một nền tảng AI low-code: kết nối các khối xử lý bằng thao tác kéo thả để đưa học sâu, thị giác máy tính và dữ liệu thiết bị vào quy trình thực tế. Luồng dạng đồ thị giúp thiết kế tác vụ tuần tự hoặc song song, từ nhận diện đối tượng đến phối hợp robot và hệ thống tự động.",
          "Sản phẩm đang trong giai đoạn chuẩn bị ra mắt. Các mô-đun, cấu hình, giao thức và giấy phép sẽ được công bố khi phát hành; phạm vi tích hợp và tiêu chí nghiệm thu cần được xác nhận theo từng dự án. AI không thay thế bộ điều khiển an toàn, cơ chế dừng khẩn cấp hoặc người giám sát.",
        ],
        systems: [
          ["Low-code", "Luồng xử lý kéo thả"],
          ["AI", "Học sâu & thị giác máy tính"],
          ["I/O", "Camera & thiết bị hiện trường"],
          ["API", "Tích hợp dữ liệu & hệ thống"],
        ],
      },
      capabilities: {
        title: "Định hướng tính năng: AI, robot và luồng xử lý low-code.",
        image: product.image,
        imageAlt: product.imageAlt,
        imageWidth: product.imageWidth,
        imageHeight: product.imageHeight,
        items: [
          {
            id: "fortisoptix-ai", label: "AI & dữ liệu", icon: "cpu",
            title: "Chuẩn bị dữ liệu và phát triển mô hình AI",
            points: [
              "Thu thập ảnh, gán nhãn và xây dựng bộ dữ liệu cho bài toán phát hiện, định vị và phân loại đối tượng.",
              "Định hướng huấn luyện và thử nghiệm mô hình học sâu bằng CPU hoặc GPU, tùy cấu hình và yêu cầu xử lý.",
              "Kiểm thử độ chính xác, điều kiện ánh sáng và chất lượng dữ liệu trước khi đưa kết quả AI vào quy trình vận hành.",
            ],
          },
          {
            id: "fortisoptix-automation", label: "Robot & tự động hóa", icon: "bot",
            title: "Kết nối AI với robot và thiết bị hiện trường",
            points: [
              "Định hướng nhận dữ liệu từ camera IP, webcam, ảnh hoặc video để kết nối với thiết bị I/O và robot.",
              "Đánh giá tích hợp Modbus/TCP, Arduino I/O và cổng nối tiếp theo thiết bị, giao thức và phạm vi được xác nhận.",
              "Làm rõ tín hiệu điều khiển, liên động và phương án thủ công; không mặc định mọi robot hoặc thiết bị đều tương thích.",
            ],
          },
          {
            id: "fortisoptix-deployment", label: "Low-code & tích hợp", icon: "settings-2",
            title: "Thiết kế luồng xử lý bằng khối kéo thả",
            points: [
              "Kết nối các nút xử lý để thiết kế tác vụ tuần tự hoặc song song, giảm nhu cầu viết mã cho những thao tác phổ biến.",
              "Định hướng trao đổi dữ liệu qua MQTT, REST API và xuất luồng RTSP hoặc MJPEG theo nhu cầu tích hợp.",
              "Tạo giao diện vận hành cơ bản với nút, hình ảnh, văn bản hoặc đèn trạng thái; chi tiết mô-đun sẽ được công bố khi ra mắt.",
            ],
          },
        ],
      },
      benefits: {
        lead: "FortisOptix hướng đến việc rút ngắn hành trình từ dữ liệu, mô hình AI đến ứng dụng robot và tự động hóa. Đây là định hướng của sản phẩm sắp ra mắt; hiệu quả và phạm vi tính năng cần được kiểm chứng, không phải cam kết tự động hóa mọi quy trình.",
        items: [
          { icon: "network", title: "Đưa AI vào quy trình trực quan", text: "Luồng xử lý và khối kéo thả giúp hình dung cách dữ liệu, mô hình và thiết bị phối hợp, thay vì bắt đầu từ một ứng dụng viết mã hoàn toàn mới." },
          { icon: "gauge", title: "Chủ động dữ liệu và mô hình", text: "Kết nối bước thu thập, gán nhãn, huấn luyện và kiểm thử để lựa chọn mô hình phù hợp với bài toán và hạ tầng CPU/GPU." },
          { icon: "layers", title: "Liên kết phần mềm với thiết bị", text: "Định hướng phối hợp camera, robot, I/O và giao thức dữ liệu trong cùng một phương án, với khả năng tương thích được xác nhận trước khi triển khai." },
          { icon: "shield-check", title: "An toàn ngay từ thiết kế", text: "Làm rõ quyền điều khiển, giới hạn thao tác, cơ chế dừng và trách nhiệm giám sát trước khi đưa AI vào quy trình tự động." },
        ],
      },
      resources: {
        title: "Quan tâm FortisOptix trước khi ra mắt",
      },
    },
  });
}
