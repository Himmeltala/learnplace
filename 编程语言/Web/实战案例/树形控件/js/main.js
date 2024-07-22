let iconSize = 14;
let iconFillColor = "#606060";

const unfoldIcon = `<svg class="unfold-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}"><path d="M326.9 67l446.6 447.7-446.6 447.5-76.2-76.3 370.5-371.2-370.5-371.4L326.9 67z m0 0" fill="${iconFillColor}"></path></svg>`;
const foldIcon = `<svg class="fold-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}"><path d="M959.7 293.8L534.4 718.1c-12.4 12.4-32.6 12.4-45 0L64.2 293.8l76.4-76.2 371.3 370.6 371.5-370.6 76.3 76.2z m0 0" fill="${iconFillColor}"></path></svg>`;

function strToBool(str) {
  return str !== "false";
}

function boolToStr(bool) {
  return bool === false ? "false" : "true";
}

function rendTreeOcx(data, enableFold) {
  let template = `<ul class="tree-ocx-ul">`;
  if (enableFold) template = `<ul class="tree-ocx-ul tree-ocx-ul-enable-fold">`;

  for (let i = 0; i < data.length; i++) {
    if (data[i].child) {
      template += `
          <li class="tree-ocx-li tree-ocx-li-enable-fold" data-is-folded="false">
            <div class="tree-ocx-tip">
              <div class="tree-ocx-tip-wrap">
                ${unfoldIcon}
                <div>${data[i].tip}</div>
              </div>
            </div>
            ${rendTreeOcx(data[i].child, true)}
        `;
    } else {
      template += `
          <li class="tree-ocx-li">
            <div class="tree-ocx-tip tree-ocx-tip-normal">${data[i].tip}</div>
        `;
    }
    template += `</li>`;
  }
  template += `</ul>`;
  return template;
}

function foldOrUnFoldTree() {
  $(".tree-ocx-li").on("click", function(e) {
    e.stopPropagation();

    let isFolded = strToBool($(this)[0].dataset.isFolded);
    if (isFolded === false) {
      $(this).css({
        "--tree-ocx-tip-height": `${$(this).children(".tree-ocx-tip").height()}px`,
        "--tree-ocx-li-height": `${$(this).children(".tree-ocx-ul-enable-fold").height()}px`
      });
      $(this).children(".tree-ocx-tip").children(".tree-ocx-tip-wrap").children(".unfold-icon").remove();
      $(this).children(".tree-ocx-tip").children(".tree-ocx-tip-wrap").prepend(foldIcon);
      $(this).removeClass("tree-ocx-li-unfold-active");
      $(this).addClass("tree-ocx-li-enable-fold-active");
      $(this).children(".tree-ocx-ul-enable-fold").addClass("tree-ocx-ul-enable-fold-active");
      $(this).children(".tree-ocx-ul-enable-fold").removeClass("tree-ocx-ul-unfold-active");
    } else {
      $(this).children(".tree-ocx-tip").children(".tree-ocx-tip-wrap").children(".fold-icon").remove();
      $(this).children(".tree-ocx-tip").children(".tree-ocx-tip-wrap").prepend(unfoldIcon);
      $(this).addClass("tree-ocx-li-unfold-active");
      $(this).removeClass("tree-ocx-li-enable-fold-active");
      $(this).children(".tree-ocx-ul-enable-fold").removeClass("tree-ocx-ul-enable-fold-active");
      $(this).children(".tree-ocx-ul-enable-fold").addClass("tree-ocx-ul-unfold-active");
    }
    $(this)[0].dataset.isFolded = boolToStr(!isFolded);
  });
}
