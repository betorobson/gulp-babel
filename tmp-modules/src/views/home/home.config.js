
'use strict';

(function(){

	var view = 'home';
	var controller = 'ViewHomeController';
	var requireLogin = true;

	var configPath = {
		path: '/home/',
		label: 'Home',
		icon: 'Anapro-Logo-Marca-3paths'
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
		pathProvider,
		mainControllerProvider
	){

		if(mainControllerProvider.getDevice() == 'mobile'){
			configPath.icon = 'Anapro-Logo-1path';
		}

		var pathObj = pathProvider.addPath(
			view,
			configPath
		);

		var path = pathObj.path;

		// [todo] remove when /home get ready to be use
		path, route;

		// [todo] uncomment when /home get ready to be use
		// $routeProvider

		// 	.when(
		// 		path,
		// 		route
		// 	)

		// ;

	});

})();
