function drawChartGrid(pointsData, onClickPoint) {
  let $el = $("#cb-chart .bottom .right-side");
  $el.css("--point-size", `${$el.height() / 7}px`);
  for (let h = 0; h < 54; h++) {
    for (let v = 0; v < 7; v++) {
      $el.append(`<div class="point"></div>`);
    }
  }

  let nowDate = new Date();
  let oldDate = new Date(`${nowDate.getFullYear() - 1}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`);
  drawPoints(oldDate.getDay(), pointsData(oldDate), onClickPoint);
  drawMonths(oldDate);
}

function drawPoints(index, data, onClickPoint) {
  let start = index - 1 < 0 ? 6 : index - 1;
  let end = start === 6 ? 372 : 365 + index;

  $(`#cb-chart .bottom .right-side .point`).slice(start, end).each((i, el) => {
    setPointColor(el, data[i].number);
    $(el).on({
      "mouseenter": () => {
        openPointPopup(data[i], el);
        $(el).addClass("point-hover")
          .next(".point-popup")
          .addClass("open-point-popup")
          .removeClass("close-point-popup");
      },
      "mouseleave": () => {
        $(el).removeClass("point-hover")
          .next(".point-popup")
          .addClass("close-point-popup")
          .removeClass("open-point-popup");
      },
      "click": () => onClickPoint(i, el, data[i])
    });
  });
}

function setPointColor(el, number) {
  if (number > 0 && number <= 5) {
    $(el).addClass("a-type-point");
  } else if (number > 5 && number <= 10) {
    $(el).addClass("b-type-point");
  } else if (number > 10 && number <= 15) {
    $(el).addClass("c-type-point");
  } else if (number > 15) {
    $(el).addClass("d-type-point");
  } else {
    $(el).addClass("e-type-point");
  }
}

function openPointPopup(data, el) {
  if (!$(el).next(".point-popup").length) {
    $(el).after(`
      <div class="point-popup close-point-popup" style="top: ${el.offsetTop}px; left: ${el.offsetLeft + el.clientWidth * 1.5}px;">
        <div>${data.number}个贡献：${data.date}</div>
      </div>
    `);
  }
}

function drawMonths(date) {
  let indexOfMonth = date.getMonth();
  for (let m = 0; m < 12; m++) {
    if (indexOfMonth === 12) indexOfMonth = 0;
    $("#cb-chart .top-bar .months").append(`
      <div class="month">${months[indexOfMonth]}</div>
    `);
    indexOfMonth++;
  }
}