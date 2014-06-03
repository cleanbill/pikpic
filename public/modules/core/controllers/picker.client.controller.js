'use strict';

angular.module('core').controller('PickerController', ['$scope','Pictures','$stateParams',
	function($scope,Pictures,$stateParams) {
	    Pictures.get().then(function(d){
		$scope.years = d;
		$scope.year = $stateParams.year;
		$scope.name = $stateParams.name;
		$scope.data = $scope.years[$scope.year][$scope.name];
		$scope.c = 0;
		$scope.link = $scope.data.pictures[$scope.c].link;
	    });   
	    $scope.next = function(){
		$scope.c = $scope.c + 1;
		if ($scope.c === $scope.data.length){
		    $scope.c = 0;
		}
		$scope.link = $scope.data.pictures[$scope.c].link;
            };		
	    $scope.prev = function(){
		$scope.c = $scope.c - 1;
		if ($scope.c < 0){
		    $scope.c = $scope.data.length;
		}
		$scope.link = $scope.data.pictures[$scope.c].link;
            };		
	     
	}
]);
