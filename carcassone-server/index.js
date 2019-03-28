const WebSocket = require('ws');
const uuid = require('uuid/v1');
const Immutable = require('immutable');

const wss = new WebSocket.Server({ port: 8080 });

let users  = Immutable.Set();

wss.on('connection', ws => {
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`)
  })
  const id = uuid();
  users = users.add(id);
  ws.send(JSON.stringify(users.toJS()))
})