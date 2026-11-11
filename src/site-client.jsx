"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { icon } from "./html.js";
import { renderCatalog } from "./catalog.js";
import { setupHome } from "./home.js";
import { setupProfessionalServices } from "./professional-services.js";
import { setupConstructionSecurity } from "./construction-security.js";
import { setupStoreAnalytics } from "./store-analytics.js";
import { setupFactoryIntelligence } from "./factory-intelligence.js";
import { setupSupport } from "./support.js";

export default function SiteClient({ site }) {
  const rootRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const root = rootRef.current;
    const controller = new AbortController();
    const { signal } = controller;
    const cleanups = [];
    let frame;
    const find = (selector) => root.querySelector(selector);

    function updateProducts(syncUrl = true) {
      const selected = find(".filter-tab.selected")?.dataset.category || "Tất cả";
      const query = find("#product-search").value.trim();
      const results = renderCatalog(selected, query);
      find("#product-results").innerHTML = results.html;
      find(".catalog-count").textContent = results.count;
      if (syncUrl) {
        const params = new URLSearchParams();
        if (selected !== "Tất cả") params.set("category", selected);
        if (query) params.set("q", query);
        window.history.replaceState(null, "", `/products${params.size ? `?${params}` : ""}`);
      }
    }
    function scrollHash(hash) {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (target && root.contains(target)) target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      if (id === "top") find(".brand")?.focus({ preventScroll: true });
    }
    function click(event) {
      const toggle = event.target.closest(".menu-toggle");
      if (toggle) {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        toggle.setAttribute("aria-label", expanded ? "Mở menu điều hướng" : "Đóng menu điều hướng");
        toggle.innerHTML = icon(expanded ? "menu" : "x");
        find("#main-nav").classList.toggle("is-open", !expanded);
        return;
      }
      const filter = event.target.closest("[data-category]");
      if (filter) {
        root.querySelectorAll(".filter-tab").forEach((tab) => {
          tab.classList.toggle("selected", tab === filter);
          tab.setAttribute("aria-pressed", String(tab === filter));
        });
        updateProducts();
        return;
      }
      if (event.target.closest("#clear-filters")) {
        find("#product-search").value = "";
        find('[data-category="Tất cả"]').click();
        find("#product-search").focus();
        return;
      }
      if (!event.target.closest(".nav-dropdown")) root.querySelectorAll(".nav-dropdown[open]").forEach((details) => details.removeAttribute("open"));
      const anchor = event.target.closest("a[href]");
      if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (anchor.closest("#main-nav")) {
        root.querySelectorAll(".nav-dropdown[open]").forEach((details) => details.removeAttribute("open"));
        find('.menu-toggle[aria-expanded="true"]')?.click();
      }
      if (url.pathname === location.pathname && url.search === location.search && url.hash) {
        event.preventDefault();
        scrollHash(url.hash);
        return;
      }
      event.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    }
    function keydown(event) {
      if (event.key !== "Escape") return;
      const dropdown = find(".nav-dropdown[open]");
      if (dropdown) { dropdown.removeAttribute("open"); dropdown.querySelector("summary").focus(); }
      const toggle = find('.menu-toggle[aria-expanded="true"]');
      if (toggle) { toggle.click(); toggle.focus(); }
    }
    function input(event) {
      if (event.target.id === "product-search") updateProducts();
      if (["firstName", "lastName"].includes(event.target.name) && event.target.form?.dataset.api === "contact") event.target.setCustomValidity("");
    }
    async function submit(event) {
      const form = event.target.closest("form[data-api]");
      if (!form) return;
      event.preventDefault();
      if (form.dataset.api === "contact") for (const name of ["firstName", "lastName"]) form.elements[name].setCustomValidity(form.elements[name].value.trim() ? "" : "Vui lòng nhập họ và tên.");
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      if (button.disabled) return;
      const status = form.querySelector(".form-status");
      const payload = Object.fromEntries(new FormData(form));
      if (form.dataset.api === "contact") payload.name = `${payload.lastName.trim()} ${payload.firstName.trim()}`.trim();
      payload.consent = form.elements.consent.checked;
      button.disabled = true;
      form.setAttribute("aria-busy", "true");
      status.className = "form-status";
      status.textContent = "Đang gửi thông tin…";
      try {
        const response = await fetch(`/api/${form.dataset.api}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Chưa thể gửi thông tin. Vui lòng thử lại.");
        if (signal.aborted) return;
        status.classList.add("success");
        status.textContent = `${data.message}${form.dataset.api === "contact" ? ` Mã yêu cầu: ${data.id}.` : ""}`;
        form.reset();
      } catch (error) {
        if (signal.aborted) return;
        status.classList.add("error");
        status.textContent = error.name === "TimeoutError" ? "Kết nối quá thời gian. Vui lòng thử lại sau." : error instanceof TypeError ? "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại." : error.message;
      } finally {
        if (!signal.aborted) { button.disabled = false; form.removeAttribute("aria-busy"); }
      }
    }
    root.addEventListener("click", click, { signal });
    root.addEventListener("keydown", keydown, { signal });
    root.addEventListener("input", input, { signal });
    root.addEventListener("submit", submit, { signal });
    if (root.classList.contains("home-page")) cleanups.push(setupHome({ signal }));
    if (site.pathname === "/services") cleanups.push(setupProfessionalServices());
    if (site.pathname === "/solutions/construction-site-security") cleanups.push(setupConstructionSecurity());
    if (site.pathname === "/solutions/store-analytics") cleanups.push(setupStoreAnalytics());
    if (site.pathname === "/solutions/factory-intelligence") cleanups.push(setupFactoryIntelligence());
    if (site.pathname === "/support") cleanups.push(setupSupport());
    if (site.pathname === "/products") {
      const params = new URLSearchParams(location.search);
      const category = [...root.querySelectorAll(".filter-tab")].some((tab) => tab.dataset.category === params.get("category")) ? params.get("category") : "Tất cả";
      root.querySelectorAll(".filter-tab").forEach((tab) => { tab.classList.toggle("selected", tab.dataset.category === category); tab.setAttribute("aria-pressed", String(tab.dataset.category === category)); });
      find("#product-search").value = params.get("q") || "";
      updateProducts(false);
    }
    if (location.hash) frame = requestAnimationFrame(() => scrollHash(location.hash));
    return () => { controller.abort(); cancelAnimationFrame(frame); cleanups.forEach((cleanup) => cleanup?.()); };
  }, [site.pathname, site.html, router]);

  // The server owns this trusted HTML; effects enhance its opaque DOM without React child reconciliation.
  return <div id="app" ref={rootRef} className={site.classes} dangerouslySetInnerHTML={{ __html: site.html }} />;
}
