class BleuOnRect {
  constructor(svg) {
    this._svg = svg;
    this.callOnMouseMoveSVG = [];
  }

  get graph() {
    return this._rect;
  }

  get g() {
    return this._g;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  position(x, y) {
    this._x = x;
    this._y = y;
  }

  resize(width, height) {
    this._width = width;
    this._height = height;
  }

  attr(value) {
    this._attrValue = value;
  }

  onMouseMoveingInSVG = e => {
    const difX = this._clickX - this._lastX;
    const difY = this._clickY - this._lastY;
    this._x = e.offsetX - difX;
    this._y = e.offsetY - difY;
    this._g.setAttribute("transform", `translate(${this._x}, ${this._y})`);

    if (this.callOnMouseMoveSVG.length > 0) {
      for (let i = 0; i < this.callOnMouseMoveSVG.length; i++) {
        this.callOnMouseMoveSVG[i](this._x, this._y);
      }
    }
  };

  setOnMouseMoveSVG = callback => {
    this.callOnMouseMoveSVG.push(callback);
  };

  onMouseDown = e => {
    this._lastX = this._x;
    this._lastY = this._y;
    this._clickX = e.offsetX;
    this._clickY = e.offsetY;
    this._svg.addEventListener("mousemove", this.onMouseMoveingInSVG);
  };

  onMouseUp = e => {
    this._svg.removeEventListener("mousemove", this.onMouseMoveingInSVG);
  };

  create = () => {
    this._rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this._rect.setAttribute("width", this._width);
    this._rect.setAttribute("height", this._height);
    this._rect.setAttribute("fill", this._attrValue.fill);

    this._g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._g.setAttribute("transform", `translate(${this._x}, ${this._y})`);

    this._g.appendChild(this._rect);
    this._svg.appendChild(this._g);

    this.createEvent();
  };

  createEvent = () => {
    this._g.addEventListener("mousedown", this.onMouseDown);
    this._g.addEventListener("mouseup", this.onMouseUp);
  };
}
