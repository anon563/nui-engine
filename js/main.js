window.onload = () => {


    // Edit modes


    let mode = null; // move, editRooms, editTiles
    let tileMode = null; // tiles, colliders, events
    let selectedTile = null;
    let selectedEvent = null;

    const changeMode = (event, newMode) => {
        const modeElems = document.getElementsByClassName("nav-mode");
        for (let i = 0; i < modeElems.length; i++) modeElems[i].className = modeElems[i].className.replace(" active", "");

        document.getElementById("main-canvas").style.cursor = newMode === 'move' ? 'grab' : 'auto';
        event.currentTarget.className += " active";
        mode = newMode;
    }
    document.getElementById('nav-move-btn').onclick = event => changeMode(event, 'move');
    document.getElementById('nav-edit-rooms-btn').onclick = event => changeMode(event, 'editRooms');
    document.getElementById('nav-edit-tiles-btn').onclick = event => changeMode(event, 'editTiles');

    const changeTileMode = (event, newTileMode) => {
        const tabcontent = document.getElementsByClassName("menu");
        for (let i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
      
        const tablinks = document.getElementsByClassName("tablinks");
        for (let i = 0; i < tablinks.length; i++) tablinks[i].className = tablinks[i].className.replace(" active", "");
      
        if (newTileMode === 'colliders') {
            document.getElementById('tiles').style.display = "flex";
            Array.from(document.querySelectorAll('.tile-selected')).forEach((el) => el.classList.remove('tile-selected'));
            Array.from(document.querySelectorAll('.collider')).forEach((el) => el.style.display = 'flex');
        } else if (newTileMode === 'tiles'){
            document.getElementById('tiles').style.display = "flex";
            if (selectedTile !== -1) document.getElementById(`tile-${selectedTile}`).classList.add('tile-selected');
            Array.from(document.querySelectorAll('.collider')).forEach((el) => el.style.display = 'none');
        } else document.getElementById(newTileMode).style.display = "flex";
        event.currentTarget.className += " active";
        tileMode = newTileMode;
    }
    document.getElementById("menu-tiles-btn").onclick = event => changeTileMode(event, 'tiles');
    document.getElementById("menu-colliders-btn").onclick = event => changeTileMode(event, 'colliders');
    document.getElementById("menu-events-btn").onclick = event => changeTileMode(event, 'events');


    // Rooms
    
    
    let rooms = [];

    const roomTileX = 16;
    const roomTileY = 15;
    const tileSize = 16;

    const addRoom = (x, y) => {
        const newRoom = { x: x, y: y, tiles: [], events: [] }
        for (let y = 0; y < roomTileY; y++) for (let x = 0; x < roomTileX; x++) newRoom.tiles.push({ x: x, y: y, id: -1 });
        rooms.push(newRoom);
    }
    addRoom(0, 0);


    // Tiles
    
    
    let tiles = {
        src: null,
        width: null,
        height: null,
        colliders: null
    }
    let tilesImg = null;

    const tilesInput = document.getElementById("tiles-input");
    const loadTiles = ({ src, width, height, colliders }) => {
        selectedTile = -1;

        const tileContainer = document.getElementById("tiles-container");
        tileContainer.innerHTML = "";

        tilesImg = new Image();
        tilesImg.onload = () => {
            tiles.width = Math.floor(tilesImg.width / 16);
            tiles.height = Math.floor(tilesImg.height / 16);
            tiles.colliders = colliders ? colliders : new Array(tiles.width * tiles.height).fill(0);
            tiles.src = src;

            for (let y = 0; y < tiles.height; y++) {
                for (let x = 0; x < tiles.width; x++) {
                    const i = y * tiles.width + x;

                    const canvas = document.createElement("canvas");
                    canvas.id = `tile-${i}`;
                    canvas.width = 32;
                    canvas.height = 32;
                    const cx = canvas.getContext("2d");
                    cx.imageSmoothingEnabled = false;
                    cx.drawImage(tilesImg, x * 16, y * 16, 16, 16, 0, 0, 32, 32);
                    tileContainer.appendChild(canvas);
                    canvas.onclick = () => {
                        if (tileMode === 'tiles') {
                            Array.from(document.querySelectorAll('.tile-selected')).forEach((el) => el.classList.remove('tile-selected'));
                            canvas.classList.add("tile-selected");
                            selectedTile = i;
                        }
                        if (tileMode === 'colliders') {
                            const collider = document.getElementById(`collider-${i}`);
                            collider.innerHTML = collider.innerHTML === 'radio_button_unchecked' ? 'close' : 'radio_button_unchecked';
                            tiles.colliders[i] = tiles.colliders[i] ? 0 : 1;
                        }
                    }

                    const collider = document.createElement("div");
                    collider.id = `collider-${i}`;
                    collider.classList = "collider material-icons";
                    collider.style.display = 'none';
                    collider.innerHTML = tiles.colliders[i] ? "close" : "radio_button_unchecked";
                    tileContainer.appendChild(collider);
                }
            }
            document.getElementById("nav-edit-tiles-btn").click();
            document.getElementById("menu-tiles-btn").click();
            document.getElementById("tile-1").click();
        }
        tilesImg.onerror = () => tilesImg = null;
        tilesImg.src = src;
    }
    tilesInput.onchange = () => loadTiles({ src: tilesInput.value, width: undefined, height: undefined, colliders: undefined });
    loadTiles({ src: tilesInput.value, width: undefined, height: undefined, colliders: undefined });


    // Events


    let events = [FLARE, NAAN];
    
    const loadEvents = () => {
        selectedEvent = -1;

        const eventsContainer = document.getElementById("events-container");
        eventsContainer.innerHTML = "";

        events.forEach((event, i) => {
            event.img = new Image();
            event.img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.id = `event-${event.name}`;
                canvas.width = event.img.width * 2;
                canvas.height = event.img.height * 2;
                const cx = canvas.getContext("2d");
                cx.scale(2, 2);
                cx.imageSmoothingEnabled = false;
                cx.drawImage(event.img, 0, 0);
                eventsContainer.appendChild(canvas);
                canvas.onclick = () => {
                    Array.from(document.querySelectorAll('.event-selected')).forEach((el) => el.classList.remove('event-selected'));
                    canvas.classList.add("event-selected");
                    selectedEvent = i;
                }
            }
            event.img.onerror = () => console.log(`ERROR: ${event.src}`);
            event.img.src = event.src;
        })
    }
    loadEvents();


    // Save


    const downloadAnchorElem = document.createElement("a");
    document.getElementById('nav-save-btn').onclick = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            events: events,
            rooms: rooms,
            tiles: tiles
        }));
        downloadAnchorElem.setAttribute("href", dataStr);
        downloadAnchorElem.setAttribute("download", `game_data_${Date.now()}.nui`);
        downloadAnchorElem.click();
    };


    // Load


    document.getElementById("nav-load-btn").onclick = event => {
        event.preventDefault();
        document.getElementById("nav-load-input").click();
    }

    document.getElementById("nav-load-input").onchange = event => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = e => {
                const result = JSON.parse(e.target.result);

                rooms = result.rooms;
                loadTiles(result.tiles);

                events = result.events;
                loadEvents();
            }
            reader.onerror = e => console.log("error reading file");
        }
    }


    // Demo


    let DEMO = null;

    const demoContainer = document.getElementById("demo-container");
    demoContainer.onclick = () => {
        demoContainer.style.display = 'none';
        if (DEMO && DEMO.animation) cancelAnimationFrame(DEMO.animation);
        DEMO = null;
    }

    document.getElementById("nav-play-btn").onclick = () => {
        demoContainer.style.display = 'flex';

        const demoAssets = new Assets();
        demoAssets.images['tileset'] = new Image;
        demoAssets.images['tileset'].src = tiles.src;

        DEMO = new Game({
            rooms: rooms,
            tiles: tiles,
            events: events
        }, demoAssets);
        DEMO.assets.load().then(() => DEMO.animation = requestAnimationFrame(DEMO.loop));
    }


    // Main canvas
    
    
    const mainCanvas = document.getElementById("main-canvas");
    const cx = mainCanvas.getContext("2d");
    
    const resize = () => {
        mainCanvas.width = innerWidth;
        mainCanvas.height = innerHeight;
        cx.imageSmoothingEnabled = false;
    }
    window.onresize = resize;
    resize();

    let zoom = 1;
    let viewX = null;
    let viewY = null;
    
    const mainMouse = new Mouse(mainCanvas);

    const setZoom = (delta, pos) => {
        const newZoom = zoom + delta;
        if (pos && newZoom > 0 && newZoom < 5) {
            const mouseX = pos.x / zoom;
            const mouseY = pos.y / zoom;
            viewX += Math.round(mouseX - (mouseX * mainCanvas.width / newZoom / (mainCanvas.width / zoom)));
            viewY += Math.round(mouseY - (mouseY * mainCanvas.height / newZoom / (mainCanvas.height / zoom)));
            zoom = newZoom;
        }
    }
    document.body.onwheel = event => setZoom(Math.round(event.deltaY * -0.01), mainMouse.pos);
    document.getElementById('nav-zoom-in-btn').onclick = () => setZoom(1, { x: mainCanvas.width / 2, y: mainCanvas.height / 2 });
    document.getElementById('nav-zoom-out-btn').onclick = () => setZoom(-1, { x: mainCanvas.width / 2, y: mainCanvas.height / 2 });
    setZoom(1, { x: mainCanvas.width / 2, y: mainCanvas.height / 2 });

    viewX = Math.round(-mainCanvas.width / 2 / zoom) + roomTileX / 2 * tileSize + 128 / zoom;
    viewY = Math.round(-mainCanvas.height / 2 / zoom) + roomTileY / 2 * tileSize - 20 / zoom;

    // Animation


    const animation = () => {
        // Move logic
        if (mode === 'move' && mainMouse.click === 'down' && mainMouse.pos && mainMouse.lastPos) {
            viewX -= Math.round((mainMouse.pos.x - mainMouse.lastPos.x) / zoom);
            viewY -= Math.round((mainMouse.pos.y - mainMouse.lastPos.y) / zoom);
            mainMouse.lastPos = null;
        }

        cx.save();
        cx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        cx.scale(zoom, zoom);


        // Grid
        cx.lineWidth = 2;
        if (mode === 'editRooms') {
            cx.strokeStyle = '#404040';
            for (let x = -viewX % (roomTileX * tileSize); x < innerWidth; x += roomTileX * tileSize) {
                cx.beginPath();
                cx.moveTo(x, 0);
                cx.lineTo(x, innerHeight);
                cx.stroke();
            }
            for (let y = -viewY % (roomTileY * tileSize); y < innerHeight; y += roomTileY * tileSize) {
                cx.beginPath();
                cx.moveTo(0, y);
                cx.lineTo(innerWidth, y);
                cx.stroke();
            }
        }

        cx.translate(-viewX, -viewY);

        // Draw room information
        rooms.forEach(room => {
            const width = roomTileX * tileSize;
            const height = roomTileY * tileSize;
            cx.save();
            cx.translate(room.x * width, room.y * height);
            cx.strokeStyle = '#404040';
            for (let x = 0; x <= width; x += 16) {
                cx.beginPath();
                cx.moveTo(x, 0);
                cx.lineTo(x, height);
                cx.stroke();
            }
            for (let y = 0; y <= height; y += 16) {
                cx.beginPath();
                cx.moveTo(0, y);
                cx.lineTo(width, y);
                cx.stroke();
            }
            cx.strokeStyle = '#808080';
            cx.lineCap = "square";
            cx.lineJoin = "miter";
            cx.strokeRect(0, 0, width, height);

            cx.restore();
        });

        // Draw room tiles/events
        rooms.forEach(room => {
            cx.save();
            cx.translate(room.x * roomTileX * tileSize, room.y * roomTileY * tileSize);
            room.tiles.forEach(tile => {
                if (tile.id > 0) {
                    const x = tile.id % Math.floor(tilesImg.width / tileSize);
                    const y = Math.floor(tile.id / Math.floor(tilesImg.width / tileSize));
                    cx.drawImage(tilesImg, x * tileSize, y * tileSize, tileSize, tileSize, tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
                }
            });
            cx.globalAlpha = .5;
            room.events.forEach(event => {
                cx.drawImage(events[event.id].img, event.x * tileSize, event.y * tileSize);
            });
            cx.restore();
        });

        const fixedMouseD = mainMouse.pos ? { x: Math.floor((mainMouse.pos.x / zoom + viewX) / 16) * 16, y: Math.floor((mainMouse.pos.y / zoom + viewY) / 16) * 16 } : null;
        if (fixedMouseD) {
            const room = rooms.find(room => room.x === Math.floor(fixedMouseD.x / tileSize / roomTileX) && room.y === Math.floor(fixedMouseD.y / tileSize / roomTileY));
            switch (mode) {
                case 'editRooms':
                    const width = roomTileX * tileSize;
                    const height = roomTileY * tileSize;

                    cx.translate(Math.floor(fixedMouseD.x / width) * width, Math.floor(fixedMouseD.y / height) * height);
                    
                    cx.strokeStyle = '#fff';
                    cx.lineCap = "square";
                    cx.lineJoin = "miter";
                    cx.beginPath();
                    cx.moveTo(0, 0);
                    cx.lineTo(0, height);
                    cx.lineTo(width, height);
                    cx.lineTo(width, 0);
                    cx.lineTo(0, 0);
                    cx.stroke();
                    
                    if (mainMouse.click === 'down' && !room) {
                        mainMouse.click = 'up';
                        addRoom(Math.floor(fixedMouseD.x / width), Math.floor(fixedMouseD.y / height));
                    }
                    break;
                case 'editTiles':
                    if (room) {
                        if (tileMode === 'tiles' && tilesImg && selectedTile !== -1) {
                            cx.globalAlpha = .5;
                            const x = selectedTile % Math.floor(tilesImg.width / 16);
                            const y = Math.floor(selectedTile / Math.floor(tilesImg.width / 16));
                            cx.drawImage(tilesImg, x * 16, y * 16, 16, 16, fixedMouseD.x, fixedMouseD.y, 16, 16);
                            if (mainMouse.click === 'down') {
                                const tile = room.tiles.find(tile =>
                                    tile.x === (((fixedMouseD.x / tileSize) % roomTileX) + roomTileX) % roomTileX &&
                                    tile.y === (((fixedMouseD.y / tileSize) % roomTileY) + roomTileY) % roomTileY);
                                tile.id = selectedTile;
                            }
                        } else if (tileMode === 'events' && selectedEvent !== -1) {
                            cx.save();
                            cx.globalAlpha = .5;
                            cx.drawImage(events[selectedEvent].img, fixedMouseD.x, fixedMouseD.y);
                            cx.restore();
                            if (mainMouse.click === 'down') {
                                mainMouse.click = 'up';
                                if (events[selectedEvent].unique) room.events = room.events.filter(event => event.id !== selectedEvent);
                                room.events.push({
                                    x: (((fixedMouseD.x / tileSize) % roomTileX) + roomTileX) % roomTileX,
                                    y: (((fixedMouseD.y / tileSize) % roomTileY) + roomTileY) % roomTileY,
                                    id: selectedEvent
                                });
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        cx.restore();
        requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
}