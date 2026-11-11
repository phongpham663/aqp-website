import { createSubmissionHandler } from "../../../src/server/submissions.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const handleSubmission = createSubmissionHandler({
  rateLimit: {
    max: Number(process.env.API_RATE_MAX ?? 10),
    windowMs: Number(process.env.API_RATE_WINDOW_MS ?? 60_000),
    maxEntries: Number(process.env.API_RATE_MAX_ENTRIES ?? 10_000),
  },
});

function handleRequest(request) {
  return handleSubmission(request);
}

export const GET = handleRequest;
export const POST = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
