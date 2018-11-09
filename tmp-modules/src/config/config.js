
'use strict';

(function(){

	angular.module('anaproApp').config(

		function(
			$httpProvider,
			$routeProvider,
			$locationProvider,
			$compileProvider,
			$tooltipProvider,
			$modalProvider,
			pathProvider
		){

			$compileProvider.debugInfoEnabled(window.DEVELOPMENT);

			$locationProvider.html5Mode(true);

			$httpProvider.interceptors.push('httpInterceptor');

			$routeProvider
				.otherwise({
					redirectTo: pathProvider.get('transactions').path
				})

			;

			angular.extend($tooltipProvider.defaults, {
				html: true
			});

			angular.extend($modalProvider.defaults, {
				keyboard: false
			});

		}
	);

})();
