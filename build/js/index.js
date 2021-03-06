"use strict";
angular.module('app',['ui.router','ngCookies','validation']);
'use strict';
/*创建全局.value变量*/
angular.module('app').value('dict',{}).run(['dict','$http',function(dict,$http){
		$http.get('data/city.json').success(function(resp){
			dict.city=resp;
		});
		$http.get('data/salary.json').success(function(resp){
			dict.salary=resp;
		});
		$http.get('data/scale.json').success(function(resp){
			dict.scale=resp;
		});
}]);
"use strict";
angular.module('app').config(['$provide',function($provide){
	$provide.decorator('$http',['$delegate','$q',function($delegate,$q){
		var get= $delegate.get;
		$delegate.post=function(url,data,config){
			var def=$q.defer();
			get(url).success(function(resp){
				def.resolve(resp);
			}).error(function(err){
				def.reject(err);
			});
			return{
				success:function(cb){
					def.promise.then(cb)
				},
				error:function(cb){
					def.promise.then(null,cb);
				}
			}
		};
		return $delegate;
	}])
}]);
"use strict";
angular.module('app').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
		$stateProvider.state('main',{
			url:"/main",
			templateUrl:"view/main.html",
			controller:'mainCtrl'
		}).state('position',{
			url:'/position/:id',
			templateUrl:'view/position.html',
			controller:'positionCtrl'
		}).state('company',{
			url:'/company/:id ',
			templateUrl:'view/company.html',
			controller:'companyCtrl'
		}).state('search',{
			url:'/search',
			templateUrl:'view/search.html',
			controller:'searchCtrl'
		}).state('login',{
			url:'/login',
			templateUrl:'view/login.html',
			controller:'loginCtrl'
		}).state('register',{
			url:'/register',
			templateUrl:'view/register.html',
			controller:'registerCtrl'
		}).state('me',{
			url:'/me',
			templateUrl:'view/me.html',
			controller:'meCtrl'
		}).state('post',{
			url:'/post',
			templateUrl:'view/post.html',
			controller:'postCtrl'
		}).state('favorite',{
			url:'/favorite',
			templateUrl:'view/favorite.html',
			controller:'favoriteCtrl'
		});
		$urlRouterProvider.otherwise("main");
}]);
"use strict";
angular.module('app').config(['$validationProvider',function($validationProvider){
	/* provider,对模块和服务进行配置*/
	/*进行校验规则的的配置*/
	var expression={
		phone: /^1[\d]{10}$/,
		password:function(value){
			var str=value+'';
			return str.length> 5;
		},
		required:function(value){
			return !!value;
		}
	};
	var defaultMsg={
		phone:{
			success:'',
			error:'必须是11位手机号'
		},
		password:{
			success:'',
			error:'长度至少6位'
		},
		required:{
			success:'',
			error:'不能为空'
		}
	};
	$validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}]);
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
'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
	$http.get('data/myfavorite.json').success(function(resp){
		$scope.list=resp;
	});
}]);
'use strict';
angular.module('app').controller('loginCtrl', ['cache','$state','$http', '$scope', function(cache,$state,$http, $scope){
		console.log($scope.user);
		$scope.submit=function(){
			$http.post('data/login.json',$scope.user).success(function(resp){
				cache.put('id',resp.id);
				cache.put('name',resp.name);
				cache.put('image',resp.image);
				$state.go('main');

			})
		}
}]);
'use strict';
angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
	$http.get('/data/positionList.json').success(function(resp){
		console.log(resp);
		$scope.list=resp;
	});
}]);
'use strict';
angular.module('app').controller('meCtrl', ['$state','cache','$http', '$scope', function($state,cache,$http, $scope){
	if(cache.get('name')){
		$scope.name=cache.get('name');
		$scope.image=cache.get('image');
	}
	$scope.logout=function(){
	cache.remove('id');
	cache.remove('name');
	cache.remove('image');
	$state.go('main');
	}
}]);
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
'use strict';
angular.module('app').controller('registerCtrl', ['$interval','$http', '$scope','$state', function($interval,$http, $scope,$state){
		$scope.submit=function(){
			$http.post('data/regist.json',$scope.user).success(function(resp){
			$state.go('login');
			})
		};
		var count=60;
		$scope.send=function(){
			$http.get('data/code.json').success(function(resp){
				if(resp.state===1){
					count=60;
					$scope.time='60';
					var interval=$interval(function(){
						if(count<=0){
							$interval.cancel(interval);
							$scope.time='';
						}else{
							count--;
							$scope.time=count+'s';
						}
					},1000)
				}
			})
		}
}]);
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
'use strict';
angular.module('app').directive('appCompany',[function(){
	return {
		restrict:'A',
		replace:'true',
		scope:{
			com:'='
		},
		templateUrl:'view/template/company.html'
	}
}]);

