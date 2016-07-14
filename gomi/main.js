/* eslint-env jquery */

(() => {
  'use strict';

  const wsHostName = location.host || 'localhost:3000';
  const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const pathname = location.pathname;
  const wsUri = `${wsProtocol}//${wsHostName}${pathname}ws`;
  console.log(wsUri);
  const ws = new WebSocket(wsUri);
  ws.onmessage = event => {
    if (!event.data) return;

    const ret = JSON.parse(event.data);

    function sqlQuery(data) {
      console.log(data.sql);
      //const $query = $('<div class="alert alert-success"></div>').text(data.sql);
      const $code = $('<code class="sql"></code>').text(data.sql);
      const $pre = $('<pre></pre>').append($code);
      const $query = $('<div class="alert alert-success"></div>').append($pre);
      
      return $query;
    }

    function sqlResult(data) {
      const rows = data.rows;

      console.log(rows);

      if (rows.length <= 0) {
        return $('<div class="sql-result">クエリで得られた表がありません</div>');
      }

      const fields = Object.keys(rows[0]);
      console.log("fields");
      console.log(fields);

      const $table = $('<table class="table table-bordered table-striped sql-result"></table>');

      // <tr><th>id</th><th>name</th>...</tr>
      const $ths = fields.map(field => $('<th></th>').text(field));
      const $header = $('<tr></tr>').append($ths);
      $table.append($header);

      const $rows = rows.map(row => {
        const $tds = fields.map(field => $('<td></td>').text(row[field]));
        return $('<tr></tr>').append($tds);
      });
      $table.append($rows);

      return $table;
    }

    function sqlError(data) {
      const $error = $('<div class="alert alert-danger"></div>')
              .text(data.error);
      return $error;
    }

    if (!ret.type) {
      console.log('データが空です');
    } else if (ret.type === 'sql/query') {
      $('#results').append(sqlQuery(ret));
    } else if (ret.type === 'sql/result') {
      $('#results').append(sqlResult(ret));
    } else if (ret.type === 'sql/error') {
      $('#results').append(sqlError(ret));
    }

    // syntax hilight
    $(document).ready(function(){
      $('pre code').each(function(i, block){
        hljs.highlightBlock(block);
      });
    });
  };

  ws.onopen = () => {
    console.log('Connected');
  };
})();
