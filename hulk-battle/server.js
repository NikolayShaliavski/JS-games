// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Game engine dependency
const gameEngine = require('./engine/game-engine');

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// Add WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function(size) {
    let windowWidth = size[0];
    let windowHeight = size[1];
    //call add player function
    gameEngine.add_player(socket.id, [windowWidth, windowHeight]);
  });
  socket.on('movement', function(data) {
    //call move player function
    gameEngine.move_player(data, socket.id);
  });
  socket.on('disconnect', function() {
    gameEngine.remove_player(socket.id);
  });
});
setInterval(function() {
  //call function to land players after jump
  gameEngine.land_players();
  //get players object from game engine
  let players = gameEngine.get_players();
  io.sockets.emit('state', players);
}, 1000/60);