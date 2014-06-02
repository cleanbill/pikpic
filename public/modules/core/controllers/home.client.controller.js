'use strict';


angular.module('core').controller('HomeController', 
				  ['$scope', 'Authentication','Pictures',
				   function($scope, Authentication,Pictures) {
				       // This provides Authentication context.
				       $scope.authentication = Authentication;
				       Pictures.get().then(function(d){
					   $scope.years = d;
				       });   
				   }
]);
