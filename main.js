const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('data.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
)`);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// حفظ البيانات من النموذج
ipcMain.on("save-data", (event, data) => {
  db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [data.name, data.email], function(err) {
    if (!err) {
      event.sender.send("data-saved");
    }
  });
});

// إرسال البيانات لصفحة العرض
ipcMain.on("get-data", (event) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err);
      return;
    }
    event.sender.send("data-result", rows);
  });
});
