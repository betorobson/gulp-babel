
'use strict';

(function(){

	angular.module('views.clients',[])

	.controller(
		'ViewClientsController',

		function(
			$scope,
			$timeout,
			path
		){

			path.setCurrent('clients');

			$scope.breadcrumbs = [
				{
					label: path.getCurrent().label,
					path: false
				}
			];

			$scope.$on(
				'$destroy', function(){
					$timeout(function(){
						false;
					}, 0);
				}
			);

		}
	);

})();
