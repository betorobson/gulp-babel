
'use strict';

(function(){

	var view = 'clients';
	var controller = 'ViewClientsController';
	var requireLogin = true;
	var permissions = 'view.clients';
	var permissionDescription = 'Carteira de clientes';

	var configPath = {
		path: '/clientes/',
		label: 'Carteira',
		icon: 'contacts-book',
		permissions: permissions,
		permissionDescription: permissionDescription
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
				path,
				route
			)

			// [todo] remove
			.when(
				path + ':id/',
				route
			)

		;

	});

})();
