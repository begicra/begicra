const express = require('express');

const app = express();
require('express-ws')(app);

const Database = require('./database/database');
const LoggingDatabase = require('./database/logging-database');
const database = new LoggingDatabase(new Database());
database.initialize();

const dashboard = require('./dashbaord/dashboard');
const bbs = require('./bbs/bbs')(database);
const monitor = require('./monitor/monitor');

database.setInterceptor(monitor.interceptor);

app.use('/bbs', bbs);
app.use('/monitor', monitor);
app.use('/', dashboard);

app.listen(3000);

setInterval(() => monitor.interceptor.send(JSON.stringify({ type: 'ping' })), 10000);
