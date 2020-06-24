/* Effect level */

function filterLevelShow() {
    var filterLevel = document.querySelector(".upload-effect-level");
    var noEffectChecked = document.querySelector("#upload-effect-none:checked");

    if (!noEffectChecked) {
        filterLevel.classList.remove("transition-hide");
        filterLevel.classList.add("transition-show");
    }
}

function filterLevelHide() {
    var filterLevel = document.querySelector(".upload-effect-level");

    filterLevel.classList.remove("transition-show");
    filterLevel.classList.add("transition-hide");
}


/* Scale level */

function scaleLevelShow() {
    var scaleLevel = document.querySelector(".upload-resize-controls");

    scaleLevel.classList.remove("transition-hide");
    scaleLevel.classList.add("transition-show");
}

function scaleLevelHide() {
    var scaleLevel = document.querySelector(".upload-resize-controls");

    scaleLevel.classList.remove("transition-show");
    scaleLevel.classList.add("transition-hide");
}