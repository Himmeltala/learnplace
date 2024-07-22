function strToBool(str) {
  return str !== "false";
}

function boolToStr(bool) {
  return bool === false ? "false" : "true";
}

$(".collapse > .header").on("click", function() {
  let $collapseBody = $(this).parent().find(".body");
  let $collapseIcon = $(this).children(".ctrl-icon").find("svg");
  let collapseIsFold = strToBool($collapseBody[0].dataset.isFold);
  if (!collapseIsFold) {
    $collapseBody.removeClass("fold-collapse");
    $collapseBody.addClass("unfold-collapse");
    $collapseIcon.css({ transform: `rotate(90deg) scaleX(1)` });
  } else {
    $collapseBody.removeClass("unfold-collapse");
    $collapseBody.addClass("fold-collapse");
    $collapseIcon.css({ transform: `rotate(0deg) scaleX(1)` });
  }
  $collapseBody[0].dataset.isFold = boolToStr(!collapseIsFold);
});
