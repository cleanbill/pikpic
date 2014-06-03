'use strict';

angular.module('core').controller('PickerController', ['$scope','Pictures','$stateParams',
	function($scope,Pictures,$stateParams) {
	    $scope.setup = function(){
		$scope.link = $scope.data.pictures[$scope.c].link;
		$scope.pickOn  = ($scope.c in $scope.pick);
		$scope.printOn = ($scope.c in $scope.print);
	    }	
	    Pictures.get().then(function(d){
		$scope.years = d;
		$scope.year = $stateParams.year;
		$scope.name = $stateParams.name;
		$scope.data = $scope.years[$scope.year][$scope.name];
		$scope.c = 0;
		$scope.pick   = {};
		$scope.print  = {};
		$scope.setup();
	    });   
	    $scope.next = function(){
                $scope.print[$scope.c] = null;
                $scope.pick[$scope.c] = null;
		$scope.c = $scope.c + 1;
		if ($scope.c === $scope.data.length){
		    $scope.c = 0;
		}
		$scope.setup();
            };		
	    $scope.prev = function(){
		$scope.c = $scope.c - 1;
		if ($scope.c < 0){
		    $scope.c = $scope.data.length;
		}
		$scope.setup();
            };		
	    $scope.doPick = function(){
		$scope.pick[$scope.c] = $scope.data.pictures[$scope.c];
	        $scope.print[$scope.c] = null;
		$scope.next();
	    };	
	    $scope.doPrint = function(){
		$scope.print[$scope.c] = $scope.data.pictures[$scope.c];
		$scope.doPick();
	    };	
	     
	}
]);
