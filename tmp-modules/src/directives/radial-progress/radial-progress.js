
'use strict';

(function(){

	angular.module('directives.radial-progress',[])

	.controller(
		'RadialProgressController',

		function(
			$scope,
			$element,
			$attrs,
			$tooltip,
			$timeout
		){

			if($scope.tooltip){
				$timeout(function(){
					$tooltip(
						angular.element($($element[0]).find('> div')[0]),
						{
							title: $scope.tooltip,
							type: 'success',
							// trigger: 'click',
						}
					);
				});
			}

			var basis = 126;

			var calcPercentage = function(){

				if($scope.value < 0 || $scope.value > $scope.total){
					return 0;
				}else{
					return $scope.value/$scope.total;
				}

			};

			var calcStroke = function(){

				var percentage = calcPercentage();

				if(percentage == 0){
					return basis;
				}

				var stroke = basis - (basis * percentage);

				return stroke;

			};

			$scope.getClassThreshold = function(){

				var percentage = calcPercentage();
				var className = '';

				if($scope.classThresholds){

					var thresholds = Object.keys($scope.classThresholds);

					for(var i=0; i<thresholds.length; i++){
						if(thresholds[i]/100 >= percentage){
							className = $scope.classThresholds[thresholds[i]];
							break;
						}
					}

				}

				return className;
			};

			$scope.getStyle = function(){

				return {
					strokeDashoffset: calcStroke()
				};

			};

			$scope.hasLabel = function(){
				return typeof $scope.label != 'undefined';
			};

		}
	)

	.directive('radialProgress', function(){
		return {
			restrict: 'E',
			scope: {
				total: '=',
				value: '=',
				label: '=',
				tooltip: '=',
				classThresholds: '='
			},
			templateUrl: 'radial-progress/radial-progress.html',
			controller: 'RadialProgressController'
		};
	});

})();
