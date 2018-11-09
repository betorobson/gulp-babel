
'use strict';

(function(){

	angular.module('services.followup',[])

	.constant('followupSubTypes', {
		call: 'LIGACAO',
		whatsapp: 'WHATSAPP',
		sellsSimulation: 'NEGOCIACAOSIMULACAO',
		sellsProposal: 'NEGOCIACAOPROPOSTA',
		sellsSold: 'NEGOCIACAOVENDA',
		sellsCustom: 'NEGOCIACAOCUSTOM'
	})

	.run(function(CacheFactory){
		CacheFactory(
			'cachefollowupService',
			{
				storagePrefix: 'AnaproAPP-Caches.',
				storageMode: 'localStorage'
			}
		);
	})

	.factory(

		'followupService',

		function(
			$http,
			CacheFactory,
			urls
		){

			var cache = CacheFactory.get('cachefollowupService');
			cache.removeAll();

			var saveCacheFollowup = function(response){
				cache.put('followupSubTypes', response);
			};

			var post = function(attrs){

				var resourceItem;

				if(attrs.resource){
					resourceItem =
						urls.apiPaths[attrs.resource.resource] + '/' + attrs.resource.id;
				}else{
					resourceItem = '';
				}

				$http({
					url: urls.apiHost
						+ resourceItem
						+ urls.getCleanPath(urls.apiPaths.followups),
					method: 'POST',
					toastrMessages: attrs.toastrMessages,
					data: attrs.data,
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							mergeResource(response.data, attrs.resource);
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

			var mergeResource = function(item, resource){
				item.parentResources = item.parentResources || {};

				if(!item.parentResources[resource.resource]){
					item.parentResources[resource.resource] = {
						id: resource.id
					};
				}
			};

			var get = function(attrs){

				var resourceItem;

				if(attrs.resource){
					resourceItem =
						urls.apiPaths[attrs.resource.resource] + '/' + attrs.resource.id;
				}else{
					resourceItem = '';
				}

				$http({
					url: urls.apiHost
						+ resourceItem
						+ urls.getCleanPath(urls.apiPaths.followupsGroupByStatus),
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

			var getSubTypes = function(attrs){

				var cacheSubTypes = cache.get('followupSubTypes');

				if(cacheSubTypes){

					if(typeof attrs.success == 'function'){
						attrs.success(cacheSubTypes);
					}

					return;
				}

				$http({
					url: urls.apiHost + urls.apiPaths.followupsSubTypes,
					method: 'GET'
				}).then(
					function(response){
						if(typeof attrs.success == 'function'){
							attrs.success(response);
							saveCacheFollowup(response);
						}
					},
					function(response){
						if(typeof attrs.error == 'function'){
							attrs.error(response);
						}
					}
				);

			};

			var actions = function(attrs){

				$http({
					url: urls.apiHost + urls.apiPaths.followups
						+ '/' + attrs.item.id
						+ urls.apiPaths.followupsActions[attrs.action],
					method: 'POST',
					toastrMessages: attrs.toastrMessages,
					data: attrs.data || {}
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

			var getInteraction = function(item){
				return item.fields[getType(item)];
			};

			var getType = function(item){
				return Object.keys(item.fields)[0];
			};

			var factory = {
				get: get,
				post: post,
				actions: actions,
				getSubTypes: getSubTypes,
				getInteraction: getInteraction,
				getType: getType
			};

			return factory;
		}
	);

})();
