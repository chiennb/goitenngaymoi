(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "modelServices",
                     ModelListCtrl]);

    function ModelListCtrl($scope, $http, $state, appSettings, shareServices, popupService, modelServices) {

        $scope.models = [];

        $scope.email = '';
        $scope.status = '';
        $scope.floor = 1;
        $scope.page = 12;

        // //-----------paging--------------
        // $scope.totalItems = 0;
        // $scope.currentPage = 1;
        // $scope.maxSize = 20;
        // $scope.itemsPerPage = 10;
        // $scope.pageChanged = function () {
        //     $scope.getModelPage($scope.currentPage, $scope.itemsPerPage);
        // };
        // $scope.getModelPage = function (currentPage, pageSize) {
        //     //console.log(appSettings.serverPath);
        //     $http.get(appSettings.serverPath + "/modelinfo/search?pageIndex=" + currentPage + "&pageSize=" + pageSize)
        //         .success(function (data) {
        //             //console.log(data);
        //             $scope.models = data.modelinfo.body;
        //             //$scope.filteredList = data.modelinfo.body;
        //             $scope.totalItems = data.modelinfo.count;
        //             //$scope.pagination($scope.models);
        //             //get model running
        //             $http.get(appSettings.serverPath + "/activetable")
        //             .success(function (data) {
        //                 $scope.activetable = data.activetable.body;
        //             });
        //         });
        // }
        // $scope.getModelPage($scope.currentPage, $scope.itemsPerPage);
        // //-----------end paging--------------


        //Broadcast message
        $scope.goEdit = function (index) {

            if ($scope.models.length && (index != null || index != undefined)) {

                shareServices.setCurrentObject($scope.models[index]);
                $state.go('modelEdit', { modelId: $scope.models[index]._id });
            }
        };        


        // Delete
        $scope.modelDelete = function (index) {
            if (popupService.showPopup('Are you sure delete this model?')) {

                modelServices.destroy($scope.models[index]._id)
                    .success(function (data, status, headers, config) {
                        $scope.models.splice(index, 1);
                        $scope.pagination($scope.models);
                        popupService.showMessage('Huỷ đăng ký thành công!');
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }


        $scope.search = function () {

            modelServices.getAll($scope.email, $scope.status, $scope.floor, $scope.page)
            .success(function (data) {
                $scope.models = data;
            })
            .error(function (err) {
                $scope.models = [];
            });
        };

        $scope.search();
    }
}());
