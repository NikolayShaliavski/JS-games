const floor = 370;
const speed = 5;

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
var index = 1;
var lastUpdateSprite = Date.now();
var lastMoveHandle = Date.now();

module.exports = {
    add_player: function(socketID, size) {
        let count = Object.keys(players).length;
        let windowWidth = size[0];
        let windowHeight = size[1];
        if (count == 0) {
            players[socketID] = {
                x: 20,
                y: floor,
                cropX: playerXCropSize[1]["x"],
                cropW: playerXCropSize[1]["w"],
                cropY: playerYCropSize["y"],
                cropH: playerYCropSize["h"],
                playerXScale: 1,
                windowWidth: windowWidth,
                windowHeight: windowHeight
            };
        } else if (count == 1) {
            players[socketID] = {
                x: windowWidth,
                y: floor,
                cropX: playerXCropSize[1]["x"],
                cropW: playerXCropSize[1]["w"],
                cropY: playerYCropSize["y"],
                cropH: playerYCropSize["h"],
                playerXScale: -1,
                windowWidth: windowWidth,
                windowHeight: windowHeight
            };
        }
    },
    remove_player: function(socketID) {
        delete players[socketID];
    },
    get_players: function() {
        return players;
    },
    move_player: function(data, socketID) {
        var player = players[socketID] || {};
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
            player.x -= player.cropW;
            player.cropX = playerXCropSize[index]["x"];
            player.cropW = playerXCropSize[index]["w"];
            player.x += player.cropW;
            if (player.playerXScale == 1) {
                if (player.x > 20) {
                    player.x -= speed;
                }
            } else if (player.playerXScale == -1) {
                if (player.x > 170) {
                    player.x -= speed;
                }
            }
        }
        if (data.up) {
            //player.y -= speed;
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
            player.x -= player.cropW;
            player.cropX = playerXCropSize[index]["x"];
            player.cropW = playerXCropSize[index]["w"];
            player.x += player.cropW;
            if (player.x < player.windowWidth) {
                player.x += speed;
            }
        }
        if (data.down) {
            //player.y += speed;
        }
    },
    land_players: function() {
        for(var key in players) {
            let player = players[key];
            if (player.y >= floor) {
                player.y = floor;
            } else if (player.y < floor) {
                player.y += 10;
            }
        }
    }
}