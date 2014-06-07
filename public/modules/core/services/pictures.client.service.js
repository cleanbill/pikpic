'use strict';

angular.module('core').service('Pictures', 
			       ['$http','$rootScope','$q',
				function($http,$rootScope,$q) {
				    this.get = function(){
					var deferred = $q.defer();
					if (angular.isDefined($rootScope.years)){
					    console.log('Already loaded picture data...');
					    deferred.resolve($rootScope.years);
					} else {
					    console.log('Loading picture data...');
					    $http.get('/unpicked').then(function(d){
						$rootScope.years =d.data;
						console.log(d.data);
						deferred.resolve($rootScope.years);
					    });
					}
					return deferred.promise;
				    };
				    this.done = function(pick,print,rotate,root,name){
					console.log('Pictures have been picked...');
					var data = {'pick':pick,'print':print,'rotate':rotate,'root':root,'name':name};
					return $http.post('done',data);
				    };
				    this.clear = function(){
					delete $rootScope.years;
				    };	
				}
]);
