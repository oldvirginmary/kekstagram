var Upload = {
    openOverlay: function () {
        var overlay = document.querySelector("#upload-template")
            .content
            .cloneNode(true)
            .querySelector(".upload-overlay");

        var setOverlay = function () {
            var setScaleControll = function () {
                var scaleLevel = overlay.querySelector(".upload-resize-controls");

                var scaleLevelShow = function () {
                    var scaleLevel = document.querySelector(".upload-resize-controls");

                    scaleLevel.classList.remove("transition-hide");
                    scaleLevel.classList.add("transition-show");
                }

                var scaleLevelHide = function () {
                    var scaleLevel = document.querySelector(".upload-resize-controls");

                    scaleLevel.classList.remove("transition-show");
                    scaleLevel.classList.add("transition-hide");
                }

                var onScaleLevelMouseup = function (evt) {
                    var previewImage = document.querySelector(".effect-image-preview");
                    var scaleLevel = document.querySelector(".upload-resize-controls");
                    var scaleLevelValue = scaleLevel.querySelector(".upload-resize-controls-value");
                    var scaleLevelUp = scaleLevel.querySelector(".upload-resize-controls-button-inc");
                    var scaleLevelDown = scaleLevel.querySelector(".upload-resize-controls-button-dec");

                    var scaleCurrentValue = Number(scaleLevelValue.value.slice(0, -1));
                    var scaleNewValue = scaleCurrentValue;
                    var step = 25; // in percentages

                    if (evt.target === scaleLevelUp) scaleNewValue += step;
                    if (evt.target === scaleLevelDown) scaleNewValue -= step;

                    scaleLevelValue.value = scaleNewValue.toString() + "%";
                    previewImage.style.transform = "scale(" + (scaleNewValue / 100).toString() + ")";
                }

                scaleLevel.addEventListener("mouseup", onScaleLevelMouseup);

                scaleLevel.addEventListener("mouseenter", scaleLevelShow);
                scaleLevel.addEventListener("mouseleave", scaleLevelHide);
            }

            var setFilterControll = function () {
                var filterLevelShow = function () {
                    var filterLevel = document.querySelector(".upload-effect-level");
                    var noEffectChecked = document.querySelector("#upload-effect-none:checked");

                    if (!noEffectChecked) {
                        filterLevel.classList.remove("transition-hide");
                        filterLevel.classList.add("transition-show");
                    }
                }

                var filterLevelHide = function () {
                    var filterLevel = document.querySelector(".upload-effect-level");

                    filterLevel.classList.remove("transition-show");
                    filterLevel.classList.add("transition-hide");
                }

                var applyDefaultFilterValue = function () {
                    var pin = overlay.querySelector(".upload-effect-level-pin");
                    var filterValue = overlay.querySelector(".upload-effect-level-val");

                    pin.style.left = "30%";
                    filterValue.style.width = "30%";
                }

                var applyFilter = function (evt) {
                    var previewImage = overlay.querySelector(".effect-image-preview");
                    var currentFilter = overlay.querySelector("input[name='effect']:checked");
                    var noEffectFilter = overlay.querySelector("#upload-effect-none");
                    var pin = overlay.querySelector(".upload-effect-level-pin");
                    var pinValue = Number(pin.style.left.slice(0, -1));

                    if (evt) {
                        if (evt.target === noEffectFilter) {
                            filterLevelHide();
                        } else {
                            filterLevelShow();
                        }
                    }

                    var filters = {
                        grayscale: {
                            level: [0, 1],
                            unit: "",
                        },
                        sepia: {
                            level: [0, 1],
                            unit: "",
                        },
                        invert: {
                            level: [0, 100],
                            unit: "%",
                        },
                        blur: {
                            level: [0, 3],
                            unit: "px",
                        },
                        brightness: {
                            level: [1, 3],
                            unit: "",
                        }
                    }

                    for (var filter in filters) {
                        filters[filter].step = (filters[filter].level[1] - filters[filter].level[0]) / 100;
                    }

                    switch (currentFilter.value) {
                        case "none":
                            previewImage.style.filter = "none";
                            break;
                        case "chrome":
                            previewImage.style.filter = "grayscale(" + (filters.grayscale.step * pinValue).toString() +
                                filters.grayscale.unit + ")";
                            break;
                        case "sepia":
                            previewImage.style.filter = "sepia(" + (filters.sepia.step * pinValue).toString() +
                                filters.sepia.unit + ")";
                            break;
                        case "marvin":
                            previewImage.style.filter = "invert(" + (filters.invert.step * pinValue).toString() +
                                filters.invert.unit + ")";
                            break;
                        case "phobos":
                            previewImage.style.filter = "blur(" + (filters.blur.step * pinValue).toString() +
                                filters.blur.unit + ")";
                            break;
                        case "heat":
                            previewImage.style.filter = "brightness(" + (filters.brightness.step * pinValue).toString() +
                                filters.brightness.unit + ")";
                            break;
                    }
                }

                var onMovePin = function (evt) {
                    var pin = overlay.querySelector(".upload-effect-level-pin");
                    var levelLine = overlay.querySelector(".upload-effect-level-line");

                    evt.preventDefault();

                    var pinMove = function (evt) {
                        var allLine = overlay.querySelector(".upload-effect-level-line");
                        var filterValue = overlay.querySelector(".upload-effect-level-val");
                        var linePosX = Math.round(allLine.getBoundingClientRect().x);
                        var lineWidth = allLine.getBoundingClientRect().width;
                        var pinValue = (evt.clientX - linePosX) / (lineWidth / 100); // in percentages

                        evt.preventDefault();

                        if (pinValue > 100) {
                            pinValue = 100;
                        } else if (pinValue < 0) {
                            pinValue = 0;
                        }
                        
                        pin.style.left = pinValue.toString() + "%";
                        filterValue.style.width = pinValue.toString() + "%";

                        applyFilter();
                    }

                    var onMouseUp = function () {
                        overlay.removeEventListener("mousemove", pinMove);
                        overlay.removeEventListener("mouseup", onMouseUp);
                    }

                    if (evt.target === pin) {
                        overlay.addEventListener("mousemove", pinMove);
                        overlay.addEventListener("mouseup", onMouseUp);
                    } else if (evt.path.includes(levelLine)) {
                        pinMove(evt);
                    }
                }

                var onChangeFilter = function (evt) {
                    applyDefaultFilterValue();
                    applyFilter(evt);
                }

                applyDefaultFilterValue();

                var filterControls = overlay.querySelector(".upload-effect-controls");
                var filterLevel = overlay.querySelector(".upload-effect-level");

                filterControls.addEventListener("change", onChangeFilter);
                filterLevel.addEventListener("mousedown", onMovePin);

                filterLevel.addEventListener("mouseenter", filterLevelShow);
                filterLevel.addEventListener("mouseleave", filterLevelHide);
            }

            var setOverlayEvents = function () {
                var uploadForm = document.querySelector(".upload-form");

                overlay.addEventListener("click", function (evt) {
                    var uploadCancelBtn = document.querySelector(".upload-form-cancel");
                    var overlayContainer = document.querySelector(".upload-effect-container");

                    if (uploadForm.querySelector(".upload-overlay") && !evt.path.includes(overlayContainer)) {
                        Upload.closeOverlay();
                    } else if (evt.target === uploadCancelBtn) {
                        Upload.closeOverlay();
                    }
                });

                window.addEventListener("keydown", function (evt) {
                    if (uploadForm.querySelector(".upload-overlay") && evt.code === "Escape") {
                        Upload.closeOverlay();
                    }
                });
            }

            setScaleControll();
            setFilterControll();
            setOverlayEvents();
        }

        var renderOverlay = function () {
            var body = document.querySelector("body");
            var uploadForm = document.querySelector(".upload-form");
            var pictureField = uploadForm.querySelector("#upload-file");
            var reader = new FileReader();

            reader.addEventListener("load", function (evt) {
                var previewImage = uploadForm.querySelector(".effect-image-preview");
                previewImage.setAttribute("src", evt.currentTarget.result);
            });

            reader.readAsDataURL(pictureField.files[0]);

            body.classList.add("modal-open");
            uploadForm.append(overlay);
        }

        setOverlay();
        renderOverlay();
    },

    closeOverlay: function () {
        var body = document.querySelector("body");
        var uploadForm = document.querySelector(".upload-form");
        var overlay = uploadForm.querySelector(".upload-overlay");

        overlay.remove();
        body.classList.remove("modal-open");

        uploadForm.reset();
    },

    setOverlayOpening: function () {
        var pictureField = document.querySelector("#upload-file");
        pictureField.addEventListener("change", Upload.openOverlay);
    },
}