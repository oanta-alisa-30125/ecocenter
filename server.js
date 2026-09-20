const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, "public", "uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: false }
}));
app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = path.basename(file.originalname, ext)
      .normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-")
      .toLowerCase();
    cb(null, `${Date.now()}-${safe || "lucrare"}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/i.test(path.extname(file.originalname));
    cb(allowed ? null : new Error("Sunt permise doar JPG, PNG și WEBP."), allowed);
  }
});

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  res.status(401).json({ error: "Neautorizat." });
}

app.get("/api/gallery", (_, res) => {
  const files = fs.readdirSync(UPLOAD_DIR)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a,b) => b.localeCompare(a))
    .map(name => ({ name, url: `/uploads/${encodeURIComponent(name)}` }));
  res.json(files);
});

app.post("/api/login", (req, res) => {
  const password = String(req.body.password || "");
  if (password && password === (process.env.ADMIN_PASSWORD || "schimba-parola-aceasta")) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Parolă incorectă." });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => res.json({ isAdmin: !!req.session.isAdmin }));

app.post("/api/upload", requireAdmin, upload.array("photos", 30), (req, res) => {
  res.json({
    ok: true,
    files: (req.files || []).map(f => ({ name: f.filename, url: `/uploads/${encodeURIComponent(f.filename)}` }))
  });
});

app.delete("/api/gallery/:name", requireAdmin, (req, res) => {
  const name = path.basename(req.params.name);
  const file = path.join(UPLOAD_DIR, name);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ error: err.message || "Încărcarea a eșuat." });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`ECOCENTER SERV: http://localhost:${PORT}`);
});
