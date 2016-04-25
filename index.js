const express = require('express');
const dashboard = require('./dashbaord/dashboard');
const bbs = require('./bbs/bbs');

const app = express();

app.use('/bbs', bbs);
app.use('/', dashboard);
app.listen(3000);

