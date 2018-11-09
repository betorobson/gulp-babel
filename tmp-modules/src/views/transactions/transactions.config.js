
'use strict';

(function(){

	var view = 'transactions';
	var controller = 'ViewTransactionsController';
	var requireLogin = true;
	var permissions = 'atd_listar_atendimento';

	var getPageTrack = function(next){

		if(next.pathParams.hash){
			return configPath.path + 'filtes/';
		}else if(next.pathParams.q){
			return configPath.path + next.pathParams.q;
		}else{
			return configPath.path;
		}

	};

	var configPath = {
		path: '/negocios/',
		label: 'Clientes',
		icon: 'users2',
		permissions: permissions,
		getPageTrack: getPageTrack
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
				path + ':q?',
				route
			)

			.when(
				path + 'filters/:hash?',
				route
			)

		;

	});

})();
