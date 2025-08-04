const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./Routes');

const app = express();
const port = process.env.PORT || 9000;

app.use(cors({
  origin: true,         // Reflect the request origin
  credentials: true     // Allow cookies/auth headers
}));

app.use(cookieParser());

// Parse JSON and urlencoded bodies BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes AFTER the body parsers
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
