import { renderSite } from "../src/site-renderer.js";
import SiteClient from "../src/site-client.jsx";

export default function NotFound() { return <SiteClient site={renderSite("/missing-page")} />; }
