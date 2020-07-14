(function () {
    window.uploadStatus = new Object();

    window.uploadStatus.renderSuccessStatus = function () {
        var uploadForm = document.querySelector(".upload-form");
        var message = document.querySelector("#upload-message-template")
            .cloneNode(true).content
            .querySelector(".upload-message");
        var messageText = message.querySelector(".upload-message-text");

        messageText.innerText = "Сохранено";

        uploadForm.append(message);

        UploadOverlay.close();
    }

    window.uploadStatus.renderFailStatus = function (xhr) {
        var uploadForm = document.querySelector(".upload-form");
        var message = document.querySelector("#upload-message-template")
            .cloneNode(true).content
            .querySelector(".upload-message");
        var messageIcon = message.querySelector(".upload-message-icon");
        var messageSupport = message.querySelector(".upload-message-support");
        var messageText = message.querySelector(".upload-message-text");

        messageIcon.classList.remove("hidden");
        messageSupport.classList.remove("hidden");
        messageText.innerText = "Ошибка загрузки";

        console.log("Ошибка загрузки: ", xhr);

        uploadForm.append(message);

        UploadOverlay.close();
    }
})();