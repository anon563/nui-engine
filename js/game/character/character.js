class Character extends Actor {

    vel = new Vector2(0, 0);
    walkSpeed = 0.375;
    aerialSpeed = 0.5;
    velLoss = new Vector2(0.75, 1);
    gravity = 0.25;

    frameCountNoInput = 0;

    canShoot = true;
    canJump = true;
    chargedShot = 0;

    hitAnim = 0;
    health = 4;

    constructor(keys, data, action, dir, pos) {
        super();
        this.keys = keys;

        this.name = data.name;
        this.actions = data.actions;

        this.dir = dir;
        this.size = new Vector2(this.actions[action].size.x, this.actions[action].size.y);
        this.pos = pos;
    }

    updateAction = () => {
        switch (this.name) {
            case 'flare':
                return !this.isGrounded ? (this.isWall ? (this.keys.down ? "wall_down" : (this.keys.up ? "wall_up" : "wall")) : (this.keys.down ? "jump_down" : (this.keys.up ? "jump_up" : "jump"))) : this.isWalking ? (this.keys.down ? "walk_down" : (this.keys.up ? "walk_up" : "walk")) : (this.name === 'flare' && this.frameCountNoInput > 120 ? "idle_look" : (this.keys.down ? "idle_down" : (this.keys.up ? "idle_up" : "idle")));
            case 'naan':
                return 'idle';
            default:
                return 'idle';
        }
    }

    hit = () => {
        this.hitAnim = 6;
        this.health--;
        if (!this.health) this.isDone = true;
    }
    
    update = (game, activity) => {
        if (!Object.entries(this.keys).find(key => key[1] === true)) this.frameCountNoInput++;
        else this.frameCountNoInput = 0;

        const bottomTilePos = activity.colliderTiles.find(tile => CollisionBox2.collidesWithInAxis(tile, { pos:new Vector2(this.pos.x, this.pos.y + this.size.y), size:new Vector2(this.size.x, 0) }, 'y') && CollisionBox2.intersectsInAxis(tile, { pos:new Vector2(this.pos.x, this.pos.y + this.size.y), size:new Vector2(this.size.x, 0) }, 'x'));

        const leftTilePos = activity.colliderTiles.find(tile => CollisionBox2.collidesWithInAxis(tile, { pos:new Vector2(this.pos.x, this.pos.y), size:new Vector2(0, this.size.y) }, 'x') && CollisionBox2.intersectsInAxis(tile, { pos:new Vector2(this.pos.x, this.pos.y + this.size.y - 8), size:new Vector2(0, 8) }, 'y'));
        const rightTilePos = activity.colliderTiles.find(tile => CollisionBox2.collidesWithInAxis(tile, { pos:new Vector2(this.pos.x + this.size.x, this.pos.y), size:new Vector2(0, this.size.y) }, 'x') && CollisionBox2.intersectsInAxis(tile, { pos:new Vector2(this.pos.x + this.size.x, this.pos.y + this.size.y - 8), size:new Vector2(0, 8) }, 'y'));

        this.isGrounded = bottomTilePos;
        this.isJumpFromWall = this.isGrounded ? false : this.isJumpFromWall;
        this.isWall = !this.isGrounded && this.vel.y > -4 && ((leftTilePos && this.keys.left) || (rightTilePos && this.keys.right));
        this.isWalking = this.isGrounded && (this.keys.left !== this.keys.right);

        this.action = this.updateAction();

        // Velocity
        this.vel = this.vel.mult(this.velLoss);
        this.vel = this.vel.plus(new Vector2(
            (this.isGrounded ? this.walkSpeed : this.aerialSpeed) * (this.keys.left === this.keys.right ? 0 : this.keys.left ? -1 : 1),
            this.isWall && this.vel.y > this.gravity ? this.gravity / 4 : this.gravity
        ));
        // Velocity correction
        this.vel = new Vector2(Math.max(-16, Math.min(Math.abs(this.vel.x) < 0.01 ? 0 : this.vel.x, 16)), Math.max(-16, Math.min(Math.abs(this.vel.y) < 0.01 ? 0 : this.vel.y, 16)));

        // Jump & Gravity correction
        if ((this.isGrounded || this.isWall) && this.canJump) {
            this.vel = new Vector2(this.isWall && this.keys.jump ? 4 * (this.dir ? 1 : -1) : this.vel.x, this.keys.jump ? (this.isWall ? -4 : -5) : this.vel.y);
            this.canJump = false;
        }
        if (this.isWall && this.keys.jump) this.isJumpFromWall = true;
        if (!this.canJump && !this.keys.jump) this.canJump = true;

        // Direction
        this.dir = this.isJumpFromWall ? this.dir : (this.keys.left === this.keys.right ? this.dir : this.keys.right);
        if (this.isWall) this.dir = leftTilePos && this.keys.left;

        // Position correction
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
                if (this.pos.y < obstacle.pos.y && this.vel.y > this.gravity) this.land = true;
                this.vel.y = 0;
            }
        });

        
        // Dust
        const regularDust = (this.isGrounded || this.land) || (this.keys.jump && this.isWall && this.vel.y === -4);
        if ((Math.abs(this.vel.x) > 2 || Math.abs(this.vel.y) > 2) && this.isGrounded || this.land || this.isWall) {
            const dustPos = this.land ? newPos : this.pos;
            for (let i = 0; i < (regularDust ? 48 : 16); i++) {
                activity.dustParticles.push(new Dust(
                    dustPos.plus(new Vector2((this.dir ? 0 : this.size.x) + Math.round(Math.random() * 4) - 2, this.size.y + (!this.isGrounded ? -4 : 0) + Math.round(Math.random() * 4 - 2))),
                    new Vector2(
                        (Math.random() * 0.25) * (this.dir ? -0.5 : 0.5) * (this.isWall ? -1 : 1) * (regularDust ? 3 : this.vel.y),
                        -0.25 + Math.random() * 0.25 - 0.125
                    ),
                    Math.round((16 + Math.random() * 16) * (regularDust ? 1 : Math.abs(Math.floor(this.vel.y)) / 16)),
                    (Math.random() > 0.5 ? 1 : 2)
                ));
            }
        }

        if (this.land) this.land = false;
        this.pos = newPos;
        
        // Gun
        if (this.keys.attack && this.canShoot) {
            this.canShoot = false;
            
            let angle = 0;
            if (!this.keys.down && !this.keys.up) angle = this.dir ? 0 : Math.PI;
            if (this.keys.down) {
                angle = this.dir ? Math.PI * 0.25 : -Math.PI * 1.25;
            } else if (this.keys.up) {
                angle = this.dir ? -Math.PI * 0.25 : Math.PI * 1.25;
            }
            
            const pos = this.pos.plus(this.size.times(0.5)).plus(this.size.mult(new Vector2((this.dir ? 0.6 : -0.8) * (this.keys.down || this.keys.up ? 0.7 : 1), this.keys.down ? (0.1) : (this.keys.up ? (-0.4) : (-0.15)))));
            const bullet = new Bullet(pos, new Vector2(Math.cos(angle), Math.sin(angle)));
            if (!CollisionBox2.intersectingCollisionBoxes(bullet, activity.colliderTiles).length) activity.actors.push(bullet);
        }
        if (!this.keys.attack && !this.canShoot) this.canShoot = true;

        if (this.hitAnim) this.hitAnim--;
        this.frameCount++;
    }
    
    display = (cx, assets) => {
        this.displayAnimation(cx, this.actions[this.action].animation, assets.images[`${this.name}_${this.action}`]);
        // if (this.name === 'flare') {
        //     cx.fillStyle = '#fff';
        //     cx.font = '16px serif';
        //     cx.fillText(Math.round(this.vel.x*100)/100, 0, 0);
        //     cx.fillText(Math.round(this.vel.y*100)/100, 64, 0);
        // }
    }
}