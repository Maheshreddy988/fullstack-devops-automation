import { useEffect, useState } from "react";
import { api } from "./api.js";

const emptyUser = { username: "", email: "", contactNumber: "", password: "" };

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function Notice({ notice }) {
  if (!notice) return null;
  return <p className={`notice ${notice.type}`} role="status">{notice.text}</p>;
}

function useAction() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const run = async (fn, okText) => {
    setBusy(true);
    setNotice(null);
    try {
      const result = await fn();
      setNotice({ type: "ok", text: okText || result?.message });
      return result;
    } catch (e) {
      setNotice({ type: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };
  return { busy, notice, run, setNotice };
}

/* ---------- Auth screens ---------- */
function AuthScreen({ onLogin }) {
  const [step, setStep] = useState("login"); // login | signup | verify
  const [form, setForm] = useState(emptyUser);
  const [pendingId, setPendingId] = useState("");
  const [code, setCode] = useState("");
  const { busy, notice, run, setNotice } = useAction();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const go = (s) => { setStep(s); setNotice(null); };

  const submit = async (e) => {
    e.preventDefault();
    if (step === "login") {
      const r = await run(() => api.login({ email: form.email, password: form.password }));
      if (r?.token) onLogin(r.user, r.token);
    } else if (step === "signup") {
      const r = await run(() => api.signUp(form), "Account created.");
      if (r?.newUser?.isVerified) {
        setStep("login");
        setNotice({ type: "ok", text: "Account created. Sign in to continue." });
      } else if (r?.newUser?._id) {
        setPendingId(r.newUser._id);
        setStep("verify");
        setNotice({ type: "ok", text: "Enter the code we emailed you." });
      }
    } else {
      const r = await run(() => api.verify(pendingId, code), "Email verified. You can sign in now.");
      if (r) setStep("login");
    }
  };

  return (
    <main className="auth">
      <aside className="brand">
        <h1>MaheshReddy</h1>
        <p>Material tracking for your team. Sign in to manage users and access.</p>
      </aside>
      <form className="panel" onSubmit={submit}>
        <h2>{step === "login" ? "Sign in" : step === "signup" ? "Create super admin account" : "Verify your email"}</h2>
        {step === "signup" && <Field label="Username" value={form.username} onChange={set("username")} required />}
        {step !== "verify" && <Field label="Email" type="email" value={form.email} onChange={set("email")} required />}
        {step === "signup" && (
          <Field label="Contact number (10 digits)" pattern="\d{10}" value={form.contactNumber} onChange={set("contactNumber")} required />
        )}
        {step !== "verify" && <Field label="Password" type="password" value={form.password} onChange={set("password")} required />}
        {step === "verify" && <Field label="6-digit code" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} required />}
        <Notice notice={notice} />
        <button className="primary" disabled={busy}>
          {busy ? "Working..." : step === "login" ? "Sign in" : step === "signup" ? "Create account" : "Verify email"}
        </button>
        {step === "login" && <button type="button" className="link" onClick={() => go("signup")}>Create a super admin account</button>}
        {step === "signup" && <button type="button" className="link" onClick={() => go("login")}>Back to sign in</button>}
        {step === "login" && <button type="button" className="link" onClick={() => go("verify")}>I have a verification code</button>}
        {step === "verify" && !pendingId && (
          <Field label="Account ID" value={pendingId} onChange={(e) => setPendingId(e.target.value)} required />
        )}
      </form>
    </main>
  );
}

/* ---------- Dashboard ---------- */
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== ""));

function CreateUser({ admin, token, onDone }) {
  const [form, setForm] = useState({ ...emptyUser, role: "User" });
  const { busy, notice, run } = useAction();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => api.createUser(admin._id, form, token), "User created.");
    if (r) { setForm({ ...emptyUser, role: form.role }); onDone(); }
  };
  return (
    <form className="card" onSubmit={submit}>
      <h3>Create a user</h3>
      <div className="grid">
        <Field label="Username" value={form.username} onChange={set("username")} required />
        <Field label="Email" type="email" value={form.email} onChange={set("email")} required />
        <Field label="Contact number" pattern="\d{10}" value={form.contactNumber} onChange={set("contactNumber")} required />
        <Field label="Password" type="password" value={form.password} onChange={set("password")} required />
        <label className="field">
          <span>Role</span>
          <select value={form.role} onChange={set("role")}>
            <option>Admin</option>
            <option>User</option>
          </select>
        </label>
      </div>
      <Notice notice={notice} />
      <button className="primary" disabled={busy}>Create user</button>
    </form>
  );
}

