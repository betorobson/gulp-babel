
'use strict';

(function(){

	var view = 'transaction';
	var controller = 'ViewTransactionController';
	var requireLogin = true;

	var configPath = {
		path: '/negocio/',
		label: 'Negócio',
		icon: 'users2',
		withItem: function(item){
			return configPath.path + item.id;
		}
	};

	var route = {
		templateUrl: view + '/' + view + '.html',
		controller: controller,
		requireLogin: requireLogin,
		configPath: configPath
	};

	angular.module('views.' + view)

	.config(function(
		$routeProvider,
		$locationProvider,
		pathProvider
	){

		var pathObj = pathProvider.addPath(
			view,
			configPath
		);

		var path = pathObj.path;

		$routeProvider

			.when(
				path + ':id',
				route
			)

		;

	});

})();
