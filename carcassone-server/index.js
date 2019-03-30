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


// there is a gameState, after every action it is written into the db
// after the state is persisted in the db
// send a broadcast to all users about it
