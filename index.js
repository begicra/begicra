const express = require('express');

const app = express();
require('express-ws')(app);

const dashboard = require('./dashbaord/dashboard');
const bbs = require('./bbs/bbs');
const monitor = require('./monitor/monitor');

app.use('/bbs', bbs);
app.use('/monitor', monitor);
app.use('/', dashboard);

app.listen(3000);

setInterval(() => monitor.interceptor.send('ping'), 1000);
