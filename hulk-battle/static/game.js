var socket = io();
// socket.on('message', function(data) {
//     console.log(data);
// });
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    var img = document.getElementById("hulk");
    console.log(player.cropX);
    context.drawImage(img, player.cropX, player.cropY, player.cropW, player.cropH, player.x, player.y, 160, 200);
    context.fill();
  }
});
socket.emit('window size', [window.innerWidth - 100, window.innerHeight - 100]);
var movement = {
    left: false,
    up: false,
    right: false,
    down: false,
    jump: false
};
document.addEventListener('keydown', function(event) {
    switch(event.keyCode) {
        case 37: //left arrow
            movement.left = true;
            break;
        case 38: //up arrow
            movement.up = true;
            break;
        case 39: //right arrow
            movement.right = true;
            break;
        case 40: //down arrow
            movement.down = true;
            break;
        case 32: // Space
            movement.jump = true;
            break;
    }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: //left arrow
      movement.left = false;
      break;
    case 38: //up arrow
      movement.up = false;
      break;
    case 39: //right arrow
      movement.right = false;
      break;
    case 40: //down arrow
      movement.down = false;
      break;
    case 32: // Space
        movement.jump = false;
        break;
  }
});
socket.emit('new player');
setInterval(function() {
    socket.emit('movement', movement)
}, 1000/60);