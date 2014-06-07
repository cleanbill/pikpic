'use strict';

angular.module('core').controller('PickerController', ['$scope','Pictures','$stateParams','$location',
	function($scope,Pictures,$stateParams,$location) {
	    $scope.setup = function(){
		$scope.link = $scope.data.pictures[$scope.c].link;
		$scope.pickOn  = ($scope.c in $scope.pick);
		$scope.printOn = ($scope.c in $scope.print);
		$scope.angle = 0;
		if ($scope.c in $scope.rotateAngle){
		    $scope.angle = $scope.rotateAngle[$scope.c].angle;
		}    
	    };	
	    Pictures.get().then(function(d){
		$scope.years = d;
		$scope.year = $stateParams.year;
		$scope.name = $stateParams.name;
		$scope.data = $scope.years[$scope.year][$scope.name];
		$scope.c = 0;
                $scope.pickedQty = 0;
		$scope.pick   = {};
		$scope.print  = {};
		$scope.rotateAngle = {};
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
		if ($scope.c > $scope.data.pictures.length -1){
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
		$scope.next();
	    };	
	    $scope.rotate = function(){
		$scope.angle = ($scope.angle+90)%360;
		var pic = $scope.data.pictures[$scope.c];
		pic.angle = $scope.angle;
		$scope.rotateAngle[$scope.c] = pic;
            };	
	    $scope.done = function(){
		Pictures.done($scope.pick,$scope.print,$scope.rotateAngle,$scope.data.file,$scope.name).then(function(d){
		    Pictures.clear();
		    $location.path('/');
		});
	    };
	     
	}
]);
