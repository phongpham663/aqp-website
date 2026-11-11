import { NextResponse } from "next/server";
import { renderSite } from "./src/site-renderer.js";

export function proxy(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();
  let pathname;
  try { pathname = decodeURIComponent(request.nextUrl.pathname); }
  catch { return NextResponse.next(); }
  if (/^\/(?:api|_next|assets)(?:\/|$)/.test(pathname)
    || ["/favicon-aqptech.png", "/_not-found", "/404"].includes(pathname)
    || renderSite(pathname).found) return NextResponse.next();

  // Keep the shared header server-rendered instead of returning a client-only 404 shell.
  const destination = request.nextUrl.clone();
  destination.pathname = "/_not-found";
  return NextResponse.rewrite(destination);
}

export const config = { matcher: "/((?!api(?:/|$)|_next(?:/|$)|assets(?:/|$)).*)" };
