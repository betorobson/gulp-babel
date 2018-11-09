
'use strict';

(function(){

	angular.module('services.transactions-summary', [])

		.run(function(CacheFactory){

			CacheFactory(
				'cacheNestedStages',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage'
				}
			);

		})

		.factory(

			'transactionsSummaryService',

			function(
				$http,
				CacheFactory,
				urls
			){

				var cacheNestedStages = CacheFactory.get('cacheNestedStages');

				var saveCacheNestedStages = function(response){
					cacheNestedStages.put('stages', response);
				};

				// translate pt-br properties into a better and friendly understanding
				var properties = {
					updated: 'resumoNegocioDtUltimaAtualizacao',
					totalValue: 'resumoNegocioVolumeFinanceiroTotal',
					totalCommission: 'resumoNegocioComissaoTotal',
					lastStageCommision: 'resumoNegocioComissaoUltimaFase',
					totalTransactions: 'resumoNegocioQtdNegociosTotal',
					stages: {
						index: 'resumoNegocioPipelineStageOrdem',
						items: 'resumoNegocios',
						name: 'resumoNegocioPipelineStageNome',
						nestedStages: 'resumoNegocioPipelineStageAgrupado',
						transactions: 'resumoNegocioQtdNegocios',
						value: 'resumoNegocioVolumeFinanceiroValor',
						subStages: 'subStages',
						percentTransactions: 'resumoNegocioQtdNegociosPercent',
						valuePercent: 'resumoNegocioVolumeFinanceiroPercent'
					}
				};

				var get = function(attrs){

					var defaultParams = {
						agruparSuperGrupo: true
					};

					attrs.params = angular.merge(defaultParams, attrs.params);

					$http({
						url: urls.apiHost + urls.apiPaths.transactionsSummary,
						method: 'GET',
						params: attrs.params,
						toastrMessages: attrs.toastrMessages
					}).then(
						function(response){
							if(typeof attrs.success == 'function'){

								if(attrs.params.agruparSuperGrupo === false){
									saveCacheNestedStages(response);
								}

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

				var getNestedStages = function(attrs){

					var defaultParams = {
						agruparSuperGrupo: false
					};

					attrs.params = angular.merge(defaultParams, attrs.params);

					service.get(attrs);
				};

				var getCacheNestedStages = function(attrs){

					attrs = attrs || {};

					var stages = cacheNestedStages.get('stages');

					if(stages && attrs.success){
						attrs.success(stages);
					}else{
						service.getNestedStages(attrs);
					}

				};

				var service = {

					properties: properties,
					get: get,
					getNestedStages: getNestedStages,
					getCacheNestedStages: getCacheNestedStages

				};

				return service;

			});

})();
