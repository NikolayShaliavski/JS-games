var socket = io();
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var img = document.getElementById("hulk");
  for (var id in players) {
    var player = players[id];
    let playerXScale = player.playerXScale;
    context.scale(playerXScale, 1);
    context.drawImage(img, player.cropX, player.cropY, player.cropW, player.cropH, player.x * playerXScale, player.y, 160, 200);

//     context.beginPath();
//     if (playerXScale == 1) {
//         context.arc(player.x + player.cropW * 2, player.y, 10,0,2*Math.PI);
//     } else {
//         context.arc(player.x - player.cropW * 2, player.y, 10,0,2*Math.PI);
//     }
    
//     context.fill();

   }
});
var movement = {
    left: false,
    up: false,
    right: false,
    down: false,
    jump: false,
    hit: false
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
        case 77: // M
            movement.hit = true;
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
        case 77: // M
            movement.hit = false;
            break;
    }
});
socket.emit('new player', [window.innerWidth - 100, window.innerHeight - 100]);
setInterval(function() {
    socket.emit('movement', movement)
}, 1000/60);