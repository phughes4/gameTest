// 'use strict';

// const Serializer = require('lance-gg').serialize.Serializer;
// const DynamicObject= require('lance-gg').serialize.DynamicObject;
// const EventEmitter = require('eventemitter3');
// const Utils = require('../common/Utils');

// class Mouse extends DynamicObject {

//     static get netScheme() {
//         return Object.assign({
//             cursorX: { type: Serializer.TYPES.INT32 },
//             cursorY: { type: Serializer.TYPES.INT32 },
//             ownerId: { type: Serializer.TYPES.INT32 }
//         }, super.netScheme);
//     }

//     toString() {
//         return `Mouse::${super.toString()}`;
//     }

//     syncTo(other) {
//         super.syncTo(other);
//         this.cursorX = other.cursorX;
//         this.cursorY = other.cursorY;
//         this.ownerId = other.ownerId;
//     }

//     constructor(id) {
//         super(id);
//         Object.assign(this, EventEmitter.prototype);
//         this.class = Mouse;

//         this.setupListeners();
//     };

//     setupListeners(){
//         document.addEventListener('onmousemove', (e) => { this.onMouseMove(e, true);});
//     }

//     onMouseMove(e, hasMoved) {
//         e = e || window.event;

//         this.cursorX = e.pageX;
//         this.cursorY = e.pageY;
//         e.preventDefault();
//     }
// }

// module.exports = Mouse;
