
'use strict';

(function() {

	angular.module('directives.img-src-error-remove', [])

	.directive('onErrorSrcRemove', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('error', function() {

					element.remove();

					if(attrs['onErrorSrcRemove']) {
						scope.$evalAsync(attrs['onErrorSrcRemove']);
					}

				});
			}
		};
	});

}) ();
