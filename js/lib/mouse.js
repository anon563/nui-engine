class Mouse {
    pos = null;
    lastPos = null;
    click = 'up';

    constructor(cx) {
        cx.onmousemove = event => {
            this.lastPos = this.pos;
            this.pos = { x: event.offsetX, y: event.offsetY }
        }
        cx.onmousedown = event => this.click = event.which === 1 ? 'down' : this.click;
        cx.onmouseup = event => this.click = 'up';
        cx.onmouseout = event => {
            this.pos = null;
            this.click = 'up';
        }
    }
}