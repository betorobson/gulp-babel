
'use strict';

(function(){

	var view = 'queues-handler-position';
	var controller = 'ViewQueuesHandlerPositionController';
	var requireLogin = true;

	var configPath = {
		path: '/fila-atendimento/',
		label: 'Fila de atendimento',
		icon: 'user-profile',
		withItem: function(item){
			return configPath.path
				+ item.CampanhaIdGuid
				+ ':'
				+ item.CanalIdGuid;
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
