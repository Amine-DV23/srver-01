const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة البيانات
const db = new sqlite3.Database("database.db");

db.run("CREATE TABLE IF NOT EXISTS users (name TEXT, email TEXT)");

// إعدادات السيرفر
app.use(express.static("public"));
app.use(express.json());

// حفظ البيانات
app.post("/save", (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], err => {
    if (err) return res.status(500).send("خطأ في الحفظ");
    res.send("تم الحفظ بنجاح");
  });
});

// جلب البيانات
app.get("/data", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في القراءة");
    res.json(rows);
  });
});

app.listen(PORT, () => console.log("✅ السيرفر يعمل على:", PORT));
