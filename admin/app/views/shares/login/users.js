(function () {
    "use strict";
    var myApp = angular
        .module("sbAdminApp");

    //Factories
    myApp.factory('userServices', ['$http', function ($http) {

        var factoryDefinitions = {
            login: function (loginReq) {
                return $http.post('app/views/shares/login/mock/login.json', loginReq).success(function (data) { return data; });
            }
        }

        return factoryDefinitions;
    }
    ]);

    //Controllers
    myApp.controller('loginController', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {

        $scope.message = '';

        $scope.loginData = { "email": "mail2asik@gmail.com", "password": "mypassword" };

        $scope.doLogin = function () {

            if ($scope.loginForm.$valid) {
                //userServices.login($scope.login).then(function (result) {
                //    $scope.data = result;
                //    console.log(result);
                //    if (!result.error) {
                //        window.sessionStorage["userInfo"] = JSON.stringify(result.data);
                //        console.log(JSON.stringify(result.data));
                //        $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                //        $location.path("/models");
                //    }
                //});
                //{"success":true,"data":{"firstName":"John","lastName":"Smith","email":"mail2asik@gmail.com"}}
                var data = '{ "firstName": "John",  "lastName": "Smith", "email": "mail2asik@gmail.com" }';

                window.sessionStorage["userInfo"] = JSON.stringify(data);
                $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                $location.path("/models");
            }
        };
    }]);

    myApp.controller('signupController', ['$scope', 'userServices', '$location', function ($scope, userServices, $location) {
        $scope.doSignup = function () {
            if ($scope.signupForm.$valid) {
                userServices.signup($scope.signup).then(function (result) {
                    console.log(result);
                    $scope.data = result;
                    if (!result.error) {
                        $location.path("/login");
                    }
                });
            }
        }
    }]);

    myApp.controller('logoutController', ['$scope', '$location', '$rootScope', function ($scope, $location, $rootScope) {

        $scope.logout = function () {
            alert('logout');
            sessionStorage.clear();
            $rootScope.userInfo = false;
            $location.path("/login");
        }
    }]);

}());