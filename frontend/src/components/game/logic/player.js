import gameConfig from './config';
import {
    willCollideWithEnemy,
    willCollideWithObstacle,
    willLeavePlayArea
} from './model_helper';
import {
    findDistance,
    vectorMag,
    calcRotation
} from './vector_util';
import { playHeartBeat } from './sounds/soundsUtil';

export const reSpawn = (player, gameState) => {
    let x = gameConfig.gameBounds.x / 2;
    let y = gameConfig.gameBounds.y / 2;
    let ghostPlayer = {
        pos: {
            x: 0,
            y: 0
        }
    };
    while (willCollideWithEnemy(ghostPlayer, [x, y], gameState, gameConfig.sizes) ||
            willCollideWithObstacle(ghostPlayer, [x, y], gameState, gameConfig.sizes.player)
            ) {
        x = gameConfig.gameBounds.x / 2 - 150 + (300 * Math.random());
        y = gameConfig.gameBounds.y / 2 - 150 + (300 * Math.random());
    }
    player.status = 'alive';
    player.health = 100;
    player.killCount = 0;
    player.timeAlive = 0;
    player.pos = {
        x: x,
        y: y
    };
    player.items = {
        guns: {
            pistol: true,
            shotgun: false,
            rifle: false,
        },
        gunAmmo: {
            pistol: 50,
            shotgun: 0,
            rifle: 0,
        }        
    };
    player.ammo = 50;
    player.weapon = 'pistol';
}

export const movePlayer = (player, playerInputs, gameState, sizes, dt, dist) => {
    //// BEGIN ACC
    let inputVector = [0, 0];
    if (playerInputs.up) {
        inputVector[1] -= 1;
    }
    if (playerInputs.down) {
        inputVector[1] += 1;
    }
    if (playerInputs.right) {
        inputVector[0] += 1;
    }
    if (playerInputs.left) {
        inputVector[0] -= 1;
    }
    if (inputVector[0] !== 0 || inputVector[1] !== 0) {
        let unitDir = [
            inputVector[0] / vectorMag(inputVector),
            inputVector[1] / vectorMag(inputVector)
        ];
        let accVector = [
            unitDir[0] * gameConfig.acceleration.player,
            unitDir[1] * gameConfig.acceleration.player
        ];
        let accAmt = [
            accVector[0] * dt,
            accVector[1] * dt
        ];
        player.velocity.x += accAmt[0];
        player.velocity.y += accAmt[1];
        let playerSpeed = vectorMag([player.velocity.x, player.velocity.y]);
        if (playerSpeed > gameConfig.speeds.player){
            player.velocity.x *= gameConfig.speeds.player / playerSpeed;
            player.velocity.y *= gameConfig.speeds.player / playerSpeed;
        }
        let moveVector = [player.velocity.x * dt, player.velocity.y * dt];
        
        if (!willCollideWithEnemy(player, moveVector, gameState, sizes) &&
            !willCollideWithObstacle(player, moveVector, gameState, sizes.player) &&
            !willLeavePlayArea(player, moveVector, sizes.player)) {
            
            player.pos.x += moveVector[0];
            player.pos.y += moveVector[1];
        }
        else if (player.status === 'dead'){
            player.pos.x += moveVector[0];
            player.pos.y += moveVector[1];
        }
    }
    else {
        player.velocity.x = 0;
        player.velocity.y = 0;
    }

    if (!player.angle) {
        player.angle = 0;
    }
    player.angle = calcRotation([playerInputs.pointX, playerInputs.pointY]);
};

export const switchGuns = (player, playerInputs, times) => {
    if (playerInputs.cycleGun) {
        if (player.timeToSwitch === 0) {
            let availableGuns = Object.keys(player.items.guns).filter( (key) => {
                return player.items.guns[key];
            });
            let newGunIdx = (availableGuns.indexOf(player.weapon) + 1) % availableGuns.length;
            player.weapon = availableGuns[newGunIdx];
            player.ammo = player.items.gunAmmo[player.weapon];
            player.timeToSwitch = times.switchGuns;
        }
    }
};

export const receiveItem = (player, item) => {
    if (item.type === 'ammo') {
        player.items.gunAmmo[item.gun] += item.amount;
        if (player.weapon === item.gun) {
            player.ammo += item.amount;
        }
    }
    if (item.type === 'gun') {
        player.items.guns[item.gun] = true;
        player.items.gunAmmo[item.gun] += 5;
        if (player.weapon === item.gun) player.ammo += 5;
    }
    if (item.type === 'medPack') {
        player.health += item.amount;
        if (player.health > 150) {
            player.health = 150;
        }
        if (player.health > 50) {
            playHeartBeat(-1);
        }
    }
}

export const pickUpItems = (player, gameState, sizes) => {
    Object.keys(gameState.items).forEach( (itemId) => {
        let item = gameState.items[itemId];
        let itemPos = [item.pos.x, item.pos.y];
        let playerPos = [player.pos.x, player.pos.y];
        let dist = findDistance(itemPos, playerPos);
        if (dist < sizes.player + sizes.item && player.status !== 'dead') {
            receiveItem(player, item);
            delete gameState.items[itemId];
            player.deletedItemId = itemId;
        }
    });
}

export const playerCanFire = (player) => {
    return (player.timeToFire === 0 && player.ammo > 0);
}

