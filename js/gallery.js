var Gallery = {
    getMockPictures: function () {
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
        var pictures = Gallery.getMockPictures();
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