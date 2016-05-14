/* eslint-env jquery */

(() => {
  'use strict';

  const ws = new WebSocket('ws://localhost:3000/monitor/ws');
  ws.onmessage = event => {
    if (!event.data) return;

    const ret = JSON.parse(event.data);

    function sqlQuery(data) {
      console.log(data.sql);
      const $query = $('<div class="alert alert-success"></div>')
              .text(data.sql);

      return $query;
    }

    function sqlResult(data) {
      console.log(data.rows);

      if (data.rows.length <= 0) {
        $('#retResultBox').empty().append('データなし');
        return $('データなし');
      }

      const $rows = data.rows.map(row => $('<tr></tr>')
                                 .append($('<td></td>').text(row.id))
                                 .append($('<td></td>').text(row.name))
                                 .append($('<td></td>').text(row.password)));

      const $tr = $('<tr></tr>').append($rows);
      const $table = $('<table class="table table-bordered table-striped">' +
                       '<tr><th>id</th><th>name</th><th>password</th></tr></table>');
      $table.append($tr);

      return $table;
    }

    if (!ret.type) {
      console.log('データが空です');
    } else if (ret.type === 'sql/query') {
      $('#retSelectBox').empty().append(sqlQuery(ret));
    } else if (ret.type === 'sql/result') {
      $('#retResultBox').empty().append(sqlResult(ret));
    }
  };

  ws.onopen = () => {
    console.log('Connected');
  };
})();
