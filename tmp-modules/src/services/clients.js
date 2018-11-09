
'use strict';

(function(){

	angular.module('services.clients',[])

	.factory(

		'clientsService',

		function(
			$http,
			urls
		){

			var post = function(attrs){

				console.log(attrs);

				// var resourceItem;

				// if(attrs.resource){
				// 	resourceItem =
				// 		urls.apiPaths[attrs.resource.resource] + '/' + attrs.resource.id;
				// }else{
				// 	resourceItem = '';
				// }

				// $http({
				// 	url: urls.apiHost + resourceItem + urls.apiPaths.followup,
				// 	method: 'POST',
				// 	data: attrs.data
				// }).then(
				// 	function(response){
				// 		if(typeof attrs.success == 'function'){
				// 			attrs.success(response);
				// 		}
				// 	},
				// 	function(response){
				// 		if(typeof attrs.error == 'function'){
				// 			attrs.error(response);
				// 		}
				// 	}
				// );

			};

			var patchItem = function(attrs){

				$http({
					url: urls.apiHost + urls.apiPaths.clients + '/' + attrs.item.id,
					method: 'PATCH',
					toastrMessages: attrs.toastrMessages,
					data: attrs.data
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

			var get = function(attrs){

				console.log(attrs);

				// [todo] same get of services.transactions
				// must implement list filters

			};

			var getItem = function(attrs){

				$http({
					url: urls.apiHost + urls.apiPaths.clients + '/' + attrs.id,
					method: 'GET',
					params: attrs.params,
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
				get: get,
				getItem: getItem,
				post: post,
				patchItem: patchItem
			};

			return factory;
		}
	);

})();
