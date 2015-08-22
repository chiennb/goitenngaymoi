(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "shareServices", "popupService","modelServices",
                     ModelEditCtrl]);

    function ModelEditCtrl($scope, $http, $state, $stateParams, appSettings, shareServices, popupService, modelServices) {
        $scope.model = {};

        $scope.originalModel = angular.copy($scope.model);


        if ($scope.model._id == undefined && $stateParams.modelId != '' && $stateParams.modelId != undefined) {
            modelServices.getDetail($stateParams.modelId )
                .success(function (data) {
                    //console.log(data);
                    $scope.model = data;
                    $scope.originalModel = angular.copy($scope.model);
                });
        }
        
        //Back update data
        console.log($scope.originalModel);

        // Sava data
        $scope.save = function () {

            if (!$scope.modelForm.$valid) {
                //console.log("Form valid!");
                return;
            }

            if ($scope.model._id == null || $scope.model._id == 'undefined' || $scope.model._id == '') {
                $scope.model.status = 'pending';

                modelServices.addNew( $scope.model)
                    .success(function (data, status, headers, config) {
                        popupService.showMessage('Insert Success!');
                        $scope.back();
                    });
            }
            else{
                //modelServices.updated($scope.model)
                modelServices.updated($scope.model)
                    .success(function (data, status, headers, config) {
                        popupService.showMessage('Update Success!');
                        $scope.back();
                    });
            }

        }

        // Reset data to original
        $scope.cancel = function (editForm) {
            editForm.$setPristine();
            $scope.model = angular.copy($scope.originalModel);
            $scope.message = "";
        };

        // Back to list
        $scope.back = function () {
            $state.go("modelList");
        }
    }
}());