const FLARE = {
    name: 'flare',
    
    unique: true,
    keys: true,
    src: 'img/flare_icon.png',
    img: null,
    width: 2,
    height: 3,

    actions: {
        idle: {
            size: { x: 20, y: 44 },
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 12,
                frames: 3
            }
        },
        idle_down: {
            size: { x: 20, y: 44 },
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 12,
                frames: 3
            }
        },
        idle_up: {
            size: { x: 20, y: 44 },
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 12,
                frames: 3
            }
        },
        idle_look: {
            size: { x: 20, y: 44 },
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 12,
                frames: 3
            }
        },
        walk: {
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 9,
                frames: 6
            }
        },
        walk_down: {
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 9,
                frames: 6
            }
        },
        walk_up: {
            animation: {
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1 / 9,
                frames: 6
            }
        },
        jump: {
            animation: {
                duration: 1,
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1,
                frames: 1
            }
        },
        jump_down: {
            animation: {
                duration: 1,
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1,
                frames: 1
            }
        },
        jump_up: {
            animation: {
                duration: 1,
                offset: { x: -12, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1,
                frames: 1
            }
        },
        wall: {
            animation: {
                duration: 1,
                offset: { x: -16, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1,
                frames: 1
            }
        },
        wall_down: {
            animation: {
                duration: 1,
                offset: { x: -16, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1,
                frames: 1
            }
        },
        wall_up: {
            animation: {
                duration: 1,
                offset: { x: -16, y: -4 },
                size: { x: 48, y: 48 },
                speed: 1,
                frames: 1
            }
        }
    }
}