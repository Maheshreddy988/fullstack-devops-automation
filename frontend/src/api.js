const BASE = (import.meta.env.VITE_API_URL || "") + "/api/v1/auth";

async function request(method, path, body, token) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  signUp: (b) => request("POST", "/superAdmin/signUp", b),
  verify: (id, code) => request("POST", `/superAdmin/verify/${id}`, { code }),
  login: (b) => request("POST", "/superAdmin/login", b),
  createUser: (adminId, b, t) => request("POST", `/superAdmin/createUsers/${adminId}/`, b, t),
  updateUser: (adminId, userId, b, t) => request("PUT", `/superAdmin/update/${adminId}/${userId}`, b, t),
  getUsers: (adminId, t) => request("GET", `/all/${adminId}/`, undefined, t),
};
