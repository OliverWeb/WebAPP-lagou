'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
	$http.get('data/myfavorite.json').success(function(resp){
		$scope.list=resp;
	});
}]);