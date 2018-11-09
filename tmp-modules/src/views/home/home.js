
'use strict';

(function(){

	angular.module('views.home',[])

	.controller(
		'ViewHomeController',

		function(
			$scope,
			path,
			navigationBarFactory
		){

			$scope;

			navigationBarFactory.backButton.hide();

			path.setCurrent('home');

			$scope.$on(
				'$destroy',
				function(){
					navigationBarFactory.backButton.show();
				}
			);

		}
	);

})();
