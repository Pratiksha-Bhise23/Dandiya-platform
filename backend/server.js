// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const ticketRoutes = require('./routes/ticketRoutes');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.use('/api/tickets', ticketRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bookingRoutes = require("./routes/bookingRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", bookingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
