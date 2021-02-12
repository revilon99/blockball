class Scoreboard {
    constructor(x, y, height, width, startingValue) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.val = startingValue;
        
        this.addPoint = function() {
            this.val++;
        };
        this.render = function() {
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText('Score: ' + this.val.toString(), this.x + 10, this.y + 30);
        }
    }
}