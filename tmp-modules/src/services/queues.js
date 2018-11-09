
'use strict';

(function(){

	angular.module('services.queues',[])

	.factory(

		'queuesService',

		function(
			$http,
			urls
		){

			var actions = function(attrs){

				attrs = attrs || {};

				$http({
					url: urls.apiHost
					+ urls.apiPaths.queues
					+ (attrs.item
							? '/' + attrs.item.id
							: ''
					)
					+ urls.apiPaths.queuesActions[attrs.action],
					method: attrs.method || 'POST',
					data: attrs.data || {},
					params: attrs.params || {},
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

			var factory = {
				actions: actions
			};

			return factory;
		}
	);

})();
