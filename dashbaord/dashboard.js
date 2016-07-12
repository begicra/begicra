'use strict';

const path = require('path');
const crypto = require('crypto');
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

function newId() {
  const value = Math.random().toString();
  const md5 = crypto.createHash('md5');
  md5.update(value, 'utf8');
  return md5.digest('hex');
}

router.use('/', express.static(path.join(__dirname, 'static')));
router.post('/new', (req, res) => {
  res.redirect(path.join('/app', newId(), 'bbs'));
});

module.exports = router;
