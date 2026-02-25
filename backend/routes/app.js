require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const payfastRoutes = require('./payFastRoutes');
app.use('/payment', payfastRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
