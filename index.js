const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const app = express();
const uploadDir = path.join('/tmp', 'uploads');

// Ensure the /tmp/uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to use the /tmp/uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the /tmp/uploads directory
app.use('/uploads', express.static(uploadDir));

app.post('/submit', upload.single('transactionScreenshot'), (req, res) => {
  const { ticketNumber, ticketType, amount, total } = req.body;
  const transactionScreenshot = req.file;
  const personDetails = JSON.parse(req.body.personDetails);

  console.log("Received data:", {
    ticketNumber,
    ticketType,
    amount,
    total,
    personDetails,
    transactionScreenshot
  });

  personDetails.forEach(person => {
    const newRow = {
      ticketNumber,
      ticketType,
      name: person.name,
      email: person.email,
      phone: person.phone,
      amount: parseInt(amount, 10),
      total: parseInt(total, 10),
      transactionScreenshot: `/uploads/${transactionScreenshot.filename}`
    };
    console.log("Adding new row:", newRow);
    db.run(`INSERT INTO tickets (ticketNumber, ticketType, name, email, phone, amount, total, transactionScreenshot) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [newRow.ticketNumber, newRow.ticketType, newRow.name, newRow.email, newRow.phone, newRow.amount, newRow.total, newRow.transactionScreenshot],
      function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
  });

  res.send('Ticket data stored successfully!');
});

app.use('/admin', require('./views/admin'));

app.get('/admin/data', (req, res) => {
  db.all("SELECT * FROM tickets", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
