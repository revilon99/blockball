/*
blockball.js
blockball (c) 2021
All Rights Reserved
*/

var balls  = [];
var blocks = [];

let running = true;

const EPSILON_TIME = 0.0001;

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
	num: 60,
	spawnTime: 100
}

var BlockParam = {
	width: 50,
	height: 50,
	offset: 5,
	maxHealth: 60
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
	let timeLeft = 1;
	
	if(running) {do{
		var tMin = timeLeft;
		
		//Ball-Wall Collision
        for(let b of balls){
            b.borderIntersect(timeLeft);
            if(b.earliestCollisionResponse.t < tMin)
                tMin = b.earliestCollisionResponse.t;
        }
		
		var hitBlock = null;
		//Ball-Block Collision
		for(let b of balls){
			for(let block of blocks){
				b.blockIntersect(block, timeLeft);
				if(b.earliestCollisionResponse.t < tMin){
					tMin = b.earliestCollisionResponse.t;
					hitBlock = block;
				}
			}
		}
		
		for(let ball of balls) ball.tick(tMin);
		if(hitBlock != null) hitBlock.hit();
		timeLeft -= tMin;
	}while(timeLeft > EPSILON_TIME);}
		
	var crosshairDiff = Vec2D.sub(mouse, shooter);
	if(crosshairDiff.mag() > shooter.crosshairDist*shooter.crosshairDist){
		crosshairDiff.normalize();
		crosshairDiff.scale(shooter.crosshairDist);
		crosshair = Vec2D.add(shooter, crosshairDiff);
	}else{
		crosshair.x = mouse.x;
		crosshair.y = mouse.y;
	}
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

function removeBlock(block){
	let index = blocks.indexOf(block);
	blocks.splice(index, 1);
}

canvas.addEventListener('click', function(){
	if(balls.length >= BallParam.num) return;
	var spawnBall = setInterval(function(){
		balls.push(new Ball());
		if(balls.length >= BallParam.num) clearInterval(spawnBall);
	}, BallParam.spawnTime);
}, false);

function getColor(num){
	return rgb(2*num*255, 2*(1 - num)*255, 0);
}

function rgb(r, g, b){
	return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}