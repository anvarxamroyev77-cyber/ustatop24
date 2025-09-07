// Frontend JS - connects to backend API
const API = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? "http://localhost:5000/api" : "/api";

// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value
    };
    const res = await fetch(`${API}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.msg || 'Ro'yxatdan o'tildi');
      window.location.href = "index.html";
    } else {
      alert(data.error || 'Xatolik');
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = { email: document.getElementById("loginEmail").value, password: document.getElementById("loginPassword").value };
    const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || 'Xatolik');
    }
  });
}

// Dashboard logic
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) { window.location.href = "index.html"; }

  document.getElementById("userRole").innerText = user.name + " • " + user.role;

  // load orders
  async function loadOrders(){
    const res = await fetch(`${API}/orders`);
    const data = await res.json();
    const el = document.getElementById("orders");
    el.innerHTML = "";
    data.forEach(o => {
      const li = document.createElement("li");
      li.textContent = `${o.title} — ${o.city} (${o.budget || '-'})`;
      el.appendChild(li);
    });
  }
  loadOrders();

  // load usta list
  async function loadUstas(){
    const res = await fetch(`${API}/orders`); // demo: reuse orders for listing
    const data = await res.json();
    const ul = document.getElementById("ustaList");
    ul.innerHTML = "";
    data.slice(0,5).forEach(o => {
      const li = document.createElement("li");
      li.textContent = o.title + " — " + (o.city || '-');
      ul.appendChild(li);
    });
  }
  loadUstas();

  // chat
  async function loadChat(){
    const res = await fetch(`${API}/chat`);
    const msgs = await res.json();
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    msgs.forEach(m => {
      const d = document.createElement("div");
      d.classList.add("message");
      d.classList.add(m.userId === user._id ? "me" : "other");
      d.textContent = `${m.name}: ${m.text}`;
      chatBox.appendChild(d);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  loadChat();

  document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = { text: document.getElementById("chatInput").value, userId: user._id, name: user.name };
    await fetch(`${API}/chat`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) });
    document.getElementById("chatInput").value = "";
    loadChat();
  });

  // create order modal
  const modalBack = document.getElementById("modal-back");
  document.getElementById("btn-create").addEventListener("click", ()=> { modalBack.style.display = "flex"; modalBack.setAttribute("aria-hidden","false"); });
  document.getElementById("modal-cancel").addEventListener("click", ()=> { modalBack.style.display = "none"; modalBack.setAttribute("aria-hidden","true"); });
  document.getElementById("modal-submit").addEventListener("click", async ()=> {
    const title = document.getElementById("order-title").value.trim();
    const desc = document.getElementById("order-desc").value.trim();
    const city = document.getElementById("order-city").value.trim();
    const budget = document.getElementById("order-budget").value.trim();
    if (!title || !city) { alert('Sarlavha va shahar kerak'); return; }
    await fetch(`${API}/orders`, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ title, description: desc, city, budget, clientId: user._id }) });
    modalBack.style.display = "none";
    loadOrders();
  });

  document.getElementById("logoutBtn").addEventListener("click", ()=> { localStorage.removeItem("user"); window.location.href="index.html"; });
}
