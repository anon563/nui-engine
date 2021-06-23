class Assets {
    images = new Object;
    imageDataList = [
        // { id: 'noel_idle', src: 'img/noel_idle.png' },
        // { id: 'watame_idle', src: 'img/watame_idle.png' },
        // { id: 'watame_focus', src: 'img/watame_focus.png' },
        // { id: 'flash', src: 'img/flash.png' },
        
        { id: 'flare_idle', src: 'img/flare_idle_gun.png' },
        { id: 'flare_idle_down', src: 'img/flare_idle_gun_down.png' },
        { id: 'flare_idle_up', src: 'img/flare_idle_gun_up.png' },
        { id: 'flare_idle_look', src: 'img/flare_idle_gun_look.png' },

        { id: 'flare_walk', src: 'img/flare_walk_gun.png' },
        { id: 'flare_walk_down', src: 'img/flare_walk_gun_down.png' },
        { id: 'flare_walk_up', src: 'img/flare_walk_gun_up.png' },

        { id: 'flare_jump', src: 'img/flare_jump_gun.png' },
        { id: 'flare_jump_down', src: 'img/flare_jump_gun_down.png' },
        { id: 'flare_jump_up', src: 'img/flare_jump_gun_up.png' },

        { id: 'flare_wall', src: 'img/flare_wall_gun.png' },
        { id: 'flare_wall_down', src: 'img/flare_wall_gun_down.png' },
        { id: 'flare_wall_up', src: 'img/flare_wall_gun_up.png' },

        // { id: 'kintsuba', src: 'img/kintsuba.png' },
        { id: 'bullet', src: 'img/bullet.png' },

        { id: 'naan_idle', src: 'img/naan_idle.png' }
    ];
    
    constructor() {
        this.imageDataList.forEach(imageData => {
            this.images[imageData.id] = new Image;
            this.images[imageData.id].src = imageData.src;
        });
    }

    load = () => Promise.all(Object.keys(this.images).map(key => new Promise(resolve => this.images[key].onload = () => resolve())));
}