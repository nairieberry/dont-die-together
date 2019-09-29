import * as MainConfig from './config';
import gameConfig from './logic/config';
const playerRifle = require('../../style/images/bk_player_assets/player_chaingun.png');
const playerShotgun = require('../../style/images/bk_player_assets/player_pumpgun_stand.png');
const playerHandgun = require('../../style/images/bk_player_assets/player_9mmhandgun.png');
const zombieSprite = require('../../style/images/zombiebasic.png')


class Display {
    constructor(ctx) {
        this.ctx = ctx;
        this.mode = process.env.NODE_ENV;
    }

    clearScreen(){
        this.ctx.save();
        this.ctx.fillStyle = MainConfig.canvasStyle.backgroundColor;
        this.ctx.fillRect(0, 0, MainConfig.screenWidth, MainConfig.screenHeight);
    };

    draw(gameState, dt, playerName, collectedInputs) {
        this.clearScreen();
        // this.displayStats(gameState, playerName, collectedInputs);
        this.displayPlayers(gameState, collectedInputs);
        this.displayEnemies(gameState);
        this.displayBullets(gameState);
        this.displayItems(gameState);
        if (this.mode === 'development') {
            this.displayFPS(dt);
        }
    }

    // displayStats(gameState, playerName, collectedInputs) {
    //     const stats = gameState.players[playerName];
    //     this.ctx.strokeText(`Health: ${stats.health}`, 20, 30);
    //     this.ctx.strokeText(`Weapon: ${stats.weapon}`, 20, 60);
    //     this.ctx.strokeText(`Ammo: ${stats.ammo}`, 20, 90);
    //     this.ctx.strokeText(`angle: ${(this.calcRotation(collectedInputs, playerName) * 180 / Math.PI)}`, 20, 100);
    // }

    displayFPS(dt) {
        let fps = (1/dt).toFixed(1);   
        this.ctx.strokeText(`FPS: ${fps}`, 20, 20);
    }

    displayBullet(bullet) {
        this.ctx.save();
        this.ctx.translate(bullet.pos.x, bullet.pos.y);
        this.ctx.strokeStyle = '#4a200d';
        this.ctx.fillStyle = '#4a200d';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, gameConfig.sizes.bullets, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
    }

    displayBullets(gameState) {
        let bullets = Object.values(gameState.bullets);
        for (let i = 0; i < bullets.length; i++) {
            this.displayBullet(bullets[i], this.ctx);
        }
    }

    displayEnemies(gameState) {
        let enemies = Object.values(gameState.enemies);
        for (let i = 0; i < enemies.length; i++) {
            this.displayEnemy(enemies[i]);
        }
    }

    displayItem(item) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = "6";
        this.ctx.strokeStyle = "red";
        this.ctx.rect(item.pos.x - 2.5, item.pos.y - 2.5, 5, 5)
        this.ctx.stroke();
        this.ctx.restore();
    }

    displayItems(gameState) {
        const items = Object.values(gameState.items);
        for (let i = 0; i < items.length; i++) {
            this.displayItem(items[i]);
        }
    }

    displayPlayers(gameState, collectedInputs) {
        let players = Object.values(gameState.players);
        let playerNames = Object.keys(gameState.players);
        for (let i = 0; i < players.length; i++) {
            this.displayPlayer(players[i]);
        }
    }
    
    displayPlayer (player, playerName, collectedInputs) {
        this.ctx.save();

        // this.ctx.fillFont = 'bold 10px serif';
        // this.ctx.strokeText(`Health: ${player.health}`, player.pos.x - 10, player.pos.y - 32);
        // this.ctx.strokeText(`Gun: ${player.weapon}`, player.pos.x - 10, player.pos.y - 22);
        // this.ctx.strokeText(`Ammo: ${player.ammo}`, player.pos.x - 10, player.pos.y - 12);
        let angle = player.angle;

        const img = new Image();
        switch (player.weapon) {
            case 'pistol':
                img.src = playerHandgun;
                this.drawPlayerImage(img, player.pos.x, player.pos.y, 30, 32, 1.2, angle);
                break;
            case 'shotgun':
                img.src = playerShotgun;
                this.drawPlayerImage(img, player.pos.x, player.pos.y, 38, 28, 1.2, angle);
                break;
            case 'rifle':
                img.src = playerRifle;
                this.drawPlayerImage(img, player.pos.x, player.pos.y, 17, 17, 1.2, angle);
                break        
            default:
                img.src = playerHandgun;
                break;
        }

        this.ctx.restore();

        // this.ctx.strokeStyle = '#234c70';
        // this.ctx.fillStyle = '#234c70';
        // this.ctx.lineWidth = 2;
        // this.ctx.beginPath();
        // this.ctx.arc(player.pos.x, player.pos.y, gameConfig.sizes.player, 0, 2 * Math.PI);
  
        // this.ctx.stroke();
        // this.ctx.restore();
    }

    // https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
    drawPlayerImage(image, x, y, cx, cy, scale, rotation){
        this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -cx, -cy);
    }

    drawEnemyImage(image, sx, sy, sWidth, sHeight, x, y, dx, dy, scale, rotation, dWidth, dHeight){
        this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, sx, sy, sWidth, sHeight, -dx, -dy, dWidth, dHeight);
    } 
    
    displayEnemy(enemy) {
        this.ctx.save();

        const img = new Image();
        img.src = zombieSprite;
        let angle = enemy.angle;

        this.drawEnemyImage(img, 40, 40, 50, 50, enemy.pos.x, enemy.pos.y, 27, 15, 0.8, angle + Math.PI/2, 50, 50);
        this.ctx.restore();
        // this.ctx.save();

    
        // this.ctx.fillFont = 'bold 10px serif';
        // this.ctx.strokeText(`Health: ${enemy.health}`, enemy.pos.x - 10, enemy.pos.y-15);
    
        // this.ctx.translate(enemy.pos.x, enemy.pos.y);
        // this.ctx.strokeStyle = '#215910';
      
        // this.ctx.lineWidth = 2;
        // this.ctx.beginPath();
        // this.ctx.arc(0, 0, gameConfig.sizes.zombie, 0, 2 * Math.PI);
      
        // this.ctx.stroke();
        // this.ctx.restore();
    }
}

export default Display;