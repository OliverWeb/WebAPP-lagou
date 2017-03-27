'use strict';
angular.module('app').controller('postCtrl', ['$http', '$scope', function($http, $scope){
		$scope.tabList=[{
			id:'all',
			name:'全部'
		},{
			id:'pass',
			name:'面试要求'
		},{
			id:'fail',
			name:'不合适'
		}];
	$http.get('data/myPost.json').success(function(res){
		$scope.positionList=res;
	});
	/*这里生命过滤的对象*/
	$scope.filterObj={};
	$scope.tClick=function(id,name){
		switch (id){
			case 'all':
				delete $scope.filterObj.state;
				break;
			case 'fail':
				$scope.filterObj.state='-1';
				break;
			case 'pass':
				$scope.filterObj.state='1';
				break;
		}
	}
}]);