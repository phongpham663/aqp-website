import { companyContact } from "./data.js";
import dmcaLogo from "../assets/branding/dmca-logo.png";
import ncscLogo from "../assets/branding/ncsc-logo.png";
import commerceLogo from "../assets/branding/bo-cong-thuong-notified.png";
import "./footer-info.css";

const logos = [
  { name: "dmca", image: dmcaLogo, alt: "Logo DMCA Protected & Monitored", width: 150, height: 61 },
  { name: "ncsc", image: ncscLogo, alt: "Logo NCSC VN", width: 590, height: 590 },
  { name: "commerce", image: commerceLogo, alt: "Logo Đã thông báo Bộ Công Thương", width: 600, height: 227 },
];

export function footerInfo({ icon }) {
  return `<div class="footer-info"><address class="footer-direct-contact" aria-label="Liên hệ trực tiếp với AQPTech"><a href="mailto:${companyContact.email}">${icon("mail")}${companyContact.email}</a><a href="${companyContact.phoneHref}">${icon("phone")}${companyContact.phone}</a></address><div class="footer-logo-list" role="group" aria-label="Logo thông tin website">${logos.map((logo) => `<div class="footer-logo footer-logo-${logo.name}"><img src="${logo.image}" alt="${logo.alt}" width="${logo.width}" height="${logo.height}" loading="lazy"></div>`).join("")}</div></div>`;
}
