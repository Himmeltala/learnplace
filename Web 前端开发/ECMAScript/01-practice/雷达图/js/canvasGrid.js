function drawGrid(canvasW, canvasH, step) {
  ctx.strokeStyle = "#ADADAD";
  drawGridX(step, canvasH);
  drawGridY(step, canvasW);
}

function drawGridX(step, canvasH) {
  let horizontalX = 0;
  let gridX = new Path2D();
  for (let i = 0; i < canvasH / step; i++) {
    horizontalX += step;
    gridX.moveTo(horizontalX, 0);
    gridX.lineTo(horizontalX, canvasH);
    ctx.stroke(gridX);
  }
}

function drawGridY(step, canvasW) {
  let verticalY = 0;
  let gridY = new Path2D();
  for (let i = 0; i < canvasW / step; i++) {
    verticalY += step;
    gridY.moveTo(0, verticalY);
    gridY.lineTo(canvasW, verticalY);
    ctx.stroke(gridY);
  }
}
