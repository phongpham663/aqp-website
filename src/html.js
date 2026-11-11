import { ArrowRight, ArrowUpRight, ChevronDown, Plus, Minus, Menu, X, Cpu, Server, Database, Cctv, Network, Factory, Building2, Truck, Store, DoorOpen, Timer, GraduationCap, Blocks, Settings2, ShieldCheck, Check, CheckCircle2, Search, Headphones, MoveUpRight, Layers, Compass, Mail, Clock, Send, Phone, MapPin, Home, Ship, Play, Download, Gauge, ChartNoAxesCombined, Fuel, Megaphone, Thermometer, ScanLine, KeyRound, Bot, ScanFace, Radio, Wrench, ClipboardList, CalendarCheck, Boxes, QrCode, Users, ListChecks, CalendarClock, Workflow, ChartColumn, ArrowDown } from "lucide";

const icons = { ArrowRight, ArrowUpRight, ChevronDown, Plus, Minus, Menu, X, Cpu, Server, Database, Cctv, Network, Factory, Building2, Truck, Store, DoorOpen, Timer, GraduationCap, Blocks, Settings2, ShieldCheck, Check, CheckCircle2, Search, Headphones, MoveUpRight, Layers, Compass, Mail, Clock, Send, Phone, MapPin, Home, Ship, Play, Download, Gauge, ChartNoAxesCombined, Fuel, Megaphone, Thermometer, ScanLine, KeyRound, Bot, ScanFace, Radio, Wrench, ClipboardList, CalendarCheck, Boxes, QrCode, Users, ListChecks, CalendarClock, Workflow, ChartColumn, ArrowDown };

export const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

export function icon(name, className = "") {
  const key = name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  const definition = icons[key];
  if (!definition) throw new Error(`Unknown icon: ${name}`);
  const nodes = definition[2].map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([attribute, value]) => `${attribute.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${escape(value)}"`).join(" ")}></${tag}>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${escape(name)} ${escape(className)}" aria-hidden="true" focusable="false">${nodes}</svg>`;
}

export function logo(language = "vi") {
  const tagline = language === "en" ? "Powering Decisions" : "Thúc đẩy mạnh mẽ sự phát triển";
  return `<span class="brand-lockup"><span class="brand-name">AQP<span>Tech</span><sup class="brand-trademark">TM</sup></span><span class="brand-tagline" lang="${language}">${tagline}</span></span>`;
}
