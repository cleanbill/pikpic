'use strict';

angular.module('core').controller('PickerController', ['$scope','Pictures','$stateParams',
	function($scope,Pictures,$stateParams) {
	    $scope.setup = function(){
		$scope.link = $scope.data.pictures[$scope.c].link;
		$scope.pickOn  = ($scope.c in $scope.pick);
		$scope.printOn = ($scope.c in $scope.print);
	    };	
	    Pictures.get().then(function(d){
		$scope.years = d;
		$scope.year = $stateParams.year;
		$scope.name = $stateParams.name;
		$scope.data = $scope.years[$scope.year][$scope.name];
		$scope.c = 0;
                $scope.pickedQty = 0;
		$scope.angle = 0;
		$scope.pick   = {};
		$scope.print  = {};
		$scope.setup();
	    });   
	    $scope.unpick = function(){
                delete $scope.print[$scope.c];
                delete $scope.pick[$scope.c];
		$scope.next();
	    };
	    $scope.next = function(){
		$scope.pickedQty = Object.keys($scope.pick).length;
		$scope.c = $scope.c + 1;
		if ($scope.c === $scope.data.length){
		    $scope.c = 0;
		}
		$scope.setup();
            };		
	    $scope.prev = function(){
		$scope.c = $scope.c - 1;
		if ($scope.c < 0){
		    $scope.c = $scope.data.pictures.length-1;
		}
		$scope.setup();
            };		
	    $scope.doPick = function(){
	        delete $scope.print[$scope.c];
		$scope.setPick();
            };
	    $scope.setPick = function(){
		$scope.pick[$scope.c] = $scope.data.pictures[$scope.c];
		$scope.next();
	    };	
	    $scope.doPrint = function(){
		$scope.print[$scope.c] = $scope.data.pictures[$scope.c];
		$scope.setPick();
	    };	
	    $scope.rotate = function(){
		$scope.angle = ($scope.angle+90)%360;
            };	
	     
	}
]);
