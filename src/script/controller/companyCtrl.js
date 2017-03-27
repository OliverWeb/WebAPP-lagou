"use strict";
angular.module('app').controller('companyCtrl',['$http','$state','$scope',function($http,$state,$scope){
	$http.get('/data/company.json?id='+$state.params.id).success(function(resp){
		/*
		* 这里success新版取消
		* 这里的个$http.get('/data/company.json',{
		* param:{
		* id:$state.params.id}}).success
		* */
		$scope.company=resp;
	})
}]);