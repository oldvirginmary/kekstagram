var Gallery = {
    getPictures: function () {
        var picturesPosts = [];
        var picturesNames = [];
        for (var i = 1; i <= 25; i++) picturesNames.push(i);

        var getUrl = function () {
            var picsDirectory = "photos/";
            return picsDirectory + picturesNames.shift().toString() + ".jpg";
        }

        var getLikes = function () {
            return Math.floor(Math.random() * 185 + 15); // from 15 to 200
        }

        var getComments = function () {
            var variants = [
                "Всё отлично!",
                "В целом всё неплохо. Но не всё.",
                "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
                "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
                "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
                "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!",
            ];

            var numOfComments = Math.floor(Math.random() * 7); // from 0 to 6

            var comments = [];

            for (var i = 0; i < numOfComments; i++) {
                var variant = variants
                    .splice(Math.floor(Math.random() * variants.length), 1)[0];
                comments.push(variant);
            }

            return comments;
        }

        var getDescription = function () {
            var descriptions = [
                "Тестим новую камеру!",
                "Затусили с друзьями на море",
                "Как же круто тут кормят",
                "Отдыхаем...",
                "Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.Не обижайте всех словами......",
                "Вот это тачка!",
            ];

            return descriptions[Math.floor(Math.random() * descriptions.length)];
        }

        while (picturesNames.length > 0) {
            picturesPosts.push({
                url: getUrl(),
                likes: getLikes(),
                comments: getComments(),
                description: getDescription(),
            });
        }

        return picturesPosts;
    },

    renderPictures: function () {
        var pictures = Gallery.getPictures();
        var picturesToRender = pictures.slice();
        var picturesBlock = document.querySelector(".pictures");
        var pictureTemplate = document.querySelector("#picture-template");

        var pictureToElement = function (pictureData) {
            var picture = pictureTemplate
                .content
                .cloneNode(true)
                .querySelector(".picture");

            var pictureLikes = picture.querySelector(".picture-likes");
            var pictureComments = picture.querySelector(".picture-comments");
            var pictureImg = picture.querySelector("img");

            picture.setAttribute("href", "#");
            pictureImg.setAttribute("src", pictureData.url);
            pictureLikes.textContent = pictureData.likes;
            pictureComments.textContent = pictureData.comments.length;

            picture.addEventListener("click", function () {
                Gallery.renderGalleryOverlay(pictureData);
            });

            return picture;
        }

        for (var i = 0; i < pictures.length; i++) {
            picturesBlock.appendChild(pictureToElement(
                picturesToRender.splice([Math.floor(Math.random() * picturesToRender.length)], 1)[0]));
        }
    },

    renderGalleryOverlay: function (pictureData) {
        var body = document.querySelector("body");
        var overlay = document.querySelector(".gallery-overlay");
        var overlayContainer = document.querySelector(".gallery-overlay-container");
        var commentsList = document.querySelector(".gallery-overlay-comments-list");

        var openGalleryOverlay = function () {
            var renderComments = function (comments) {
                var currentCommentsCount = document.querySelector(".comments-count-current");
                var commentsCount = document.querySelector(".comments-count");
                var commentTemplate = document.querySelector("#comment-template");

                currentCommentsCount.textContent = 0;
                commentsCount.textContent = pictureData.comments.length;

                var render = function (comments) {
                    for (var i = 0; i < comments.length; i++) {
                        var comment = commentTemplate
                            .content
                            .cloneNode(true)
                            .querySelector(".gallery-overlay-comment");
                        var commentText = comment.querySelector(".gallery-overlay-comment-text");
                        var commentAvatar = comment.querySelector(".gallery-overlay-comment-avatar");

                        commentText.textContent = comments[i];
                        commentAvatar.setAttribute(
                            "src",
                            "img/" + "avatar-"
                            + Math.ceil(Math.random() * 6).toString()
                            + ".svg"
                        );

                        commentsList.appendChild(comment);
                    }

                    currentCommentsCount.textContent =
                        Number(currentCommentsCount.textContent) + comments.length;
                }

                var renderNext = function (toLoad) {
                    if (comments.length < toLoad) toLoad = comments.length;
                    render(comments.splice(0, toLoad));
                }

                var addLoadMoreBtn = function () {
                    if (comments.length > 5) {
                        var btn = document.createElement("button");
                        btn.classList.add("gallery-overlay-loadmore");
                        btn.setAttribute("type", "button");
                        btn.textContent = "Загрузить ещё";

                        commentsList.after(btn);

                        btn.addEventListener("click", function () {
                            renderNext(5);
                            if (comments.length === 0) document.querySelector(".gallery-overlay-loadmore").remove();
                        });
                    }
                }

                addLoadMoreBtn();
                renderNext(5);
            }

            var picture = overlay.querySelector(".gallery-overlay-image");
            var description = overlay.querySelector(".gallery-overlay-description-text");
            var likes = overlay.querySelector(".likes-count");

            picture.setAttribute("src", pictureData.url);
            description.textContent = pictureData.description;
            likes.textContent = pictureData.likes;

            renderComments(pictureData.comments.slice());

            body.classList.add("modal-open");
            overlay.classList.remove("hidden");
        }

        var closeGalleryOverlay = function () {
            var loadMoreBtn = document.querySelector(".gallery-overlay-loadmore");

            if (loadMoreBtn) loadMoreBtn.remove();

            while (commentsList.firstChild) {
                commentsList.removeChild(commentsList.firstChild);
            }

            overlay.classList.add("hidden");
            body.classList.remove("modal-open");
            commentsList.classList.remove("loaded");
        }

        overlay.addEventListener("click", function (evt) {
            if (!evt.path.includes(overlayContainer) && !overlay.classList.contains("hidden")) {
                closeGalleryOverlay();
            }
        });

        window.addEventListener("keydown", function (evt) {
            if (evt.code === "Escape" && !overlay.classList.contains("hidden")) {
                closeGalleryOverlay();
            }
        });

        openGalleryOverlay();
    }
}

var Upload = {
    openOverlay: function () {
        var overlay = document.querySelector("#upload-template")
            .content
            .cloneNode(true)
            .querySelector(".upload-overlay");

        var setOverlay = function () {
            var setScaleControll = function () {
                var scaleLevel = overlay.querySelector(".upload-resize-controls");

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
                var filterControls = overlay.querySelector(".upload-effect-controls");
                var filterLevel = overlay.querySelector(".upload-effect-level");
                var levelLine = overlay.querySelector(".upload-effect-level-line");

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
                    var allLine = overlay.querySelector(".upload-effect-level-line");
                    var pin = overlay.querySelector(".upload-effect-level-pin");
                    var filterValue = overlay.querySelector(".upload-effect-level-val");
                    var linePosX = Math.round(allLine.getBoundingClientRect().x);
                    var lineWidth = allLine.getBoundingClientRect().width;
                    var pinValue = (evt.clientX - linePosX) / (lineWidth / 100); // in percentages

                    pin.style.left = pinValue.toString() + "%";
                    filterValue.style.width = pinValue.toString() + "%";

                    applyFilter();
                }

                var onChangeFilter = function (evt) {
                    applyDefaultFilterValue();
                    applyFilter(evt);
                }

                applyDefaultFilterValue();

                filterControls.addEventListener("change", onChangeFilter);
                levelLine.addEventListener("click", onMovePin);

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

    loadOverlay: function () {
        var pictureField = document.querySelector("#upload-file");
        pictureField.addEventListener("change", Upload.openOverlay);
    },
}

Gallery.getPictures();
Gallery.renderPictures();

Upload.loadOverlay();