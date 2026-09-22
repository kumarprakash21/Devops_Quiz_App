const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("cloudprep-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Something went wrong.");
  return body;
}

export const api = {
  register: body => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: body => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  nextQuestion: (course, section, excludeIds) => request("/questions/next", { method: "POST", body: JSON.stringify({ course, section, excludeIds }) }),
  saveAttempt: body => request("/attempts", { method: "POST", body: JSON.stringify(body) })
};
