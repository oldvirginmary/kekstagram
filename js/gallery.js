var Gallery = {
    renderPictures: function () {
        var onGetPictures = function (pictures) {
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
        }

        var onFailGetPictures = function (xhr) {
            console.log("Ошибка:", xhr);
        }

        window.download("https://javascript.pages.academy/kekstagram/data", onGetPictures, onFailGetPictures);
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
                            
                        var commentAuthor = comment.querySelector(".gallery-overlay-comment-author");
                        var commentText = comment.querySelector(".gallery-overlay-comment-text");
                        var commentAvatar = comment.querySelector(".gallery-overlay-comment-avatar");

                        commentAuthor.textContent = comments[i]["name"];
                        commentText.textContent = comments[i]["message"];
                        commentAvatar.setAttribute("src", comments[i]["avatar"]);

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