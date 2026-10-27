/**
 * Safe web helpers for the agent.
 * - Only http/https
 * - Block localhost / private IPs
 * - Timeout + size limit
 * - Page text is treated as DATA only (never as instructions)
 */

const FETCH_TIMEOUT_MS = 12_000;
const MAX_TEXT_CHARS = 12_000;

function isPrivateOrLocalHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "::1") return true;
  if (h.endsWith(".local")) return true;
  // Simple private IP checks
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  return false;
}

export function assertSafeUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }

  if (isPrivateOrLocalHost(parsed.hostname)) {
    throw new Error("Local and private network URLs are blocked");
  }

  return parsed;
}

/**
 * Fetch a page and return plain text (stripped of scripts/styles).
 * Result is wrapped so the model treats it as untrusted data.
 */
export async function fetchPageService(url: string): Promise<{
  url: string;
  title?: string;
  text: string;
  truncated: boolean;
}> {
  const safe = assertSafeUrl(url);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(safe.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "TinyCatsBot/1.0 (+https://github.com/tiny-cats-mcp)",
        Accept: "text/html,application/xhtml+xml,text/plain",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch page: HTTP ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/plain") &&
      !contentType.includes("application/xhtml")
    ) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim();

    // Very light HTML → text
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const truncated = text.length > MAX_TEXT_CHARS;
    if (truncated) text = text.slice(0, MAX_TEXT_CHARS) + "…";

    return {
      url: safe.toString(),
      ...(title ? { title } : {}),
      text,
      truncated,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Web search via Tavily if TAVILY_API_KEY is set.
 * Falls back to a clear error so the agent can tell the user.
 */
export async function searchWebService(
  query: string,
  maxResults = 5
): Promise<
  Array<{ title: string; url: string; snippet: string }>
> {
  const key = process.env.TAVILY_API_KEY?.trim();

  if (!key) {
    // No key: return empty with a note the agent can surface
    return [
      {
        title: "Web search not configured",
        url: "",
        snippet:
          "TAVILY_API_KEY is missing. Add it to backend/.env to enable live web search. You can still use fetch_page with a known URL.",
      },
    ];
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      query,
      max_results: Math.min(maxResults, 8),
      include_answer: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Web search failed: HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
  };

  return (data.results || []).map((r) => ({
    title: r.title || "",
    url: r.url || "",
    snippet: r.content || "",
  }));
}

/**
 * High-level: find a cattery by name (search → fetch a few pages → structured extract is left to the agent).
 * This service returns raw search hits + optional page texts for the agent to parse.
 */
export async function findCatteryRawService(
  name: string,
  location?: string
): Promise<{
  query: string;
  searchResults: Array<{ title: string; url: string; snippet: string }>;
  pages: Array<{ url: string; title?: string; text: string }>;
}> {
  const query = [name, location, "cattery", "kittens"].filter(Boolean).join(" ");
  const searchResults = await searchWebService(query, 5);

  const pages: Array<{ url: string; title?: string; text: string }> = [];

  for (const hit of searchResults.slice(0, 3)) {
    if (!hit.url || !hit.url.startsWith("http")) continue;
    try {
      const page = await fetchPageService(hit.url);
      pages.push({
        url: page.url,
        ...(page.title ? { title: page.title } : {}),
        // Label as untrusted data for the model
        text: `[UNTRUSTED WEB CONTENT from ${page.url}]\n${page.text}`,
      });
    } catch {
      // skip failed pages
    }
  }

  return { query, searchResults, pages };
}
