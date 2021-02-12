/*
CollisionPhysics.js
Oliver Cass (c) 2020
All Rights Reserved
*/

const T_EPSILON = 0.00000005;

class Collision {
	constructor() {
		this.reset = function () {
			this.t = Infinity;
		};

		this.copy = function (col) {
			this.t = col.t;
			this.nVelX = col.nVelX;
			this.nVelY = col.nVelY;
		};

		this.getNewX = function (curX, velX) {
			if (this.t > T_EPSILON)
				return curX + velX * (this.t - T_EPSILON);
			else
				return curX;
		};
		this.getNewY = function (curY, velY) {
			if (this.t > T_EPSILON)
				return curY + velY * (this.t - T_EPSILON);
			else
				return curY;
		};

		this.getImpactX = function (curX, speedX) {
			return curX + speedX * this.t;
		};
		this.getImpactY = function (curY, speedY) {
			return curY + speedY * this.t;
		};

		this.reset();
	}
}

var CollisionPhysics = new (function(){
	this.temp = new Collision();

	this.pointIntersectsRectangleOuter = function(A, rect, timeLimit, response){
		response.reset();

		//Right Border
		this.pointIntersectsLineVertical(A, rect.x2, timeLimit, this.temp, 'right');
		if(this.temp.t < response.t) response.copy(this.temp);

		//Left Border
		this.pointIntersectsLineVertical(A, rect.x1, timeLimit, this.temp, 'left');
		if(this.temp.t < response.t) response.copy(this.temp);

		//Top Border
		this.pointIntersectsLineHorizontal(A, rect.y1, timeLimit, this.temp, 'top');
		if(this.temp.t < response.t) response.copy(this.temp);

		//Bottom Border
		this.pointIntersectsLineHorizontal(A, rect.y2, timeLimit, this.temp, 'bottom');
		if(this.temp.t < response.t) response.copy(this.temp);
	}

	this.pointIntersectsLineVertical = function(A, x, timeLimit, response, side){
		response.reset();

		if(A.vel.x == 0 && (A.velR||0) == 0) return;

		var distance;
		if(side == 'left'){
			distance = x - A.x + A.radius;

			if(A.x - A.radius < x) return;

		}else if(side == 'right'){
			distance = x - A.x - A.radius;

			if(A.x + A.radius > x) return;
		}else{
			if(x > A.x) distance = x - A.x - A.radius;
			else distance = x - A.x + A.radius;
		}


		var t = distance / (A.vel.x + A.velR);
		if(t > 0 && t <= timeLimit){
            response.t = t;
            response.nVelX = -A.vel.x;
            response.nVelY = A.vel.y;
        }
	}

	this.pointIntersectsLineHorizontal = function(A, y, timeLimit, response, side){
		response.reset();

		if(A.vel.y == 0 && (A.velR||0) == 0) return;

		var distance;

		if(side == 'top'){
			distance = y - A.y + A.radius;

			if(A.y - A.radius < y) return;
		}else if(side == 'bottom'){
			distance = y - A.y - A.radius;

			if(A.y + A.radius > y) return;
		}else{
			if(y > A.y) distance = y - A.y - A.radius;
			else distance = y - A.y + A.radius;
		}

		var t = distance / (A.vel.y + A.velR);
		if(t > 0 && t <= timeLimit){
            response.t = t;
            response.nVelX = A.vel.x;
            response.nVelY = -A.vel.y;
        }
	}

	this.pointIntersectsCube = function(A, cube, timeLimit, response){
		response.reset();

		//Right of Cube
		this.pointIntersectsLineVerticalSegment(A, cube.x + BlockParam.width, cube.y, cube.y + BlockParam.height, timeLimit, this.temp, 'right');
		if(this.temp.t < response.t) response.copy(this.temp);

		//Left of Cube
		this.pointIntersectsLineVerticalSegment(A, cube.x, cube.y, cube.y + BlockParam.height, timeLimit, this.temp, 'left');
		if(this.temp.t < response.t) response.copy(this.temp);

		//Top of Cube
		this.pointIntersectsLineHorizontalSegment(A, cube.y, cube.x, cube.x + BlockParam.width, timeLimit, this.temp, 'top');
		if(this.temp.t < response.t) response.copy(this.temp);

		//Bottom Border
		this.pointIntersectsLineHorizontalSegment(A, cube.y + BlockParam.height, cube.x, cube.x + BlockParam.width, timeLimit, this.temp, 'bottom');
		if(this.temp.t < response.t) response.copy(this.temp);
	}

	this.pointIntersectsLineVerticalSegment = function(A, x, y1, y2, timeLimit, response, side){
		response.reset();

		if(A.vel.x == 0 && (A.velR||0) == 0) return;

		var distance;
		if(side == 'right'){
			distance = x - A.x + A.radius;

			if(A.x - A.radius < x) return;

		}else if(side == 'left'){
			distance = x - A.x - A.radius;

			if(A.x + A.radius > x) return;
		}else{
			if(x > A.x) distance = x - A.x - A.radius;
			else distance = x - A.x + A.radius;
		}


		var t = distance / (A.vel.x + A.velR);
		if(A.y + A.radius + t*A.vel.y < y1 || A.y - A.radius + t*A.vel.y > y2) return;
		if(t > 0 && t <= timeLimit){
            response.t = t;
            response.nVelX = -A.vel.x;
            response.nVelY = A.vel.y;
        }
	}

	this.pointIntersectsLineHorizontalSegment = function(A, y, x1, x2, timeLimit, response, side){
		response.reset();

		if(A.vel.y == 0 && (A.velR||0) == 0) return;

		var distance;

		//don't be confused by reversal in top to bottom
		if(side == 'bottom'){
			distance = y - A.y + A.radius;

			if(A.y - A.radius < y) return;
		}else if(side == 'top'){
			distance = y - A.y - A.radius;

			if(A.y + A.radius > y) return;
		}else{
			if(y > A.y) distance = y - A.y - A.radius;
			else distance = y - A.y + A.radius;
		}

		var t = distance / (A.vel.y + A.velR);
		if(A.x + A.radius + t*A.vel.x < x1 || A.x - A.radius + t*A.vel.x > x2) return;
		if(t > 0 && t <= timeLimit){
            response.t = t;
            response.nVelX = A.vel.x;
            response.nVelY = -A.vel.y;
        }
	}

	this.pointIntersectsMovingPoint = function(A, B, timeLimit, aResponse, bResponse){
		aResponse.reset();
		bResponse.reset();

		var t = this.pointIntersectsMovingPointDetection(A, B);

		if(t > 0 && t <= timeLimit){
			this.pointIntersectsMovingPointResponse(A, B, aResponse, bResponse, t);
		}
	}

	this.pointIntersectsMovingPointDetection = function(A, B){
		var x = A.x - B.x;
		var y = A.y - B.y;
		var r = A.radius + B.radius;
		var xdot = A.vel.x - B.vel.x;
		var ydot = A.vel.y - B.vel.y;
		var rdot = A.velR + B.velR;

		var xSq = x*x;
		var ySq = y*y;
		var xdotSq = xdot*xdot;
		var ydotSq = ydot*ydot;
		var rSq = r*r;
		var rdotSq = rdot*rdot;

		var discriminant = (x*xdot + y*ydot - r*rdot)*(x*xdot + y*ydot - r*rdot) - (xdotSq + ydotSq - rdotSq)*(xSq + ySq - rSq);
		if(discriminant < 0) return Infinity;

		var minusB = - (x*xdot + y*ydot - r*rdot);
		var denom = xdotSq + ydotSq - rdotSq;
		var rootDis = Math.sqrt(discriminant);

		var sol1 = (minusB + rootDis) / denom;
		var sol2 = (minusB - rootDis) / denom;

		if(sol1 > 0 && sol2 > 0) return Math.min(sol1, sol2);
        else if(sol1 > 0) return sol1;
        else if(sol2 > 0) return sol2;
        else return Infinity;
	}

	this.pointIntersectsMovingPointResponse = function(A, B, aResponse, bResponse, t){
		aResponse.t = t;
		bResponse.t = t;

		var aImpactX = aResponse.getImpactX(A.x, A.vel.x);
		var aImpactY = aResponse.getImpactY(A.y, A.vel.y);
		var bImpactX = bResponse.getImpactX(B.x, B.vel.x);
		var bImpactY = bResponse.getImpactY(B.y, B.vel.y);

		var lineAngle = Math.atan2(bImpactY - aImpactY, bImpactX - aImpactX);

		var result = this.rotate(A.vel.x, A.vel.y, lineAngle);
		var aSpeedP = result[0];
		var aSpeedN = result[1];

		result = this.rotate(B.vel.x, B.vel.y, lineAngle);
		var bSpeedP = result[0];
		var bSpeedN = result[1];

		//Collision possible only if aSpeedP - bSpeedP > 0
        //Needed if the two balls overlap in their initial positions
        //Do not declare collision, so that they continue their
        //Course of movement until they are separated
        if(aSpeedP - bSpeedP <= 0){
            aResponse.reset();
            bResponse.reset();
            return;
        }

		//Assume that mass is proportional to the cube of the radius
        var aMass = A.radius * A.radius * A.radius;
        var bMass = B.radius * B.radius * B.radius;
        var diffMass = aMass - bMass;
        var sumMass = aMass + bMass;

		var aSpeedPAfter, aSpeedNAfter, bSpeedPAfter, bSpeedNAfter;

        aSpeedPAfter = (diffMass*aSpeedP + 2*bMass*bSpeedP) / sumMass;
        bSpeedPAfter = (2*aMass*aSpeedP - diffMass*bSpeedP) / sumMass;

        aSpeedNAfter = aSpeedN;
        bSpeedNAfter = bSpeedN;

        result = this.rotate(aSpeedPAfter, aSpeedNAfter, -lineAngle);
        aResponse.nVelX = result[0];
        aResponse.nVelY = result[1];
        result = this.rotate(bSpeedPAfter, bSpeedNAfter, -lineAngle);
        bResponse.nVelX = result[0];
        bResponse.nVelY = result[1];
	}

	this.rotate = function(x, y, theta){
       var sinTheta = Math.sin(theta);
       var cosTheta = Math.cos(theta);
       return [
            x * cosTheta + y * sinTheta,
            -x * sinTheta + y * cosTheta
       ];
   }
})();
