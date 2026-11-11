import { notFound } from "next/navigation";
import { renderSite } from "../../src/site-renderer.js";
import SiteClient from "../../src/site-client.jsx";

export const dynamic = "force-dynamic";

function routePath(params) { return `/${(params.slug || []).join("/")}`; }
function searchString(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "_rsc") continue;
    for (const item of Array.isArray(value) ? value : [value]) if (item !== undefined) search.append(key, item);
  }
  return search.size ? `?${search}` : "";
}
export async function generateMetadata({ params, searchParams }) {
  const site = renderSite(routePath(await params), searchString(await searchParams));
  return { title: site.title, description: site.description, openGraph: { title: site.title, description: site.description } };
}
export async function generateViewport({ params }) {
  return { themeColor: renderSite(routePath(await params)).themeColor };
}
export default async function Page({ params, searchParams }) {
  const site = renderSite(routePath(await params), searchString(await searchParams));
  if (!site.found) notFound();
  return <SiteClient site={site} />;
}
