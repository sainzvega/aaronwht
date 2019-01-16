const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
require('dotenv').config();

const app = express();

app.use(cors());
// fetches root files from client/build
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use('/files', express.static(path.join(__dirname, 'files')));

const bodyParser = require('body-parser');
app.options('*', cors());

const morgan = require('morgan');
const router = require('./router');

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(`${__dirname}/favicon.ico`));
});

app.get('/api/aaron', (req, res) => {
  res.send(`Endpoint hit ${Math.random()}`);
});

router(app);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

http.createServer(app).listen(process.env.PORT || 8000);
