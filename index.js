const express = require('express');
const virtual = require('./libs/virtual-middleware');
const Application = require('./libs/time-application');
const StatisticsPusher = require('./libs/statistics-pusher');
const CronJob = require('cron').CronJob;

const app = express();
require('express-ws')(app);

const dashboard = require('./dashbaord/dashboard');

// 環境ごと
app.use(/\/app\/[a-zA-Z0-9]+\/bbs/,
  virtual(pathname => Application.fromPathname(pathname).bbs));
app.use(/\/app\/[a-zA-Z0-9]+\/monitor/,
  virtual(pathname => Application.fromPathname(pathname).monitor));

// ダッシュボード
app.use('/', dashboard);

app.listen(3000);

const pusher = StatisticsPusher.create(Application);
if (pusher) {
  const job = new CronJob({
    cronTime: '*/5 * * * *',
    onTick: () => {
      pusher.push();
      Application.erase();
    },
    start: false,
  });
  job.start();
}
