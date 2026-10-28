const BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    // no JSON body (for example a 204 response)
  }

  if (!response.ok) {
    const validationError = Array.isArray(body?.errors) ? body.errors[0]?.msg : null;
    const serverMessage = typeof body === "string" ? body : body?.message || body?.error || validationError;
    const error = new Error(serverMessage || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}