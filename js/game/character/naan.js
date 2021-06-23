const NAAN = {
    name: 'naan',

    unique: false,
    keys: false,
    src: 'img/naan_icon.png',
    img: null,
    width: 2,
    height: 2,

    actions: {
        idle: {
            size: { x: 20, y: 26 },
            animation: {
                offset: { x: -6, y: -6 },
                size: { x: 32, y: 32 },
                speed: 1 / 10,
                frames: 2
            }
        }
    }
}