/*
ball.js
blockball (c) 2021
All Rights Reserved
*/
const MAX_SPEED = 5;

class Ball{
	constructor(x, y){
		this.x = shooter.x;
		this.y = shooter.y;
		this.vel = Vec2D.sub(mouse, shooter);
		this.vel.normalize()
		this.vel.scale(MAX_SPEED);
		this.radius = BallParam.rad;
		this.velR = 0; //dw about this
		
		this.earliestCollisionResponse = new Collision();
		
		this.temp = new Collision();
		this.me = new Collision();
		this.other = new Collision();
		
		this.tick = function(time){
			if(this.vel.x >  MAX_SPEED) this.vel.x =  MAX_SPEED;
			if(this.vel.x < -MAX_SPEED) this.vel.x = -MAX_SPEED;
			if(this.vel.y >  MAX_SPEED) this.vel.y =  MAX_SPEED;
			if(this.vel.y < -MAX_SPEED) this.vel.y = -MAX_SPEED;

			if(this.earliestCollisionResponse.t <= time){
				this.x = this.earliestCollisionResponse.getNewX(this.x, this.vel.x);
				this.y = this.earliestCollisionResponse.getNewY(this.y, this.vel.y);
				this.vel.x = this.earliestCollisionResponse.nVelX;
				this.vel.y = this.earliestCollisionResponse.nVelY;
			}else{
				this.x += this.vel.x * time;
				this.y += this.vel.y * time;
			}

			this.earliestCollisionResponse.reset();
		}
		
		this.render = function(){
			ctx.beginPath();
			ctx.arc(this.x, this.y, BallParam.rad, 0, 2*Math.PI, false);
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.closePath();
		}
		
		this.borderIntersect = function(timeLimit){
			CollisionPhysics.pointIntersectsRectangleOuter(
				this,
				{x1: 0, y1: 0, x2: canvas.clientWidth, y2: canvas.clientHeight},
				timeLimit, this.temp);
			if(this.temp.t < this.earliestCollisionResponse.t) this.earliestCollisionResponse.copy(this.temp);
		}
		
		this.blockIntersect = function(block, timeLimit){
			CollisionPhysics.pointIntersectsCube(this, block, timeLimit, this.temp);
			if(this.temp.t < this.earliestCollisionResponse.t) this.earliestCollisionResponse.copy(this.temp);
		}
	}
}