import { referenceHero } from "./about.js";
const operationsImage = "/assets/velasea/images/security-ops-center-scaled--9e1d5b9d4a.jpg";

export function solutionsPage() {
  return `${referenceHero({
    id: "solutions-title",
    title: "Giải pháp theo lĩnh vực",
    subtitle: "Công nghệ đáp ứng nhu cầu từng ngành",
    description:
      "Mỗi ngành đều có những thách thức riêng: yêu cầu tuân thủ, tính liên tục, rủi ro bảo mật, vận hành phức tạp và công nghệ không ngừng thay đổi. AQPTech thiết kế và tích hợp giải pháp hạ tầng phù hợp với ứng dụng, quy mô và điều kiện vận hành của từng doanh nghiệp.",
    image: operationsImage,
    imageAlt: "Trung tâm điều hành với các kỹ thuật viên theo dõi hệ thống màn hình giám sát",
    imageHeight: 1333,
  })}
  <section class="container solutions-reference-intro" aria-labelledby="solutions-intro-title">
    <h2 id="solutions-intro-title">Thúc đẩy các ngành bằng hạ tầng thông minh</h2>
    <p>Từ nền tảng tính toán có tính sẵn sàng cao đến phân tích video bằng AI và điện toán biên, AQPTech xây dựng hệ thống hỗ trợ vận hành liên tục và mở rộng theo nhu cầu. Chúng tôi giúp doanh nghiệp hiện đại hóa công nghệ, tăng cường bảo mật và khai thác dữ liệu hiệu quả hơn thông qua thiết kế, tích hợp và kiểm thử theo từng dự án.</p>
    <p class="solutions-reference-explore"><strong>Khám phá giải pháp dành cho ngành của bạn trong menu Giải pháp.</strong></p>
  </section>`;
}
