"use strict";
angular.module('app').controller('searchCtrl',['dict','$http','$scope',function(dict,$http,$scope){
	$scope.name='';
	$scope.search=function(){
			$http.get('data/positionList.json?cityName='+$scope.name).success(function(resp){
				$scope.positionList=resp;
			})
		};
	$scope.search();
	$scope.sheet={};
	$scope.tabList=[{
		id:'city',
		name:'城市'
	},{
		id:'salary',
		name:'薪水'
	},{
		id:'scale',
		name:'公司规模'
	}];
	var tabId='';
	$scope.filterObj={};
	$scope.tClick=function(id,name){
		tabId=id;     /*id是city*/
		$scope.sheet.list=dict[id];
		$scope.sheet.visible=true;
	};
	/*点击后传入的数据*/
	$scope.sClick=function(id,name){
		if(id){
				/*如果有id是可以选择的*/
				angular.forEach($scope.tabList,function(item){
						if(item.id===tabId){
							item.name=name;
						}
				});
				$scope.filterObj[tabId+'Id']=id;
		}else{
			delete $scope.filterObj[tabId+'Id'];
			angular.forEach($scope.tabList,function(item){
				if(item.id===tabId){
					switch (item.id){
						case 'city':
							item.name='城市';
							break;
						case 'salary':
							item.name='城市';
							break;
						case 'scale':
							item.name='城市';
							break;
					}
				}
			})
		}
	};
}]);