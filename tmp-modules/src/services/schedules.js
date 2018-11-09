
'use strict';

(function(){

	angular.module('services.schedules', [])

		.factory(

			'schedulesService',

			function(
				$http,
				urls
			){

				var get = function(attrs){

					attrs = attrs || {};

					$http({
						url: urls.apiHost + urls.apiPaths.schedules,
						method: 'GET',
						toastrMessages: attrs.toastrMessages
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){
								attrs.success(response);
							}
						},
						function(response){
							if(typeof attrs.error == 'function'){
								attrs.error(response);
							}
						}
					);

				};

				var service = {
					get: get
				};

				return service;

			});

})();
