var Gallery = {
    pictures: [],

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

        Gallery.pictures = picturesPosts;
    },

    renderPictures: function () {
        var picturesToRender = Gallery.pictures.slice();
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

        for (var i = 0; i < Gallery.pictures.length; i++) {
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
    setUploadOverlay: function () {
        var pictureField = document.querySelector("#upload-file");

        pictureField.addEventListener("change", function () {
            Upload.renderUploadOverlay();
        });
    },

    renderUploadOverlay: function () {
        var overlay = document.querySelector(".upload-overlay");

        var openUploadOverlay = function () {
            var body = document.querySelector("body");

            var setPreview = function () {
                var pictureField = document.querySelector("#upload-file");
                var reader = new FileReader();

                reader.addEventListener("load", function () {
                    var previewImage = document.querySelector(".effect-image-preview");
                    previewImage.setAttribute("src", reader.result);
                });
                reader.readAsDataURL(pictureField.files[0]);
            }

            setPreview();

            body.classList.add("modal-open");
            overlay.classList.remove("hidden");
        }

        var closeUploadOverlay = function () {
            var body = document.querySelector("body");
            var uploadForm = document.querySelector("#upload-select-image");
            var filterLevelPin = document.querySelector(".upload-effect-level-pin");
            var filterLevelValue = document.querySelector(".upload-effect-level-val");

            overlay.classList.add("hidden");
            body.classList.remove("modal-open");

            uploadForm.reset();

            filterLevelPin.style.left = "50%";
            filterLevelValue.style.width = "50%";
        }

        var setScaleControll = function () {
            var scaleLevel = document.querySelector(".upload-resize-controls");

            scaleLevel.addEventListener("mouseenter", scaleLevelShow);
            scaleLevel.addEventListener("mouseleave", scaleLevelHide);

            scaleLevel.addEventListener("mouseup", function (evt) {
                var previewImage = document.querySelector(".effect-image-preview");
                var scaleLevelValue = scaleLevel.querySelector(".upload-resize-controls-value");
                var scaleLevelUp = scaleLevel.querySelector(".upload-resize-controls-button-inc");
                var scaleLevelDown = scaleLevel.querySelector(".upload-resize-controls-button-dec");

                var scaleCurrentValue = Number(scaleLevelValue.value.slice(0, -1));
                var scaleNewValue = scaleCurrentValue;
                var step = 25; // percent

                if (evt.target === scaleLevelUp) scaleNewValue += step;
                if (evt.target === scaleLevelDown) scaleNewValue -= step;

                scaleLevelValue.value = scaleNewValue.toString() + "%";

                previewImage.style = "transform: scale(" + (scaleNewValue / 100).toString() + ");\"";
            });
        }

        var setFilterControll = function () {
            var filterLevel = document.querySelector(".upload-effect-level");
            var filterLevelLine = document.querySelector(".upload-effect-level-line");

            filterLevel.addEventListener("mouseenter", filterLevelShow);
            filterLevel.addEventListener("mouseleave", filterLevelHide);

            filterLevelLine.addEventListener("click", function (evt) {
                var filterLevelPin = document.querySelector(".upload-effect-level-pin");
                var filterLevelValue = document.querySelector(".upload-effect-level-val");

                var filterLinePosX = Math.round(filterLevelLine.getBoundingClientRect().x);
                var filterLineWidth = filterLevelLine.getBoundingClientRect().width;
                var filterValue = (evt.clientX - filterLinePosX) / (filterLineWidth / 100);

                filterLevelPin.style.left = filterValue.toString() + "%";
                filterLevelValue.style.width = filterValue.toString() + "%";
            });
        }

        var setFilterSwitch = function () {
            var filterControls = document.querySelector(".upload-effect-controls");

            filterControls.addEventListener("change", function (evt) {
                var noEffect = document.querySelector("#upload-effect-none");

                if (evt.target === noEffect) {
                    filterLevelHide();
                } else {
                    filterLevelShow();
                }
            });
        }

        overlay.addEventListener("click", function (evt) {
            var uploadCancelBtn = document.querySelector(".upload-form-cancel");

            if (evt.target === uploadCancelBtn) {
                closeUploadOverlay();
            }
        });

        overlay.addEventListener("click", function (evt) {
            var overlayContainer = document.querySelector(".upload-effect-container");

            if (!evt.path.includes(overlayContainer) && !overlay.classList.contains("hidden")) {
                closeUploadOverlay();
            }
        });

        window.addEventListener("keydown", function (evt) {
            if (evt.code === "Escape" && !overlay.classList.contains("hidden")) {
                closeUploadOverlay();
            }
        });

        setScaleControll();
        setFilterControll();
        setFilterSwitch();

        openUploadOverlay();
    }
}

Gallery.getPictures();
Gallery.renderPictures();

Upload.setUploadOverlay();