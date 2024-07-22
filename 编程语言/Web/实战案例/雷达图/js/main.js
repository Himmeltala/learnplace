class RadarMap {
  constructor(ctx, radar, dataArea, config) {
    this.ctx = ctx;
    this.radar = radar;
    this.dataArea = dataArea;
    this.config = config;
  }

  drawRadarMap() {
    let axis = [];
    let radius = this.radar.polygonPerStep;

    if (this.config) {
      this.ctx.strokeStyle = this.config.radar.lineColor;
      this.ctx.lineWidth = this.config.radar.lineWidth;
    }

    for (let j = 0; j < this.radar.radarLayers; j++) {
      this.drawPolygon(radius, axis, j);
      radius = radius + this.radar.polygonPerStep;
    }

    this.drawStria(axis);
    return this.drawDataArea(axis);
  }

  // 计算多边形点的x轴坐标
  calcPolygonX(radius, increaseAngle) {
    return this.radar.radarX + radius * Math.cos(increaseAngle);
  }

  // 计算多边形点的y轴坐标
  calcPolygonY(radius, increaseAngle) {
    return this.radar.radarY - radius * Math.sin(increaseAngle);
  }

  /**
   * 绘制多边形
   *
   * @param radius 多边形半径长度
   * @param axis 所有多边形的点坐标
   * @param currentPolygonLayer 当前多边形的层数
   */
  drawPolygon(radius, axis, currentPolygonLayer) {
    let averageAngle = (Math.PI * 2) / this.radar.radarMapTotalSides;
    let increaseAngle = 0;
    let targetX, targetY;

    this.ctx.beginPath();
    axis.push({ layer: currentPolygonLayer, coords: [] });

    for (let i = 0; i < this.radar.radarMapTotalSides; i++) {
      targetX = this.calcPolygonX(radius, increaseAngle);
      targetY = this.calcPolygonY(radius, increaseAngle);
      this.ctx.lineTo(targetX, targetY);
      increaseAngle += averageAngle;
      axis[currentPolygonLayer].coords.push({ x: targetX, y: targetY });
    }

    this.ctx.closePath();
    this.ctx.stroke();
  }

  /**
   * 绘制多边形圆心到最外层多边形的直线
   *
   * @param axis 所有多边形的点坐标
   */
  drawStria(axis) {
    let coords = axis[axis.length - 1].coords;
    for (let i = 0; i < this.radar.radarMapTotalSides; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.radar.radarX, this.radar.radarY);
      this.ctx.lineTo(coords[i].x, coords[i].y);
      this.ctx.closePath();
      this.ctx.stroke();
      this.drawPointText(coords, i);
    }
  }

  /**
   * 绘制多边形做外层点的文本
   *
   * @param axis 所有多边形的点坐标
   * @param currentPoint 当前多边形的点的位置
   */
  drawPointText(axis, currentPoint) {
    this.ctx.font = `${this.config.radar.textSize}px Georgia`;
    this.ctx.lineWidth = this.config.dataArea.lineWidth;
    if (axis[currentPoint].x <= this.radar.radarX) {
      this.ctx.textAlign = "right";
    } else {
      this.ctx.textAlign = "left";
    }
    this.ctx.fillText(this.dataArea[currentPoint].title, axis[currentPoint].x, axis[currentPoint].y);
  }

  /**
   * 绘制数据区域的点，是一个样式，白色的点，突出数据区的点
   *
   * @param axis 所有多边形的点坐标
   */
  drawDataAreaPoint(axis) {
    this.ctx.strokeStyle = "white";
    for (let i = 0; i < axis.length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(axis[i].x, axis[i].y, 3, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.fillStyle = "white";
      this.ctx.fill();
    }
  }

  /**
   * 计算数据区域的点的 x 坐标
   *
   * @param areaTopLayer 数据区域的点的所在层数
   * @param axis 所有多边形的点坐标
   * @param currentPoint 当前循环到的多边形的一个点坐标
   * @returns {*} 返回 x 坐标
   */
  calcDataAreaTopX(areaTopLayer, axis, currentPoint) {
    if (areaTopLayer < 0) {
      return this.radar.radarX;
    } else {
      return axis[areaTopLayer].coords[currentPoint].x;
    }
  }

  /**
   * 计算数据区域的点的 y 坐标
   *
   * @param areaTopLayer 数据区域的点的所在层数
   * @param axis 所有多边形的点坐标
   * @param currentPoint 当前循环到的多边形的一个点坐标
   * @returns {*} 返回 y 坐标
   */
  calcDataAreaTopY(areaTopLayer, axis, currentPoint) {
    if (areaTopLayer < 0) {
      return this.radar.radarY;
    } else {
      return axis[areaTopLayer].coords[currentPoint].y;
    }
  }

  /**
   * 确定数据区域顶点，圈画数据区域以及填充数据区域的颜色
   *
   * @param axis 所有多边形的点坐标
   * @param currentPoint 当前循环到的多边形的一个点坐标
   * @returns {{x: (*), y: (*)}} 返回当前多边形的点坐标中对应的直线上，数据区域的值
   */
  drawDataAreaTop(axis, currentPoint) {
    let x = this.calcDataAreaTopX(this.dataArea[currentPoint].star - 1, axis, currentPoint);
    let y = this.calcDataAreaTopY(this.dataArea[currentPoint].star - 1, axis, currentPoint);
    if (currentPoint === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    return { x: x, y: y };
  }

  /**
   * 绘制数据区域
   *
   * @param axis 所有多边形的点坐标
   */
  drawDataArea(axis) {
    let areaTopAxis = []; // 数据区域的所有点坐标
    this.ctx.beginPath();
    for (let i = 0; i < this.radar.radarMapTotalSides; i++) {
      let { x, y } = this.drawDataAreaTop(axis, i);
      areaTopAxis.push({ title: this.dataArea[i].title, star: this.dataArea[i].star, x: x, y: y });
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = this.config.dataArea.lineColor;
    this.ctx.stroke();
    this.ctx.fillStyle = this.config.dataArea.fillColor;
    this.ctx.fill();
    this.drawDataAreaPoint(areaTopAxis);
    return areaTopAxis;
  }

  drawFloatingPanel(axis) {
    let floatingPanel = $("#floating-panel");
    let timeout = null;
    $("#radar-map").on({
      mousemove: function(e) {
        if (timeout != null) clearTimeout(timeout);
        timeout = setTimeout(() => {
          axis.forEach((value, index) => {
            if (
              value.x >= e.offsetX - 5 &&
              value.x < e.offsetX + 5 &&
              value.y >= e.offsetY - 5 &&
              value.y < e.offsetY + 5
            ) {
              $(floatingPanel).css({
                display: "block",
                left: `${e.offsetX}px`,
                top: `${e.offsetY}px`
              });
              $(floatingPanel).empty().append(`
                <div class="tech">技术：${value.title}</div>
                <div class="star">掌握程度：${value.star} 颗星</div>
              `);
            }
          });
        }, 50);
      },
      mouseleave: function(e) {
        $(floatingPanel).css({ display: "none" });
      }
    });
  }
}
