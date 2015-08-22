(function () {
    "user strict";

    angular
        .module("common.services")
        .factory("modelResource",
            ["$resource",
                "appSettings",
                modelResource])

    function modelResource($resource, appSettings) {
        return {
            getAll: $resource(appSettings.serverPath + "/modelinfo/getall", {},
                { 'query': { method: 'GET', isArray: false } }),
            getFactorByModelId: $resource(appSettings.serverPath + "/modelinfo/view/", {},
                { 'query': { method: 'POST', isArray: false } })
        }
        //return $resource(appSettings.serverPath + "/modelinfo/getall/:id", null, null);
    }
})();