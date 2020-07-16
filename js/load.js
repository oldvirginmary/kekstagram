(function () {
    "use strict";
    
    window.load = new Object();

    window.load.download = function (url, onSuccess, onFail) {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", url);

        xhr.responseType = "json";

        xhr.addEventListener("load", function () {
            switch (xhr.status) {
                case 200:
                    onSuccess(xhr.response);
                    break;
                default:
                    onFail(xhr);
            }
        });

        xhr.addEventListener("timeout", function () {
            onFail(xhr);
        });

        xhr.addEventListener("error", function () {
            onFail(xhr);
        });

        xhr.send();
    }

    window.load.upload = function (url, onSuccess, onFail, form) {
        var xhr = new XMLHttpRequest();

        xhr.open("POST", url);

        xhr.addEventListener("load", function () {
            switch (xhr.status) {
                case 200:
                    onSuccess(xhr.response);
                    break;
                default:
                    onFail(xhr);
            }
        });

        xhr.addEventListener("timeout", function () {
            onFail(xhr);
        });

        xhr.addEventListener("error", function () {
            onFail(xhr);
        });

        xhr.send(new FormData(form));
    }
})();
