
'use strict';

(function(){

	var view = 'auth';
	var controller = 'ViewAuthController';
	var requireLogin = false;

	var configPath = {
		path: '/login/',
		label: 'Autenticação'
	};

	var route = {
		templateUrl: view + '/' + view + '.html',
		controller: controller,
		requireLogin: requireLogin,
		redirToDefaultWhenLoggedIn: true,
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
				path,
				route
			)

		;

	});

})();
