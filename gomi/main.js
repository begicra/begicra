(() => {
  'use strict';

  const ws = new WebSocket('ws://localhost:3000/monitor/ws');
  ws.onmessage = event => {

  	if (!event.data) return;
  	
  	var ret = JSON.parse(event.data);

    if (!ret.type) {
    	console.log('データが空です');
    }
    else if (ret.type=='sql/query') {
    	console.log(ret.sql);
    	$('#retSelectBox').html('<div class="alert alert-success">'+ret.sql+'</div>');
    }
    else if (ret.type == 'sql/result') {
    	console.log(ret.rows);
    	var elem = '';
    	jQuery.each(ret.rows, function() {
    		elem += '<tr>';
    		elem += '<td>' + this.id + '</td>';
    		elem += '<td>' + this.name + '</td>';
    		elem += '<td>' + this.password + '</td>';
    		elem += '</tr>';
    	});

    	if (ret.rows.length > 0) {
	    	var html = '<table class="table table-bordered table-striped"><tr><th>id</th><th>name</th><th>password</th></tr>'+elem+'</table>';
	    	$('#retResultBox').html(html);
	    }
    }

  };

  ws.onopen = () => {
    console.log('Connected');
  };
})();
