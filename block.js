class Block {
    constructor(x, y, health) {
        this.x = x;
        this.y = y;
        this.health = health;

        this.hit = function () {
            this.health--;
            if (this.health < 1) removeBlock(this);
        };

        this.render = function () {
            ctx.fillStyle = getColor(this.health / BlockParam.maxHealth);
            if (this == blocks[0]) {
                null;
            }
            ctx.fillRect(this.x, this.y, BlockParam.width, BlockParam.height);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText(this.health.toString(), this.x + 10, this.y + 30);

        };
    }
}