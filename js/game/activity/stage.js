class Stage extends Activity {
    // actors = [new Character({}, WATAME, 'idle', false, new Vector2(344, 36))];
    actors = [];
    backgroundTiles = [];
    colliderTiles = [];
    dustParticles = [];

    constructor(data, keys) {
        super();
        
        this.tileset = data.tiles;

        data.rooms.forEach(({ x, y, tiles, events }) => {
            let roomX = x;
            let roomY = y;
            tiles.forEach(({ x, y, id }) => {
                if (id !== -1) this[this.tileset.colliders[id] ? 'colliderTiles' : 'backgroundTiles'].push({
                    pos: new Vector2(roomX * 16 * 16 + x * 16, roomY * 16 * 15 + y * 16),
                    size: new Vector2(16, 16), texture: id });
            });
            events.forEach(({ x, y, id }) => {
                const data = id ? NAAN : FLARE;
                this.actors.push(new Character(data.keys ? keys : {}, data, 'idle', true,
                    new Vector2(
                        data.width * 16 / 2 + x * 16 - data.actions['idle'].size.x / 2,
                        data.height * 16 + y * 16 - data.actions['idle'].size.y)));
            })
        });
        this.player = this.actors.find(actor => actor.name === 'flare');
    }

    update = game => {
        const cx = game.cx;
        cx.save();

        // Actors logic
        this.actors = this.actors.filter(actor => !actor.isDone);
        this.actors.forEach(actor => actor.update(game, this));

        // Viewport
        const view = {
            x: !this.player ? 0 : Math.round(this.player.pos.x + this.player.size.x / 2) - game.width / 2,
            y: !this.player ? 0 : Math.round(this.player.pos.y + this.player.size.y / 2) - game.height / 2
        }
        // view.x = Math.max(0, Math.min(view.x, (this.fixedRoom.width * 16 * 16) - game.width));
        cx.translate(-view.x, -view.y);
        
        // Background tiles
        this.backgroundTiles.forEach(tile => {
            const x = tile.texture % this.tileset.width;
            const y = Math.floor(tile.texture / this.tileset.width);
            cx.drawImage(game.assets.images['tileset'],
                x * 16, y * 16, 16, 16,
                tile.pos.x, tile.pos.y, tile.size.x, tile.size.y
            );
        });

        // Actors display
        this.actors.forEach(actor => {
            cx.save();
            actor.display(cx, game.assets);
            // actor.displayCollisionBox(game);
            cx.restore();
        });

        // Dust
        cx.fillStyle = '#fff';
        this.dustParticles = this.dustParticles.filter(particle => particle.life);
        this.dustParticles.forEach(particle => {
            particle.update(game);
            particle.display(cx);
        });

        // Collider tiles
        cx.fillStyle = '#8aa';
        this.colliderTiles.forEach(tile => {
            const x = tile.texture % this.tileset.width;
            const y = Math.floor(tile.texture / this.tileset.width);
            cx.drawImage(game.assets.images['tileset'],
                x * 16, y * 16, 16, 16,
                tile.pos.x, tile.pos.y, tile.size.x, tile.size.y
            );
        });
        
        cx.restore();
    }
}