function UpdateUser({ admin, token, users, selectedId, onDone }) {
  const selected = users.find((u) => u._id === selectedId);
  const [userId, setUserId] = useState(selectedId || "");
  const [form, setForm] = useState({
    username: selected?.username || "",
    email: selected?.email || "",
    contactNumber: selected?.contactNumber || "",
    password: "",
  });
  const { busy, notice, run } = useAction();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const pick = (id) => {
    setUserId(id);
    const u = users.find((x) => x._id === id);
    if (u) setForm({ username: u.username, email: u.email || "", contactNumber: u.contactNumber, password: "" });
  };
  const submit = async (e) => {
    e.preventDefault();
    const r = await run(() => api.updateUser(admin._id, userId, clean(form), token), "User updated.");
    if (r) onDone();
  };
  return (
    <form className="card" onSubmit={submit}>
      <h3>Update a user</h3>
      <label className="field">
        <span>User</span>
        <select value={userId} onChange={(e) => pick(e.target.value)} required>
          <option value="" disabled>Select a user</option>
          {users.map((u) => <option key={u._id} value={u._id}>{u.username} ({u.role})</option>)}
        </select>
      </label>
      <div className="grid">
        <Field label="Username" value={form.username} onChange={set("username")} />
        <Field label="Email" type="email" value={form.email} onChange={set("email")} />
        <Field label="Contact number" pattern="\d{10}" value={form.contactNumber} onChange={set("contactNumber")} />
        <Field label="New password (leave blank to keep)" type="password" value={form.password} onChange={set("password")} />
      </div>
      <Notice notice={notice} />
      <button className="primary" disabled={busy || !userId}>Save changes</button>
    </form>
  );
}

function UsersTable({ users, loading, error, onRefresh, onEdit }) {
  return (
    <section className="card">
      <div className="row">
        <h3>All users ({users.length})</h3>
        <button className="link" onClick={onRefresh} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
      </div>
      {error && <p className="notice err" role="alert">{error}</p>}
      {!error && !loading && users.length === 0 && <p className="muted">No users yet. Create the first one from Create user.</p>}
      {users.length > 0 && (
        <div className="scroll">
          <table>
            <thead><tr><th>Username</th><th>Email</th><th>Contact</th><th>Role</th><th>Verified</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.contactNumber}</td>
                  <td>{u.role}</td>
                  <td>{u.isVerified ? "Yes" : "No"}</td>
                  <td><button className="link" onClick={() => onEdit(u._id)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Dashboard({ admin, token, onLogout }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api.getUsers(admin._id, token);
      setUsers(r.users ?? r.adminareUserCreation ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const edit = (id) => { setEditId(id); setTab("update"); };
  const done = (next) => { load(); if (next) setTab(next); };
  const tabs = [["users", "Users"], ["create", "Create user"], ["update", "Update user"], ["me", "My account"]];

  return (
    <div className="shell">
      <nav className="side">
        <h1>MaheshReddy</h1>
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "on" : ""} onClick={() => { if (id === "update") setEditId(""); setTab(id); }}>{label}</button>
        ))}
        <button className="out" onClick={onLogout}>Sign out</button>
      </nav>
      <main className="content">
        <header>
          <h2>Welcome, {admin.username}</h2>
          <p>{admin.role}</p>
        </header>
        {tab === "users" && <UsersTable users={users} loading={loading} error={error} onRefresh={load} onEdit={edit} />}
        {tab === "create" && <CreateUser admin={admin} token={token} onDone={() => done()} />}
        {tab === "update" && <UpdateUser key={editId} admin={admin} token={token} users={users} selectedId={editId} onDone={() => done()} />}
        {tab === "me" && (
          <section className="card">
            <h3>My account</h3>
            <dl>
              <dt>Username</dt><dd>{admin.username}</dd>
              <dt>Email</dt><dd>{admin.email}</dd>
              <dt>Contact</dt><dd>{admin.contactNumber}</dd>
              <dt>Verified</dt><dd>{admin.isVerified ? "Yes" : "No"}</dd>
              <dt>Account ID</dt><dd><code>{admin._id}</code></dd>
            </dl>
          </section>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("session")); } catch { return null; }
  });
  const login = (user, token) => {
    const s = { user, token };
    sessionStorage.setItem("session", JSON.stringify(s));
    setSession(s);
  };
  const logout = () => { sessionStorage.removeItem("session"); setSession(null); };
  return session ? <Dashboard admin={session.user} token={session.token} onLogout={logout} /> : <AuthScreen onLogin={login} />;
}