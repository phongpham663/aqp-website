import { referenceHero } from "./about.js";
import { companyContact, products, services } from "./data.js";
const companyImage = "/assets/velasea/images/commercial-office-complex-980x653--dacd576d2c.jpg";

export function contactPage({ icon, escape, search = "" }) {
  const params = new URLSearchParams(search);
  const interest = params.get("interest") || "";
  return `${referenceHero({ id: "contact-title", title: "Liên hệ", subtitle: "Cùng trao đổi về bài toán của bạn", description: "AQPTech tư vấn, thiết kế và tích hợp các hệ thống máy chủ, lưu trữ, giám sát IP, AI và giải pháp OEM theo nhu cầu. Chia sẻ ứng dụng, thách thức và kế hoạch triển khai để cùng chúng tôi tìm ra nền tảng phù hợp cho doanh nghiệp." })}
  <section class="container contact-reference-layout" aria-label="Thông tin liên hệ và gửi yêu cầu">
    <aside class="contact-reference-info">
      <figure><img src="${companyImage}" alt="Minh họa môi trường doanh nghiệp ứng dụng công nghệ" width="980" height="653" loading="lazy"><figcaption>Hình ảnh minh họa, không phải địa chỉ văn phòng AQPTech.</figcaption></figure>
      <h2>Thông tin liên hệ</h2>
      <dl class="contact-details"><div>${icon("phone")}<div><dt>Điện thoại</dt><dd><a href="${companyContact.phoneHref}">${companyContact.phone}</a></dd></div></div><div>${icon("mail")}<div><dt>Email doanh nghiệp</dt><dd><a href="mailto:${companyContact.email}">${companyContact.email}</a></dd></div></div>${companyContact.offices.map((office) => `<div class="contact-office">${icon("map-pin")}<div><dt>${office.name}</dt><dd><address lang="${office.lang}">${office.address}</address></dd></div></div>`).join("")}</dl>
      <h3>Kết nối với AQPTech</h3><p>Liên hệ trực tiếp qua điện thoại, email hoặc gửi yêu cầu qua biểu mẫu bên cạnh để trao đổi cùng AQPTech.</p>
      <a class="contact-info-support" href="/support">${icon("headphones")}Hỗ trợ kỹ thuật & bảo hành${icon("arrow-up-right")}</a>
      <div class="contact-info-note">${icon("shield-check")}<p>Không gửi mật khẩu, khóa truy cập hay dữ liệu nhạy cảm. Thông tin yêu cầu không được công khai trên website.</p></div>
    </aside>
    <div class="contact-reference-form-column">
      <div class="contact-support-bar"><span>Cần hỗ trợ kỹ thuật?</span>${icon("arrow-right")}<a href="/support">Gửi yêu cầu hỗ trợ</a></div>
      <form class="contact-form contact-reference-form" data-api="contact">
        <h2>Liên hệ với chúng tôi</h2><p class="contact-required-note">Các trường có dấu <span>*</span> là bắt buộc.</p>
        <div class="contact-reference-fields">
          <fieldset class="contact-name-field"><legend>Họ và tên <span>*</span></legend><div class="contact-name-inputs"><label><span class="sr-only">Họ và tên đệm</span><input name="lastName" placeholder="Họ và tên đệm" autocomplete="family-name" maxlength="60" required></label><label><span class="sr-only">Tên</span><input name="firstName" placeholder="Tên" autocomplete="given-name" maxlength="50" required></label></div></fieldset>
          <label class="contact-field-full">Công ty <span>*</span><input name="company" autocomplete="organization" maxlength="200" required></label>
          <label>Email công việc <span>*</span><input name="email" type="email" autocomplete="email" maxlength="254" required></label>
          <label>Số điện thoại<input name="phone" type="tel" autocomplete="tel" maxlength="40"></label>
          <label class="contact-field-full">Bạn quan tâm đến<input name="interest" list="interest-options" value="${escape(interest)}" maxlength="200" placeholder="Chọn hoặc nhập nhu cầu"><datalist id="interest-options">${[...products, ...services].map((item) => `<option value="${item.name}"></option>`).join("")}<option value="Hỗ trợ kỹ thuật"></option><option value="Hợp tác OEM"></option></datalist></label>
          <label class="contact-field-full">Nội dung yêu cầu <span>*</span><textarea name="message" rows="6" minlength="10" maxlength="5000" required></textarea></label>
        </div>
        <label class="consent"><input name="consent" type="checkbox" required><span>Tôi đồng ý để AQPTech xử lý thông tin nhằm tư vấn yêu cầu theo <a href="/privacy">chính sách riêng tư</a>.</span></label>
        <label class="honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
        <button class="home-button" type="submit">Gửi yêu cầu</button><p class="form-status" role="status" aria-live="polite"></p>
        <p class="form-footnote">Yêu cầu được lưu trên hệ thống website. Đây không phải xác nhận báo giá, lịch triển khai hoặc email đã gửi.</p>
      </form>
    </div>
  </section>`;
}
