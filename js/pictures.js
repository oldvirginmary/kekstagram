"use strict";

let setGalleryOverlay = () => {
    let body = document.querySelector("body");
    let overlay = document.querySelector(".gallery-overlay");
    let overlayContainer = document.querySelector(".gallery-overlay-container");
    let commentsList = document.querySelector(".gallery-overlay-comments-list");

    window.openGalleryOverlay = (pictureData) => {
        let renderComments = (comments) => {
            let currentCommentsCount = document.querySelector(".comments-count-current");
            let commentsCount = document.querySelector(".comments-count");
            let commentTemplate = document.querySelector("#comment-template");

            currentCommentsCount.textContent = 0;
            commentsCount.textContent = pictureData.comments.length;

            let render = (comments) => {
                for (let i = 0; i < comments.length; i++) {
                    let comment = commentTemplate
                        .content
                        .cloneNode(true)
                        .querySelector(".gallery-overlay-comment");
                    let commentText = comment.querySelector(".gallery-overlay-comment-text");
                    let commentAvatar = comment.querySelector(".gallery-overlay-comment-avatar");

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

            let renderNext = (toLoad) => {
                if (comments.length < toLoad) toLoad = comments.length;
                render(comments.splice(0, toLoad));
            }

            let addLoadMoreBtn = () => {
                if (comments.length > 5) {
                    let btn = document.createElement("button");
                    btn.classList.add("gallery-overlay-loadmore");
                    btn.setAttribute("type", "button");
                    btn.textContent = "Загрузить ещё";

                    commentsList.after(btn);

                    btn.addEventListener("click", () => {
                        renderNext(5);
                        if (comments.length === 0) document.querySelector(".gallery-overlay-loadmore").remove();
                    });
                }
            }

            addLoadMoreBtn();
            renderNext(5);
        }

        let picture = document.querySelector(".gallery-overlay-image");
        let description = document.querySelector(".gallery-overlay-description-text");
        let likes = document.querySelector(".likes-count");

        picture.setAttribute("src", pictureData.url);
        description.textContent = pictureData.description;
        likes.textContent = pictureData.likes;

        renderComments(pictureData.comments.slice());

        body.classList.add("modal-open");
        overlay.classList.remove("hidden");
    }

    window.closeGalleryOverlay = () => {
        let loadMoreBtn = document.querySelector(".gallery-overlay-loadmore");

        if (loadMoreBtn) loadMoreBtn.remove();

        while (commentsList.firstChild) {
            commentsList.removeChild(commentsList.firstChild);
        }
        
        overlay.classList.add("hidden");
        body.classList.remove("modal-open");
        commentsList.classList.remove("loaded");
    }

    overlay.addEventListener("click", (evt) => {
        if (!evt.path.includes(overlayContainer) && !overlay.classList.contains("hidden")) {
            window.closeGalleryOverlay();
        }
    });
    
    window.addEventListener("keydown", (evt) => {
        if (evt.code === "Escape" && !overlay.classList.contains("hidden")) {
            window.closeGalleryOverlay();
        }
    });
}

let setUploadOverlay = () => {
    let body = document.querySelector("body");
    let overlay = document.querySelector(".upload-overlay");
    let overlayContainer = document.querySelector(".upload-effect-container");
    let uploadCancelBtn = document.querySelector(".upload-form-cancel");

    let uploadForm = document.querySelector("#upload-select-image");
    let pictureField = document.querySelector("#upload-file");

    window.openUploadOverlay = () => {
        let reader = new FileReader();
        let previewImage = document.querySelector(".effect-image-preview");

        reader.addEventListener("load", () => {
            previewImage.setAttribute("src", reader.result);
        });

        reader.readAsDataURL(pictureField.files[0]);

        body.classList.add("modal-open");
        overlay.classList.remove("hidden");
    }

    window.closeUploadOverlay = () => {
        overlay.classList.add("hidden");
        body.classList.remove("modal-open");
        uploadForm.reset();
    }

    overlay.addEventListener("click", (evt) => {
        if (evt.target === uploadCancelBtn) {
            window.closeUploadOverlay();
        }
    });

    overlay.addEventListener("click", (evt) => {
        if (!evt.path.includes(overlayContainer) && !overlay.classList.contains("hidden")) {
            window.closeUploadOverlay();
        }
    });

    window.addEventListener("keydown", (evt) => {
        if (evt.code === "Escape" && !overlay.classList.contains("hidden")) {
            window.closeUploadOverlay();
        }
    });
}

let getPictures = () => {
    let picturesPosts = [];
    let picturesNames = [];
    for (let i = 1; i <= 25; i++) picturesNames.push(i);

    let getUrl = () => {
        let picsDirectory = "photos/";
        return picsDirectory + picturesNames.shift().toString() + ".jpg";
    }

    let getLikes = () => {
        return Math.floor(Math.random() * 185 + 15); // from 15 to 200
    }

    let getComments = () => {
        let variants = [
            "Всё отлично!",
            "В целом всё неплохо. Но не всё.",
            "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
            "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
            "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
            "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!",
        ];

        let numOfComments = Math.floor(Math.random() * 7); // from 0 to 6

        let comments = [];

        for (let i = 0; i < numOfComments; i++) {
            let variant = variants
                .splice(Math.floor(Math.random() * variants.length), 1)[0];
            comments.push(variant);
        }

        return comments;
    }

    let getDescription = () => {
        let descriptions = [
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

let renderPictures = (pictures) => {
    let picturesBlock = document.querySelector(".pictures");
    let pictureTemplate = document.querySelector("#picture-template");

    while (pictures.length > 0) {
        let pictureData = pictures
            .splice([Math.floor(Math.random() * pictures.length)], 1)[0];

        let picture = pictureTemplate
            .content
            .cloneNode(true)
            .querySelector(".picture");

        let pictureLikes = picture.querySelector(".picture-likes");
        let pictureComments = picture.querySelector(".picture-comments");
        let pictureImg = picture.querySelector("img");

        picture.setAttribute("href", "#");
        pictureImg.setAttribute("src", pictureData.url);
        pictureLikes.textContent = pictureData.likes;
        pictureComments.textContent = pictureData.comments.length;

        picture.addEventListener("click", () => {
            window.openGalleryOverlay(pictureData);
        });

        picturesBlock.appendChild(picture);
    }
}

let renderUploadForm = () => {
    let pictureField = document.querySelector("#upload-file");
    
    pictureField.addEventListener("change", () => {
        window.openUploadOverlay();
    });
}


setGalleryOverlay();
setUploadOverlay();

renderPictures(getPictures());
renderUploadForm();

