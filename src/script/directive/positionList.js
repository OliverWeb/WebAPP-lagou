"use strict";
angular.module('app').directive('appPositionList',['$http',function($http){
	return {
		restrict:'A',  /*EAMC*/
		replace:true,   /*替换父元素进行修改*/
		templateUrl:'view/template/positionList.html',
		scope: {
			data:'=',
			filterObj:'=',
			isFavorite:'='
		},
		link:function($scope){
			/*$scope.name=cache.get('name') || '';  */
			$scope.select=function(item){
				$http.post('data/favorite.json',{
					id:item.id,
					select: !item.select
				});
				item.select=!item.select;
			}
		}
	};
}]);