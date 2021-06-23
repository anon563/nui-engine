class Bullet extends Actor {

    speed = 8;
    size = new Vector2(4, 4);

    constructor(pos, n) {
        super();

        this.pos = pos;
        this.vel = n.times(this.speed);
    }
    
    update = (game, activity) => {
        const wallTile = activity.colliderTiles.find(tile => CollisionBox2.collidesWith(tile, this));
        const enemyHit = activity.actors.find(actor => CollisionBox2.collidesWith(this, actor) && actor.name === 'naan');

        if (enemyHit) enemyHit.hit();
        
        if (Math.abs(activity.player.pos.x - this.pos.x) > game.width) this.isDone = true;
        if (this.isDone) {
            return;
        }
        this.isDone = wallTile || enemyHit;
        this.action = this.isDone ? 'done' : 'idle';
        if (this.isDone) this.vel = new Vector2(0, 0);

        const newPos = this.pos.plus(this.vel);
        const obstacles = CollisionBox2.intersectingCollisionBoxes({ pos:newPos, size:this.size }, activity.colliderTiles);
        obstacles.forEach(obstacle => {
            const xCollision = CollisionBox2.intersects({ pos:this.pos.plus(new Vector2(this.vel.x, 0)), size:this.size }, obstacle);
            const yCollision = CollisionBox2.intersects({ pos:this.pos.plus(new Vector2(0, this.vel.y)), size:this.size }, obstacle);
            if (xCollision) {
                newPos.x += (this.vel.x > 0 ? -(newPos.x + this.size.x - obstacle.pos.x) : obstacle.pos.x + obstacle.size.x - newPos.x) % obstacle.size.x;
                this.vel.x = 0;
            }
            if (yCollision) {
                newPos.y += (this.vel.y > 0 ? -(newPos.y + this.size.y - obstacle.pos.y) : obstacle.pos.y + obstacle.size.y - newPos.y) % obstacle.size.y;
                this.vel.y = 0;
            }
        });
        this.pos = newPos;

        this.frameCount++;
    }
    
    display = (cx, assets) => {
        cx.drawImage(assets.images['bullet'], this.isDone ? 8 : 0, 0, 8, 8, this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, 8, 8);
        if (this.frameCount === 1) {
            cx.drawImage(assets.images['bullet'], 16, 0, 8, 8, this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2, 8, 8);
        }
    }
}