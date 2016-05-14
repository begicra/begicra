(() => {
  'use strict';

  const ws = new WebSocket('ws://localhost:3000/monitor/ws');
  ws.onmessage = event => {
    console.log(event.data);
  };

  ws.onopen = () => {
    console.log('Connected');
  };
})();
