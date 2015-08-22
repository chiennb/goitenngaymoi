(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .factory("modelServices",
                    ["$http", "appSettings",
                     modelServices]);

    function modelServices($http, appSettings) {

        return {
            getAll: function(email, status, floor, page){

                var filter = '';

                if(email != null && email != '')
                    filter = filter + '&email=' + email

                if(status != null && status != '')
                    filter = filter + '&status=' + status

                if(floor != null && floor != '')
                    filter = filter + '&floor=' + floor

                if(page != null && page != '')
                    filter = filter + '&page=' + page

                if (filter.length > 0){
                    if( filter.charAt( 0 ) === '&' )
                        filter = '?' + filter.slice( 1 );
                }


                //return $http.get(appSettings.serverPath + '/api/books' + filter);

                return $http({
                    method: 'GET',
                    url: appSettings.serverPath + '/api/books' + filter,
                    //cache: true
                });
                
            },
            getDetail: function(id){
                return $http.get(appSettings.serverPath + '/api/books/' + id)
            },
            addNew: function(book){
                return $http.post(appSettings.serverPath + '/api/books', book)
            },
            updated: function (book) {
                console.log(book);
                return $http.put(appSettings.serverPath + '/api/books/' + book._id, book)
            },
            destroy: function(id){
                return $http.delete(appSettings.serverPath + '/api/books/' + id)
            }
        }        
            
    };
}());    