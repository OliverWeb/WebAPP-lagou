"use strict";
angular.module('app').directive('appPositionList',[function(){
	return {
		restrict:'A',  /*EAMC*/
		replace:true,   /*替换父元素进行修改*/
		templateUrl:'view/template/positionList.html',
		scope: {
			data:'=',
			filterObj:'='
		}
	};
}]);