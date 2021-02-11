/*
blockball.js
blockball (c) 2021
All Rights Reserved
*/

var balls  = [];
var blocks = [];

var t = 0;
var d = new Date();
var previousTime = d.getTime();

var shooter = {
	size: 25,
	color: '#00ff00',
	crosshairRad: 5,
	crosshairDist: 200
}

var crosshair = new Vec();

var BallParam = {
	initVel: 300,
	rad: 8,
	num: 30,
	spawnTime: 100
}

var BlockParam = {
	width: 50,
	height: 50,
	offset: 5,
	maxHealth: 100
}

function init(){
	//init shooter
	shooter.x = canvas.clientWidth / 2;
	shooter.y = canvas.clientHeight / 10;
	
	//init blocks
	var numColumns = Math.ceil(canvas.clientWidth / (BlockParam.width + BlockParam.offset));
	BlockParam.width = canvas.clientWidth / numColumns - BlockParam.offset;
	BlockParam.height = BlockParam.width;
	initBlocks(4, numColumns);
}

function tick(){
	requestAnimationFrame(tick);
	d = new Date();
	var newTime = d.getTime();
	var delta = newTime - previousTime;
	t += delta;
	previousTime = newTime;
		
	var crosshairDiff = Vec2D.sub(mouse, shooter);
	if(crosshairDiff.mag() > shooter.crosshairDist*shooter.crosshairDist){
		crosshairDiff.normalize();
		crosshairDiff.scale(shooter.crosshairDist);
		crosshair = Vec2D.add(shooter, crosshairDiff);
	}else{
		crosshair.x = mouse.x;
		crosshair.y = mouse.y;
	}
	
	for(var block of blocks) {
		if(block.health < 1){
			blocks.pop(block);
		}
	}
	for(var ball of balls) ball.tick(delta/1000);
	
	render();
}

function render(){
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	
	//render shooter
	ctx.fillStyle = shooter.color;
	ctx.fillRect(shooter.x - shooter.size/2, shooter.y - shooter.size/2, shooter.size, shooter.size);
	
	//render crosshair
	ctx.beginPath();
	ctx.arc(crosshair.x, crosshair.y, shooter.crosshairRad, 0, 2*Math.PI, false);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.closePath();
	
	for(var block of blocks) block.render();
	for(var ball of balls) ball.render();
}

function initBlocks(rows, columns){
	for(var r = 0; r < rows; r++){
		for(var c = 0; c < columns; c++){
			blocks.push(new Block(BlockParam.offset + c*(BlockParam.width + BlockParam.offset), canvas.clientHeight - (BlockParam.offset + (r+1)*(BlockParam.height + BlockParam.offset)), BlockParam.maxHealth - 10*r));
		}
	}
}

canvas.addEventListener('click', function(){
	if(balls.length >= BallParam.num) return;
	var spawnBall = setInterval(function(){
		balls.push(new Ball());
		if(balls.length >= BallParam.num) clearInterval(spawnBall);
	}, BallParam.spawnTime);
}, false);

var Ball = function(){
	this.x = shooter.x;
	this.y = shooter.y;
	this.vel = Vec2D.sub(mouse, shooter);
	this.vel.normalize()
	this.vel.scale(BallParam.initVel);
	
	this.tick = function(delta){
		this.x += this.vel.x*delta;
		this.y += this.vel.y*delta;
	}
	this.render = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, BallParam.rad, 0, 2*Math.PI, false);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();
	}
}

function getColor(num){
	return rgb(2*num*255, 2*(1 - num)*255, 0);
}

function rgb(r, g, b){
	return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}