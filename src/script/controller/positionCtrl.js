'use strict';
angular.module('app').controller('positionCtrl',['$log','$q','$http','$state','$scope','cache',function($log,$q,$http,$state,$scope,cache){
		/*cache方法取出*/
		$scope.isLogin=!!cache.get('name');
		$scope.message=$scope.isLogin?'投个简历':'去登录';
		function getPosition(){
			var def=$q.defer();
			/*解决异步请求,调用$q的defer的函数,创建一个延迟加载对象*/
			$http.get('/data/position.json?id=',{params:{id:$state.params.id}}).success(function(resp){
				$scope.position=resp;
					if(resp.posted){
						$scope.message='已投递';
					}
					def.resolve(resp);  /*异步请求完成的时候,接受数据*/
			}).error(function(err){
				def.reject(err);      /*执行失败*/
			});
			return def.promise;  /*返回创建延迟加载对象的promise属性进行返回*/
		}
		function getCompany(id){
			$http.get('data/company.json?id='+id).success(function(resp){
				$scope.company=resp;
			})
		}
		getPosition().then(function(obj){
			getCompany(obj.companyId); /*这里的异步请求then是函数执行完之后里面两个函数,一个是异常情况下参数就是resolve中的参数*/
			});
		$scope.go=function(){
			if($scope.message!=='已投递'){
				if($scope.isLogin){
					$http.post('data/handle.json',{
						id:$scope.position.id
					}).success(function(resp){
						$log.info(resp);
						$scope.message='已投递'
					});
				}else{
					$state.go('login');
				}
			}

		};
		/*$q.all([fun1(),fun2()]),then(function(result){})*/
		/*$interval(function(){

		},3000)*/

}]);