
function checkweightrate($scope, $http, appSettings, modelid) {
    //alert(modelid)
    $http.post(appSettings.serverPath + "/validate/checkweightrate", { modelid: modelid }).
        success(function (data, status, headers, config) {
            //alert('data.checkweightrate.header.code');
            var code = 0;
            code = data.checkweightrate.header.code;
            var strerr = "";
            if (code == 0) {

                alert(data["checkweightrate"]["header"].message);
                return true;
            }
            else if (code == 1) {
                strerr = data["checkweightrate"]["header"].message + ":\n";
                for (var i = 0; i < data["checkweightrate"]["body"]["weight"].length; i++) {
                    strerr += "- " + data["checkweightrate"]["body"]["weight"][i].FactorName + " : " + data["checkweightrate"]["body"]["weight"][i].Weight + "\n";
                }
                strerr += "------------------------------------------\n";
                strerr += "- " + data["checkweightrate"]["body"].rate;
                alert(strerr);
                return false;
            }
            else if (code == 2) {
                strerr = data["checkweightrate"]["header"].message + ":\n";
                for (var i = 0; i < data["checkweightrate"]["body"]["weight"].length; i++) {
                    strerr += "- " + data["checkweightrate"]["body"]["weight"][i].FactorName + " : " + data["checkweightrate"]["body"]["weight"][i].Weight + "\n";
                }
                alert(strerr);
                return false;
            }
            else if (code == 3) {
                strerr = data["checkweightrate"]["header"].message + ":\n";
                strerr += "- " + data["checkweightrate"]["body"].rate;
                alert(strerr);
                return false;
            }
            else if (code == 4) {
                strerr = data["checkweightrate"]["header"].message + ":\n";
                alert(strerr);
                return false;
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

}
