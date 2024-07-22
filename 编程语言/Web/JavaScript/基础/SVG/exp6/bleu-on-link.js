class BleuOnLink {
  constructor(svg) {
    this._svg = svg;
    // 补偿 x、y 坐标。发生于移动 path 时对于不同面相对于 rect 左上角原点 0,0 进行补偿
    this.compSourceX = 0;
    this.compSourceY = 0;
    this.compTargetX = 0;
    this.compTargetY = 0;
    this.tolerant = 20;
    this._linkG = null;
    this._linkPath = null;
    this._source = null;
    this._target = null;
    this._updatedSourceX = 0;
    this._updatedSourceY = 0;
    this._updatedTargetX = 0;
    this._updatedTargetY = 0;
    this._sourceG = null;
    this._targetG = null;
    this._sourceArrow = null;
    this._targetArrow = null;
    this.createDOM();
  }

  createDOM = () => {
    this._linkG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._linkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

    this._linkPath.setAttribute("cursor", "pointer");
    this._linkPath.setAttribute("fill", "none");
    this._linkPath.setAttribute("stroke", "#333333");
    this._linkPath.setAttribute("stroke-width", "2");

    this._sourceG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._targetG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._sourceArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this._targetArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");

    this._sourceArrow.setAttribute("cursor", "pointer");
    this._sourceArrow.setAttribute("fill", "black");

    this._targetArrow.setAttribute("cursor", "pointer");
    this._targetArrow.setAttribute("fill", "black");
  };

  updateGTransform(g, x, y) {
    g.setAttribute("transform", `translate(${x}, ${y})`);
  }

  updatePathAttr(path, sX, sY, tX, tY) {
    path.setAttribute("d", `M${sX},${sY} L${tX},${tY}`);
  }

  initConfig = () => {
    this._updatedSourceX = this._source.x + this._source.width;
    this._updatedSourceY = this._source.y + this._source.height / 2;
    this._updatedTargetX = this._target.x;
    this._updatedTargetY = this._target.y + this._target.height / 2;

    this.updatePathAttr(
      this._linkPath,
      this._updatedSourceX,
      this._updatedSourceY,
      this._updatedTargetX,
      this._updatedTargetY
    );

    this.updateGTransform(this._sourceG, this._updatedSourceX, this._updatedSourceY);
    this._sourceArrow.setAttribute("d", `M${0}, ${0} L${10}, ${-5} L${10}, ${5}`);

    this.updateGTransform(this._targetG, this._updatedTargetX, this._updatedTargetY);
    this._targetArrow.setAttribute("d", `M${0}, ${0} L${-10}, ${-5} L${-10}, ${5}`);

    this._sourceG.appendChild(this._sourceArrow);
    this._targetG.appendChild(this._targetArrow);
    this._linkG.append(this._linkPath, this._sourceG, this._targetG);
    this._svg.appendChild(this._linkG);

    this.createEvent({
      g: this._sourceG,
      arrow: this._sourceArrow,
      type: "source",
      rect: this._source
    });

    this.createEvent({
      g: this._targetG,
      arrow: this._targetArrow,
      type: "target",
      rect: this._target
    });
  };

  source = value => {
    this._source = value;
    this._source.setOnMouseMoveSVG((x, y) => {
      this._updatedSourceX = x + this.compSourceX;
      this._updatedSourceY = y + this.compSourceY;
      this.updatePathAttr(
        this._linkPath,
        this._updatedSourceX,
        this._updatedSourceY,
        this._updatedTargetX,
        this._updatedTargetY
      );
      this.updateGTransform(this._sourceG, this._updatedSourceX, this._updatedSourceY);
    });
  };

  target = value => {
    this._target = value;
    this._target.setOnMouseMoveSVG((x, y) => {
      this._updatedTargetX = x + this.compTargetX;
      this._updatedTargetY = y + this.compTargetY;
      this.updatePathAttr(
        this._linkPath,
        this._updatedSourceX,
        this._updatedSourceY,
        this._updatedTargetX,
        this._updatedTargetY
      );
      this.updateGTransform(this._targetG, this._updatedTargetX, this._updatedTargetY);
    });

    this.initConfig();
  };

  isTopArea = (rect, updated) => {
    return (
      rect.x + rect.width >= updated.x &&
      rect.x <= updated.x &&
      rect.y - this.tolerant <= updated.y &&
      rect.y + this.tolerant >= updated.y
    );
  };

  isBottomArea = (rect, updated) => {
    return (
      rect.x + rect.width >= updated.x &&
      rect.x <= updated.x &&
      rect.y + rect.height - this.tolerant <= updated.y &&
      rect.y + rect.height + this.tolerant >= updated.y
    );
  };

  isLeftArea = (rect, updated) => {
    return (
      rect.x + this.tolerant >= updated.x &&
      rect.x - this.tolerant <= updated.x &&
      rect.y <= updated.y &&
      rect.y + this._source.height >= updated.y
    );
  };

  isRightArea = (rect, updated) => {
    return (
      rect.x + rect.width - this.tolerant <= updated.x &&
      rect.x + rect.width + this.tolerant >= updated.x &&
      rect.y + rect.height >= updated.y &&
      rect.y <= updated.y
    );
  };

  compensate = (e, rect, updated) => {
    let compX = 0,
      compY = 0;
    if (this.isTopArea(rect, updated)) {
      compX = e.offsetX - rect.x;
      compY = 0;
    } else if (this.isBottomArea(rect, updated)) {
      compX = e.offsetX - rect.x;
      compY = rect.height;
    } else if (this.isLeftArea(rect, updated)) {
      compX = 0;
      compY = e.offsetY - rect.y;
    } else if (this.isRightArea(rect, updated)) {
      compX = rect.width;
      compY = e.offsetY - rect.y;
    }
    return { compX, compY };
  };

  onMouseTragArrowMovingInSVG = (e, param) => {
    if (param.type === "source") {
      this._updatedSourceX = e.offsetX;
      this._updatedSourceY = e.offsetY;
      this.updateGTransform(param.g, this._updatedSourceX - 5, this._updatedSourceY);
    } else {
      this._updatedTargetX = e.offsetX;
      this._updatedTargetY = e.offsetY;
      this.updateGTransform(param.g, this._updatedTargetX + 5, this._updatedTargetY);
    }
    this.updatePathAttr(
      this._linkPath,
      this._updatedSourceX,
      this._updatedSourceY,
      this._updatedTargetX,
      this._updatedTargetY
    );
  };

  onMouseDownArrow = (e, param) => {
    this._tempOnMouseTragArrowMovingInSVG = e => this.onMouseTragArrowMovingInSVG(e, param);
    this._svg.addEventListener("mousemove", this._tempOnMouseTragArrowMovingInSVG);
  };

  onMouseUpArrow = (e, param) => {
    if (param.type === "source") {
      const { compX, compY } = this.compensate(e, param.rect, {
        x: this._updatedSourceX,
        y: this._updatedSourceY
      });
      this.compSourceX = compX;
      this.compSourceY = compY;
    } else {
      const { compX, compY } = this.compensate(e, param.rect, {
        x: this._updatedTargetX,
        y: this._updatedTargetY
      });
      this.compTargetX = compX;
      this.compTargetY = compY;
    }
    this._svg.removeEventListener("mousemove", this._tempOnMouseTragArrowMovingInSVG);
    this._tempOnMouseTragArrowMovingInSVG = null;
  };

  createEvent(param) {
    param.arrow.addEventListener("mousedown", e => this.onMouseDownArrow(e, param));
    param.arrow.addEventListener("mouseup", e => this.onMouseUpArrow(e, param));
  }
}
