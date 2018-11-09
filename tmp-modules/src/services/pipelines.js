
'use strict';

(function(){

	angular.module('services.pipelines', [])

		.run(function(CacheFactory){

			CacheFactory(
				'cachePipelinesService',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage'
				}
			);

		})

		.factory(

			'pipelinesService',

			function(
				$http,
				CacheFactory,
				urls
			){

				var cache = CacheFactory.get('cachePipelinesService');

				var saveEachPipelineOnCache = function(response){

					response.data.data.map(function(item){

						var newResponse = angular.copy(response);
						newResponse.data = item;

						cache.put(
							'pipelines/'
							+ item.fields.pipelineStage.pipelineStageIdGuid,
							newResponse
						);

					});

				};

				var get = function(attrs){

					var cachePipelines = cache.get('pipelines');

					if(cachePipelines){

						if(typeof attrs.success == 'function'){
							attrs.success(cachePipelines);
						}

						return;
					}

					$http({
						url: urls.apiHost + urls.apiPaths.pipelines,
						method: 'GET',
						toastrMessages: attrs.toastrMessages
					}).then(
						function(response){

							cache.put('pipelines', response);

							saveEachPipelineOnCache(response);

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

				var getItem = function(attrs){

					var cachePipeline = cache.get('pipelines/' + attrs.id);

					if(cachePipeline){

						if(typeof attrs.success == 'function'){
							attrs.success(cachePipeline);
						}

						return;
					}

					$http({
						url: urls.apiHost + urls.apiPaths.pipelines + '/' + attrs.id,
						method: 'GET'
					}).then(
						function(response){

							cache.put('pipelines/' + attrs.id, response);

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

					get: get,
					getItem: getItem

				};

				return service;

			});

})();
