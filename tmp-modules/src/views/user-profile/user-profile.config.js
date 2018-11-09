
'use strict';

(function(){

	var view = 'user-profile';
	var controller = 'ViewUserProfileController';
	var requireLogin = true;

	var configPath = {
		path: '/meus-dados/',
		label: 'Meus dados',
		icon: 'user-profile',
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
				path + ':id?',
				route
			)

		;

	});

})();
