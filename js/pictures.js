var setGalleryOverlay = function () {
    var body = document.querySelector("body");
    var overlay = document.querySelector(".gallery-overlay");
    var overlayContainer = document.querySelector(".gallery-overlay-container");
    var commentsList = document.querySelector(".gallery-overlay-comments-list");

    window.openGalleryOverlay = function (pictureData) {
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

        var picture = document.querySelector(".gallery-overlay-image");
        var description = document.querySelector(".gallery-overlay-description-text");
        var likes = document.querySelector(".likes-count");

        picture.setAttribute("src", pictureData.url);
        description.textContent = pictureData.description;
        likes.textContent = pictureData.likes;

        renderComments(pictureData.comments.slice());

        body.classList.add("modal-open");
        overlay.classList.remove("hidden");
    }

    window.closeGalleryOverlay = function () {
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
            window.closeGalleryOverlay();
        }
    });
    
    window.addEventListener("keydown", function (evt) {
        if (evt.code === "Escape" && !overlay.classList.contains("hidden")) {
            window.closeGalleryOverlay();
        }
    });
}

var setUploadOverlay = function () {
    var body = document.querySelector("body");
    var overlay = document.querySelector(".upload-overlay");
    var overlayContainer = document.querySelector(".upload-effect-container");
    var uploadCancelBtn = document.querySelector(".upload-form-cancel");

    var uploadForm = document.querySelector("#upload-select-image");
    var effectLevel = document.querySelector(".upload-effect-level");

    window.openUploadOverlay = function () {
        var setPreview = function () {
            var reader = new FileReader();
            var pictureField = document.querySelector("#upload-file");

            reader.addEventListener("load", function () {
                var previewImage = document.querySelector(".effect-image-preview");
                previewImage.setAttribute("src", reader.result);
            });
            reader.readAsDataURL(pictureField.files[0]);
        }

        var setEffects = function () {
            var effectControls = document.querySelector(".upload-effect-controls");

            effectControls.addEventListener("change", function (evt) {
                if (evt.target.id === "upload-effect-none") {
                    effectLevel.classList.add("hidden");
                } else {
                    effectLevel.classList.remove("hidden");
                }
            });
        }

        setPreview();
        setEffects();

        body.classList.add("modal-open");
        overlay.classList.remove("hidden");
    }

    window.closeUploadOverlay = function () {
        overlay.classList.add("hidden");
        body.classList.remove("modal-open");

        uploadForm.reset();
        effectLevel.classList.add("hidden");
    }

    overlay.addEventListener("click", function (evt) {
        if (evt.target === uploadCancelBtn) {
            window.closeUploadOverlay();
        }
    });

    overlay.addEventListener("click", function (evt) {
        if (!evt.path.includes(overlayContainer) && !overlay.classList.contains("hidden")) {
            window.closeUploadOverlay();
        }
    });

    window.addEventListener("keydown", function (evt) {
        if (evt.code === "Escape" && !overlay.classList.contains("hidden")) {
            window.closeUploadOverlay();
        }
    });
}

var getPictures = function () {
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
}

var renderPictures = function (pictures) {
    var picturesBlock = document.querySelector(".pictures");
    var pictureTemplate = document.querySelector("#picture-template");

    while (pictures.length > 0) {
        var pictureData = pictures
            .splice([Math.floor(Math.random() * pictures.length)], 1)[0];

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
            window.openGalleryOverlay(pictureData);
        });

        console.log(picture);

        picturesBlock.appendChild(picture);
    }
}

var renderUploadForm = function () {
    var pictureField = document.querySelector("#upload-file");
    var effectLevelLine = document.querySelector(".upload-effect-level-line");
    var effectLevelPin = document.querySelector(".upload-effect-level-pin");
    var effectLevelValue = document.querySelector(".upload-effect-level-val");

    effectLevelLine.addEventListener("mouseup", (evt) => {
        var effectLinePosX = Math.round(effectLevelLine.getBoundingClientRect().x);
        var effectLineWidth = effectLevelLine.getBoundingClientRect().width;
        var effectValue = (evt.clientX - effectLinePosX) / (effectLineWidth / 100);

        effectLevelPin.style.left = effectValue.toString() + "%";
        effectLevelValue.style.width = effectValue.toString() + "%";
    });

    pictureField.addEventListener("change", function () {
        window.openUploadOverlay();
    });
}


setGalleryOverlay();
setUploadOverlay();

renderPictures(getPictures());
renderUploadForm();

