const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const API_PORT = process.env.PORT || 3000;
const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = encodeURIComponent(process.env.MONGODB_PASS);
const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, './frontend/public')));

const dbRoute = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@motivationcluster-3p32s.mongodb.net/test?retryWrites=true`;

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

require('./backend/api/models/Quote');
require('./backend/api/models/QuoteCategory');
require('./backend/api/models/Author');
require('./backend/api/models/Token');

const quoteRouter = require("./backend/api/routes/quote");
const categoryRouter = require("./backend/api/routes/quoteCategory");
const authorRouter = require("./backend/api/routes/author");
const tokenRouter = require("./backend/api/routes/token");
const tcxRouter = require("./backend/api/routes/tcx");

app.use('/api/quote', quoteRouter);
app.use('/api/category', categoryRouter);
app.use('/api/author', authorRouter);
app.use('/api/token', tokenRouter);
app.use('/api/tcx', tcxRouter);

require('./backend/api/routing')(app);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));