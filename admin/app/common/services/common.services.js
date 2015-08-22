(function () {
    "use strict;"

    angular
        .module("common.services", ["ngResource"])
        .constant("appSettings", {
            serverPath: "http://10.15.171.35:8080"
        });
}());