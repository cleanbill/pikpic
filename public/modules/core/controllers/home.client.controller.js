'use strict';


angular.module('core').controller('HomeController', 
				  ['$scope', 'Authentication','Pictures','$location',
				   function($scope, Authentication,Pictures,$location) {
				       // This provides Authentication context.
				       $scope.authentication = Authentication;
				       Pictures.get().then(function(d){
					   $scope.years = d;
				       });   
				       $scope.goto = function(year,name){
					   $location.path('/picker/'+year+'/'+name);
				      }	   
				   }
]);
