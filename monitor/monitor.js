'use strict';
const debug = require('debug')('express:ws');

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const sendors = [];
const invokeSend = data => {
  sendors.forEach(send => send(data));
};

router.ws('/ws', ws => {
  debug('Monitor connected');

  sendors.push(data => ws.send(data));
});

router.interceptor = {
  send(data) {
    invokeSend(data);
  },
};

module.exports = router;
