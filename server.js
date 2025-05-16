const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة البيانات
const db = new sqlite3.Database("database.db");

// إنشاء الجدول مع id و createdAt
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    plan TEXT,
    createdAt TEXT
  )
`);

// إعدادات السيرفر
app.use(express.static("public"));
app.use(express.json());

// حفظ البيانات مع الوقت
app.post("/save", (req, res) => {
  const { name, email, plan } = req.body;
  const createdAt = new Date().toISOString(); // حفظ التاريخ الحالي بتنسيق ISO

  db.run(
    "INSERT INTO users (name, email, plan, createdAt) VALUES (?, ?, ?, ?)",
    [name, email, plan, createdAt],
    (err) => {
      if (err) return res.status(500).send("خطأ في الحفظ");
      res.send("تم الحفظ بنجاح");
    }
  );
});

// جلب البيانات (مرتبة من الأحدث إلى الأقدم)
app.get("/data", (req, res) => {
  db.all("SELECT * FROM users ORDER BY datetime(createdAt) DESC", [], (err, rows) => {
    if (err) return res.status(500).send("خطأ في القراءة");
    res.json(rows);
  });
});

// حذف مستخدم حسب ID
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("فشل في الحذف");
    res.send("تم الحذف بنجاح");
  });
});

app.listen(PORT, () => console.log("✅ السيرفر يعمل على:", PORT));
