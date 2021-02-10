/*
canvas.js
blockball (c) 2021
All Rights Reserved
*/

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var mouse = {};
var width, height;

function init_canvas(){
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      height = rect.height * dpr;
      ctx.scale(dpr, dpr);
}

window.onload = function(){
    init_canvas();
	init();
    requestAnimationFrame(tick);
}

window.onresize = init_canvas;

const randomColour = function(){
  return 'rgb(' + (128 + Math.floor(Math.random()*127)) + ", " + (128 + Math.floor(Math.random()*127)) + ", " + (128 + Math.floor(Math.random()*127)) + ")";
}

canvas.addEventListener('mousemove', function(e){
	mouse = getMousePos(canvas, e);
}, false);
canvas.addEventListener('touchmove', function(e){
	mouse = getMousePos(canvas, e);
}, false);

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect(); // abs. size of element
	return {
		x: ((evt.clientX||evt.touches[0].clientX) - rect.left),   // scale mouse coordinates after they have
		y: ((evt.clientY||evt.touches[0].clientY)  - rect.top)     // been adjusted to be relative to element
	}
}