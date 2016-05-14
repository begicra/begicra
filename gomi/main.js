/* eslint-env jquery */

(() => {
  'use strict';

  const ws = new WebSocket('ws://localhost:3000/monitor/ws');
  ws.onmessage = event => {
    if (!event.data) return;

    const ret = JSON.parse(event.data);

    if (!ret.type) {
      console.log('データが空です');
    } else if (ret.type === 'sql/query') {
      console.log(ret.sql);
      const $query = $('<div class="alert alert-success"></div>')
              .text(ret.sql);
      $('#retSelectBox').empty().append($query);
    } else if (ret.type === 'sql/result') {
      console.log(ret.rows);
      console.log(ret.rows.length);

      if (ret.rows.length <= 0) {
        $('#retResultBox').empty().append('Empty Result');
      } else {
        const $rows = ret.rows.map(row => $('<tr></tr>')
                                   .append($('<td></td>').text(row.id))
                                   .append($('<td></td>').text(row.name))
                                   .append($('<td></td>').text(row.password)));

        const $tr = $('<tr></tr>').append($rows);
        const $table = $('<table class="table table-bordered table-striped">' +
                         '<tr><th>id</th><th>name</th><th>password</th></tr></table>');
        $table.append($tr);

        $('#retResultBox').empty().append($table);
      }
    }
  };

  ws.onopen = () => {
    console.log('Connected');
  };
})();
