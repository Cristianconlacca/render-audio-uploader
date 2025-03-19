const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Public folder per esporre i file
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));

// Crea la cartella se non esiste
const uploadDir = path.join(__dirname, '/public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurazione Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Endpoint upload
app.post('/upload', upload.single('file'), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ file_url: fileUrl });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
