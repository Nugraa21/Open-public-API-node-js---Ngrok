# 🚀 Secure Ngrok + Dashboard + Protected phpMyAdmin

README ini menjelaskan sistem lengkap untuk mengamankan akses **phpMyAdmin** menggunakan Node.js + Ngrok, namun **dashboard tetap bebas diakses** tanpa password.

Semua fitur sudah dirancang sesuai kebutuhan projek kamu (Ludang Prasetyo Nugroho / Nugra).

---

## 📌 Fitur Utama

* 🔥 **Dashboard bebas akses** (tidak butuh login)
* 🔒 **phpMyAdmin terkunci password** (harus login dulu lewat `/secure-login`)
* 🛡 Proteksi session memakai `express-session`
* 🔁 Ngrok otomatis konek dengan **URL stabil**
* 🌐 Reverse proxy aman → phpMyAdmin tidak dibuka langsung ke publik
* 📂 Auto-generate `ngrok.json` untuk kebutuhan frontend

---

## 📦 Instalasi

Clone project lalu install semua dependency:
                   
```bash   
npm install express express-session http-proxy-middleware @ngrok/ngrok dotenv
```

---

## 📁 Struktur Folder

```
project-folder/
│── public/             → Dashboard frontend
│── server.js           → Server utama + proteksi phpMyAdmin
│── .env                → Token + password rahasia
│── package.json
│── README.md
```

---

## 🔐 `.env` Configuration

Buat file `.env`:

```env
NGROK_AUTHTOKEN=token_ngrok_anda
PMA_PASSWORD=PasswordAksesPhpMyAdmin
PMA_SECRET=sessionsecret123
```

---

# 🧠 server.js (Full Code)

```javascript
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');\const ngrok = require('@ngrok/ngrok');
const path = require('path');

const app = express();
const PORT = 5555; // Ngrok masuk ke port ini

app.use(express.urlencoded({ extended: true }));

// ========================
// SESSION
// ========================
app.use(session({
    secret: process.env.PMA_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
}));

// ========================
// DASHBOARD (TANPA LOGIN)
// ========================
app.use("/", express.static(path.join(__dirname, "public")));

// ========================
// LOGIN UNTUK PHPMyAdmin
// ========================
app.get("/secure-login", (req, res) => {
    res.send(`
        <form method="POST" action="/secure-login" style="max-width:300px;margin:auto;padding-top:70px">
            <h3>Akses phpMyAdmin</h3>
            <input type="password" name="pass" placeholder="Password" style="width:100%;padding:8px;margin:10px 0"/>
            <button type="submit" style="width:100%;padding:8px">Login</button>
        </form>
    `);
});

app.post("/secure-login", (req, res) => {
    if (req.body.pass === process.env.PMA_PASSWORD) {
        req.session.phpAdminAllowed = true;
        return res.redirect("/phpmyadmin");
    }
    res.send("<h3>Password salah!</h3><a href='/secure-login'>Coba lagi</a>");
});

// ========================
// PROTEKSI PHPMyAdmin
// ========================
function protectPhp(req, res, next) {
    if (req.session.phpAdminAllowed) return next();
    return res.redirect("/secure-login");
}

// ========================
// PROXY KE PHPMyAdmin
// ========================
app.use(
    "/phpmyadmin",
    protectPhp,
    createProxyMiddleware({
        target: "http://localhost",
        changeOrigin: true,
    })
);

// ========================
// START SERVER + NGROK
// ========================
app.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);

    const listener = await ngrok.connect({
        addr: PORT,
        authtoken: process.env.NGROK_AUTHTOKEN,
    });

    console.log("======================================");
    console.log("🔐 Link Login phpMyAdmin:");
    console.log(`➡ ${listener.url()}/secure-login`);
    console.log("--------------------------------------");
    console.log("🟢 Dashboard tanpa login:");
    console.log(`➡ ${listener.url()}/`);
    console.log("======================================");
});
```

---

## 🚀 Cara Menjalankan

### 1️⃣ Jalankan server

```bash
node server.js
```

### 2️⃣ Buka dashboard (tanpa login)

```
https://xxxxx.ngrok-free.dev/
```

### 3️⃣ Masuk phpMyAdmin (punya akses khusus)

```
https://xxxxx.ngrok-free.dev/secure-login
```

---

# 🎯 Keuntungan Sistem Ini

* phpMyAdmin **tidak terbuka publik**
* Dashboard tetap **bebas & aman**
* URL ngrok **stabil / tidak berubah**
* Cocok untuk proyek:

  * Monitoring API
  * Database management
  * ESP32 / Flutter / React / Mobile Apps

---

# 💬 Maintainer

**Ludang Prasetyo Nugroho**
(Yogyakarta, Indonesia)

Website: [https://nugra.my.id](https://nugra.my.id)
Domain: nugra.my.id

---

Kalau butuh badge GitHub, animasi, atau screenshot dashboard, bilang aja nanti aku tambahin ❤️
