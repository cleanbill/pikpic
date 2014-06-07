'use strict';


angular.module('core').controller('HomeController', 
				  ['$scope', 'Authentication','Pictures','$location',
				   function($scope, Authentication,Pictures,$location) {
				       // This provides Authentication context.
				       $scope.authentication = Authentication;
				       Pictures.get().then(function(d){
					   $scope.years = d;
					   $scope.total = 0;
					   for (var year in $scope.years){
					       for (var name in $scope.years[year]){
						   $scope.total = $scope.total + $scope.years[year][name].pictures.length;
					       }
					   }    
				       });   
				       $scope.goto = function(year,name){
					   $location.path('/picker/'+year+'/'+name);
				      };	   
				   }
]);
