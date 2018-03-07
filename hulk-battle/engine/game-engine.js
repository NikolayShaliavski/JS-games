//const floor = 370;
const floorOffset = 100;
const speed = 5;
const jumpHeight = 350;

var players = {};
var playerWalkingXCoordinates = {
  1: {"x": 0, "w": 80},
  2: {"x": 81, "w": 67},
  3: {"x": 149, "w": 92},
  4: {"x": 242, "w": 72},
  5: {"x": 313, "w": 73},
  6: {"x": 384, "w": 94}
};
var playerHitXCoordinates = {
    1: {"x": 0, "w": 80},
    2: {"x": 80, "w": 75},
    3: {"x": 155, "w": 90},
    4: {"x": 245, "w": 110}
  };
var playerWalkingYCoordinates = {
  "y": 285,
  "h": 100
};
var playerHitYCoordinates = {
  "y": 198,
  "h": 85
};
var lastUpdateHit = Date.now();
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
                y: windowHeight - floorOffset,
                floor: windowHeight - floorOffset,
                cropX: playerWalkingXCoordinates[1]["x"],
                cropW: playerWalkingXCoordinates[1]["w"],
                cropY: playerWalkingYCoordinates["y"],
                cropH: playerWalkingYCoordinates["h"],
                playerXScale: 1,
                windowWidth: windowWidth,
                windowHeight: windowHeight,
                playerHit: false,
                indexWalk: 1,
                indexHit: 0
            };
        } else if (count == 1) {
            players[socketID] = {
                x: windowWidth,
                y: windowHeight - floorOffset,
                floor: windowHeight - floorOffset,
                cropX: playerWalkingXCoordinates[1]["x"],
                cropW: playerWalkingXCoordinates[1]["w"],
                cropY: playerWalkingYCoordinates["y"],
                cropH: playerWalkingYCoordinates["h"],
                playerXScale: -1,
                windowWidth: windowWidth,
                windowHeight: windowHeight,
                playerHit: false,
                indexWalk: 1,
                indexHit: 0
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

        let now = Date.now();
        let diff = now - lastUpdateHit;
        if (diff > 100) {
            player.indexHit++;
            if (player.indexHit >= Object.keys(playerHitXCoordinates).length + 1) {
                player.indexHit = 0;
                player.playerHit = false;
            }
            lastUpdateHit = now;
        }

        if (data.jump) {
            if (player.y >= player.floor) {
                player.y -= jumpHeight;
            }
        }
        if (data.hit) {
            player.playerHit = true;
        }
        if (data.left) {
            now = Date.now();
            diff = now - lastUpdateSprite;
            if (diff > 100) {
                player.indexWalk--;
                if (player.indexWalk <= 1) {
                    player.indexWalk = Object.keys(playerWalkingXCoordinates).length;
                }
                lastUpdateSprite = now;
            }
            player.x -= player.cropW;
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
            now = Date.now();
            diff = now - lastUpdateSprite;
            if (diff > 100) {
                player.indexWalk++;
                if (player.indexWalk >= Object.keys(playerWalkingXCoordinates).length + 1) {
                    player.indexWalk = 1;
                }
                lastUpdateSprite = now;
            }
            player.x -= player.cropW;
            player.x += player.cropW;
            if (player.x < player.windowWidth) {
                player.x += speed;
            }
        }
        if (data.down) {
            //player.y += speed;
        }
        updatePlayerCropCoordinates(player);
    },
    land_players: function() {
        for(var key in players) {
            let player = players[key];
            if (player.y >= player.floor) {
                player.y = player.floor;
            } else if (player.y < player.floor) {
                player.y += 10;
            }
        }
    }
}
function updatePlayerCropCoordinates(player) {
    if (player.playerHit && player.indexHit > 0) {
        player.cropX = playerHitXCoordinates[player.indexHit]["x"];
        player.cropW = playerHitXCoordinates[player.indexHit]["w"];
        player.cropY = playerHitYCoordinates["y"];
        player.cropH = playerHitYCoordinates["h"];
    } else if (player.indexWalk > 0) {
        player.cropX = playerWalkingXCoordinates[player.indexWalk]["x"];
        player.cropW = playerWalkingXCoordinates[player.indexWalk]["w"];
        player.cropY = playerWalkingYCoordinates["y"];
        player.cropH = playerWalkingYCoordinates["h"];
    }
}