"use strict";
angular.module('app').directive('appFoot',[function(){
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/foot.html'
	}
}]);

'use strict';
angular.module('app').directive('appHead',['cache',function(cache){
	return {
		restrict:'A',
		replace:'true',
		templateUrl:'view/template/head.html',
		link:function($scope){
			$scope.name=cache.get('name');
		}
	}
}]);

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
"use strict";
angular.module('app').directive('appPositionClass',[function(){
	return {
		restrict:'A',
		replace:true,
		scope:{
			com:'='
		},
		templateUrl:"view/template/positionClass.html",
		/*指令写逻辑*/
		link:function($scope){
			$scope.showPositionList=function(idx){
				$scope.positionList= $scope.com.positionClass[idx].positionList;
				$scope.isActive=idx;
			};
			$scope.$watch('com', function(newVal){
				if(newVal) $scope.showPositionList(0);
			});
		}
	}
}]);
"use strict";
angular.module('app').directive('appPositionInfo',['$http',function($http){
	return {
		restrict:'A',
		replace:true,
		templateUrl:"view/template/positionInfo.html",
		scope:{
			isActive:'=',
			isLogin:'=',
			pos:'='
		},
		link:function($scope){
			$scope.$watch('pos',function(newVal){
				if(newVal){
					$scope.pos.select=$scope.pos.select|| false;
					$scope.imagePath=$scope.pos.select?'image/star-active.png':'image/star.png';
				}
			});
			$scope.favorite=function(){
				$http.post('data/favorite.json',{
					id:$scope.pos.id,
					select: !$scope.pos.select
				}).success(function(resp){
					$scope.pos.selct=!$scope.pos.select;
					$scope.imagePath=$scope.pos.select?'image/star-active.png':'image/star.png';
				})
			}
		}
	};
}]);

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
'use strict';
angular.module('app').directive('appSheet',[function(){
	return {
		restrict:'A',
		replace:'true',
		scope:{
			list:'=',
			visible:'=',
			select:'&'
		},
		templateUrl:'view/template/sheet.html'
	}
}]);

"use strict";
angular.module('app').directive('appTab',[function(){
	return {
		restrict:'A',
		replace:true,   /*替换父元素进行修改*/
		templateUrl:'view/template/tab.html',
		scope:{
			list:'=',
			tabClick:'&'
		},
		link:function($scope){
			$scope.click=function(tab){
				$scope.selectId=tab.id;
				$scope.tabClick(tab);
			}
		}
	};
}]);
"use strict";
angular.module('app').filter('filterByObj',[function(){
 return function(list,obj){
 	var result=[];
 	angular.forEach(list,function(item){
 		var isEqual=true;
 		for(var e in obj){
 			if(item[e]!=obj[e]){
			  isEqual=false;
		  }
	  }
	  if(isEqual){
			result.push(item);
	  }
  });
 	return result;
 }
}]);

'use strict';
angular.module('app').service('cache', ['$cookies', function($cookies){
	this.put = function(key, value){
		$cookies.put(key, value);
	};
	this.get = function(key) {
		return $cookies.get(key);
	};
	this.remove = function(key) {
		$cookies.remove(key);
	};
}]);
/*	.factory('cache',['$cookies',function($cookies){
		可以内部属性;
		var obj={};
		return {
			put:function(key ,value){
				$cookies.put(key,value)
			},
			get:function(key){
				return $cookies.get(key);
			},
			remove:function(key){
				$cookies.remove(key);
			}
		}
	}]);*/

