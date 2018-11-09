
'use strict';

(function(){

	angular.module('directives.icon-svg', [])

	.provider('iconsSVG', function(){

		var bundle = $('.iconSVGBundle symbol');
		var icons = {};

		$(bundle).each(function(key, element){
			icons[element.getAttribute('id').replace('icon-svg-','')] = {
				viewbox: element.getAttribute('viewBox'),
				paths: $(element).html()
			};
		});

		var self = this;

		self.icons = icons;

		self.$get = function(){
			return self;
		};

	})

	.controller(
		'IconSVGController',

		function(
			$scope
		){
			$scope;
		}
	)

	.directive('iconSvg', function(){
		return {
			restrict: 'E',
			scope: {
				iconName: '@name',
				className: '@'
			},
			replace: true,
			templateUrl: 'icon-svg/icon-svg.html',
			controller: 'IconSVGController as iconSVG'
		};
	})

	.directive('iconSvgInline', function(){
		return {
			restrict: 'E',
			scope: {
				iconName: '@name',
				className: '@'
			},
			replace: true,
			controller: function($scope, $sce, iconsSVG){
				$scope.icon = iconsSVG.icons[$scope.iconName] || {};
				$scope.svg = $sce.trustAsHtml($scope.icon.paths);
			},
			templateUrl: 'icon-svg/icon-svg-inline.html'
		};
	})

	;

})();
