const APEX = "ace66.space";
const WWW = "www.ace66.space";

export function requestScheme(request) {
  const visitor = request.headers.get("CF-Visitor");
  if (visitor) {
    try {
      const parsed = JSON.parse(visitor);
      if (parsed && typeof parsed.scheme === "string" && parsed.scheme) return parsed.scheme.toLowerCase();
    } catch {
      // A malformed visitor header falls through to the forwarded protocol.
    }
  }
  const forwarded = request.headers.get("X-Forwarded-Proto");
  if (forwarded) return forwarded.split(",")[0].trim().toLowerCase();
  return new URL(request.url).protocol.replace(":", "").toLowerCase();
}

export function canonicalLocation(request) {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  if (host !== APEX && host !== WWW) return null;
  if (requestScheme(request) === "https" && host === APEX) return null;
  url.protocol = "https:";
  url.hostname = APEX;
  url.port = "";
  return url.toString();
}

export default {
  async fetch(request, env) {
    const location = canonicalLocation(request);
    if (location) return Response.redirect(location, 301);
    return env.ASSETS.fetch(request);
  },
};
