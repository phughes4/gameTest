const EventEmitter = require('eventemitter3');
const Utils = require('../common/Utils');

/**
 * This class handles keyboard device controls
 */
class MouseControls{

    constructor(renderer){
        Object.assign(this, EventEmitter.prototype);
        this.renderer = renderer;

        this.setupListeners();

        let onRequestAnimationFrame = () => {
            this.getPlayerCoords();
            window.requestAnimationFrame(onRequestAnimationFrame);
        };

        onRequestAnimationFrame();
        //console.log("IN MOUSE CONSTRUCTOR");

        var cursorX;
        var cursorY;
        var playerX;
        var playerY;
    }

    setupListeners(){
        document.addEventListener('mousemove', (e) => { this.onMouseMove(e);});
        //console.log("IN MOUSE LISTENER");
    }

    onMouseMove(e) {
        e = e || window.event;

        //  console.log("MOUSE MOVED");

        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
        e.preventDefault();
    }

    getPlayerCoords(){
        let playerShip = this.renderer.playerShip;
        if (!playerShip) return;

        let playerShipScreenCoords = this.renderer.gameCoordsToScreen(playerShip);

        this.playerX = playerShipScreenCoords.x;
        this.playerY = playerShipScreenCoords.y;
    }
}

module.exports = MouseControls;
