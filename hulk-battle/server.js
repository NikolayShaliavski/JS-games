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
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});
// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
//fields
const speed = 5;
const floor = 370;
const xKey = "x";
const yKey = "y";
const wKey = "w";
const hKey = "h";
var players = {};
var playerXCropSize = {
  1: {"x": 0, "w": 80},
  2: {"x": 81, "w": 67},
  3: {"x": 149, "w": 92},
  4: {"x": 242, "w": 72},
  5: {"x": 313, "w": 73},
  6: {"x": 384, "w": 94}
};
var playerYCropSize = {
  "y": 285,
  "h": 100
};
var windowWidth = 0;
var windowHeight = 0;
var index = 1;
var lastUpdateSprite = Date.now();
var lastMoveHandle = Date.now();
//Add WebSocket handlers
io.on('connection', function(socket) {
  socket.on('window size', function(size) {
    windowWidth = size[0];
    windowHeight = size[1];
  });
  socket.on('new player', function() {
      players[socket.id] = {
        x: 20,
        y: floor,
        cropX: playerXCropSize[1]["x"],
        cropW: playerXCropSize[1]["w"],
        cropY: playerYCropSize["y"],
        cropH: playerYCropSize["h"]
      }
  });
  socket.on('movement', function(data, size) {
    var player = players[socket.id] || {};
    if (data.jump) {
      if (player.y >= floor) {
        player.y -= 250;
      }
    }
    if (data.left) {
      var now = Date.now();
      var diff = now - lastUpdateSprite;
      if (diff > 100) {
        index--;
        if (index <= 1) {
          index = Object.keys(playerXCropSize).length;
        }
        lastUpdateSprite = now;
      }
      player.cropX = playerXCropSize[index]["x"];
      player.cropW = playerXCropSize[index]["w"];
      if (player.x > 20) {
        player.x -= speed;
      }
    }
    if (data.up) {
      if (player.y > 20) {
        //player.y -= speed;
      }
    }
    if (data.right) {
      var now = Date.now();
      var diff = now - lastUpdateSprite;
      if (diff > 100) {
        index++;
        if (index >= Object.keys(playerXCropSize).length + 1) {
          index = 1;
        }
        lastUpdateSprite = now;
      }
      player.cropX = playerXCropSize[index]["x"];
      player.cropW = playerXCropSize[index]["w"];
      if (player.x < windowWidth) {
        player.x += speed;
      }
    }
    if (data.down) {
      if (player.y < windowHeight) {
        //player.y += speed;
      }
    }
  });
});
setInterval(function() {
  // let diff = lastUpdateSprite - lastMoveHandle;
  // if (diff > 2000) {
  //   for(var key in players) {
  //     console.log(players[key]);
  //     players[key].cropX = playerXCropSize[1]["x"];
  //     players[key].cropW = playerXCropSize[1]["w"];
  //     console.log(players[key]);
  //   }
  //   lastMoveHandle = lastUpdateSprite;
  // }

  for(var key in players) {
    let player = players[key];
    if (player.y >= floor) {
      player.y = floor;
    } else if (player.y < floor) {
      player.y += 10;
    }
  }
  io.sockets.emit('state', players);
}, 1000/60);