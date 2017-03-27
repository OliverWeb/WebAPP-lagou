'use strict';
angular.module('app').directive('appHeadBar',[function(){
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/headBar.html',
		scope:{
			text:'@' /*这里用=,text="这里要用单引号"*/
		},
		link:function($scope){
			$scope.back=function(){
				window.history.back();/*函数*/
			}
		}

	}
}]);