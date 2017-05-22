'use strict';

const GameEngine = require('lance-gg').GameEngine;
const Missile= require('./Missile');
const Ship = require('./Ship');
const TwoVector = require('lance-gg').serialize.TwoVector;
const Timer = require('./Timer');

//ADDED CODE
//const SpaaaceRenderer = require('../client/SpaaaceRenderer');
//const Mouse = require('./Mouse');
//END ADDED CODE

class SpaaaceGameEngine extends GameEngine {

    start() {
        let that = this;
        super.start();

        this.timer = new Timer();
        this.timer.play();
        this.on('server__postStep', ()=>{
            this.timer.tick();
        });

        this.worldSettings = {
            worldWrap: true,
            width: 3000,
            height: 3000
        };

        this.on('collisionStart', function(e) {
            let collisionObjects = Object.keys(e).map(k => e[k]);
            let ship = collisionObjects.find(o => o.class === Ship);
            let missile = collisionObjects.find(o => o.class === Missile);

            if (!ship || !missile)
                return;

            if (missile.ownerId !== ship.id) {
                that.destroyMissile(missile.id);
                that.trace.info(`missile by ship=${missile.ownerId} hit ship=${ship.id}`);
                that.emit('missileHit', { missile, ship });
            }
        });

        this.on('postStep', this.reduceVisibleThrust.bind(this));
    };

    reduceVisibleThrust(postStepEv) {
        if (postStepEv.isReenact)
            return;

        for (let objId of Object.keys(this.world.objects)) {
            let o = this.world.objects[objId];
            if (Number.isInteger(o.showThrust) && o.showThrust >= 1)
                o.showThrust--;
        }
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player ship tied to the player socket
        let playerShip;

        //ADDED CODE
        // let mouse;

        // for (let objId in this.world.objects) {
        //     let o = this.world.objects[objId];
        //     if (o.playerId == playerId && o.class == Mouse) {
        //         mouse = o;
        //         break;
        //     }
        // }
        //END ADDED CODE

        for (let objId in this.world.objects) {
            let o = this.world.objects[objId];
            if (o.playerId == playerId && o.class == Ship) {
                playerShip = o;
                break;
            }
        }

        if (playerShip) {
            if (inputData.input == 'up') {
                playerShip.isAccelerating = true;

                //ADDED CODE
                playerShip.angle = 270;
                //END ADDED CODE

                playerShip.showThrust = 5; // show thrust for next steps.
            } else if (inputData.input == 'right') {
                //playerShip.isRotatingRight = true;

                //ADDED CODE
                playerShip.isAccelerating = true;
                playerShip.angle = 0;
                playerShip.showThrust = 5;
                //END ADDED CODE
            } else if (inputData.input == 'left') {
                //playerShip.isRotatingLeft = true;

                //ADDED CODE
                playerShip.isAccelerating = true;
                playerShip.angle = 180;
                playerShip.showThrust = 5;
                //END ADDED CODE
            } else if (inputData.input == 'down') {
                //playerShip.isRotatingLeft = true;

                //ADDED CODE
                playerShip.isAccelerating = true;
                playerShip.angle = 90;
                playerShip.showThrust = 5;
                //END ADDED CODE
            } else if (inputData.input == 'space') {
                this.makeMissile(playerShip, inputData.messageIndex);
                this.emit('fireMissile');
            } else if(inputData.input == 'mouseMove'){ //<-- ADDED CODE

                let shipScreenPosX = inputData.options.playerX;
                let shipScreenPosY = inputData.options.playerY;

                let deltaX = shipScreenPosX - inputData.options.cursorX;
                let deltaY = shipScreenPosY - inputData.options.cursorY;

                let newAngle = (Math.atan(deltaY/deltaX) * (180/Math.PI));
                if(inputData.options.cursorX < shipScreenPosX && inputData.options.cursorY < shipScreenPosY){
                    playerShip.angle = newAngle + 180;
                } else if(inputData.options.cursorX < shipScreenPosX && inputData.options.cursorY > shipScreenPosY){
                    playerShip.angle = newAngle + 180;
                } else if(inputData.options.cursorX > shipScreenPosX && inputData.options.cursorY < shipScreenPosY){
                    playerShip.angle = newAngle;
                } else{
                    playerShip.angle = newAngle;
                }

                console.log("X: " + shipScreenPosX + " Y: " + shipScreenPosY);
                //console.log("deltaX: " + deltaX + " deltaY " + deltaY);
                //console.log("angle: " + playerShip.angle);

                playerShip.showThrust = 5;
            }
            //END ADDED CODE
        }
    };

    // Makes a new ship, places it randomly and adds it to the game world
    makeShip(playerId) {
        let newShipX = Math.floor(Math.random()*(this.worldSettings.width-200)) + 200;
        let newShipY = Math.floor(Math.random()*(this.worldSettings.height-200)) + 200;

        let ship = new Ship(++this.world.idCount, this, new TwoVector(newShipX, newShipY));
        ship.playerId = playerId;
        this.addObjectToWorld(ship);
        console.log(`ship added: ${ship.toString()}`);

        return ship;
    };

    //ADDED CODE
    // makeMouse(playerId) {
    //     let mouse = new Mouse(playerId);
    //     mouse.playerId = playerId;
    //     this.addObjectToWorld(mouse);
    // }
    //END ADDED CODE

    makeMissile(playerShip, inputId) {
        let missile = new Missile(++this.world.idCount);
        missile.position.copy(playerShip.position);
        missile.velocity.copy(playerShip.velocity);
        missile.angle = playerShip.angle;
        missile.playerId = playerShip.playerId;
        missile.ownerId = playerShip.id;
        missile.inputId = inputId;
        missile.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
        missile.velocity.y += Math.sin(missile.angle * (Math.PI / 180)) * 10;

        this.trace.trace(`missile[${missile.id}] created vel=${missile.velocity}`);

        let obj = this.addObjectToWorld(missile);
        if (obj)
            this.timer.add(40, this.destroyMissile, this, [obj.id]);

        return missile;
    }

    // destroy the missile if it still exists
    destroyMissile(missileId) {
        if (this.world.objects[missileId]) {
            this.trace.trace(`missile[${missileId}] destroyed`);
            this.removeObjectFromWorld(missileId);
        }
    }
}

module.exports = SpaaaceGameEngine;
