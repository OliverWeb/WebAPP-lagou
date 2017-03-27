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

