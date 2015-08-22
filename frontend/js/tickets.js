(function () {
    "use strict";
    angular
        .module("appTickets")
        .factory("ticketService",
                    ["$http",
                     ticketService])
        .controller("ticketCtrl",
                    ["$scope", "ticketService",
                     ticketCtrl]);

    function ticketCtrl($scope, ticketService) {

    	$scope.book = {};

    	$scope.submit = function(){
    		// ticketService.postBook($scope.book)
    		// .success({
    		// 	console.log('success');
    		// })
    		// .error({
    		// 	console.log('Error');
    		// });
            alert('Chiennb');
    	}
    }

    function ticketService($http) {
    	return {
            postBook: function(book, callback) {

                $http.post('/api/books', {
                  email: book.email,
                  tickettype: book.tickettype
                })
            }
        }
    }
}());    