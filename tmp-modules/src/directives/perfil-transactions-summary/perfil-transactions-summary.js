
'use strict';

(function(){

	angular.module('directives.perfil-transactions-summary',[
		'services.transactions-summary'
	])

	.controller(
		'PerfilTransactionsSummaryController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$element,
			transactionsSummaryService,
			path,
			urls,
			transactionsService,
			notificationCenterTransactionSumary
		){

			$scope.mainController = $rootScope.mainController;

			$scope.loading = true;
			$scope.error = false;
			$scope.empty = true;

			$scope.properties = transactionsSummaryService.properties;
			$scope.data = {};

			$scope.linkViewTransactions = path.getPath('transactions');

			var nestedStagesNormalize = function(obj){
				return obj[$scope.properties.stages.nestedStages]
					.join(', ')
					.replace(
						new RegExp(obj[$scope.properties.stages.name] + '*.?/', 'g'),
						'<br />'
					)
					.replace(/,.</g,'<')
					.replace('<br />','');
			};

			$scope.get = function(obj, property){
				if(property == $scope.properties.stages.nestedStages){
					return nestedStagesNormalize(obj);
				}else{
					return obj[property];
				}
			};

			$scope.getFormattedName = function(name){
				return name.replace(/^.+\/./,'');
			};

			$scope.showSubStage = function(item, subStage){
				item.activeSubStage = subStage;
			};

			$scope.hideSubStage = function(item){
				item.activeSubStage = null;
			};

			var hashLinks = {};

			$scope.getLinkFilter = function(item){

				if(hashLinks[item.href]){
					return hashLinks[item.href];
				}

				var filterJSON = transactionsService.getJSONFilterFromHref(item.href);

				if(filterJSON){
					hashLinks[item.href] = transactionsService.gerFilterHashLink(
						$scope.linkViewTransactions,
						{
							params:{
								q: '',
								filters: filterJSON
							}
						}
					);
				}else{
					hashLinks[item.href] = path.getPath('transactions');
				}

				return hashLinks[item.href];

			};

			var error = function(){
				$scope.loading = false;
				$scope.error = true;
			};

			var setStageTransactionsPercent = function(group, percent){
				group[$scope.properties.stages.percentTransactions] += percent;

				if(group[$scope.properties.stages.percentTransactions] >= 1){
					group[$scope.properties.stages.percentTransactions] = Math.floor(group[$scope.properties.stages.percentTransactions]);
				}

			};

			var setStageValuePercent = function(group, percent){
				group[$scope.properties.stages.valuePercent] += percent;

				if(group[$scope.properties.stages.valuePercent] >= 1){
					group[$scope.properties.stages.valuePercent] = Math.floor(group[$scope.properties.stages.valuePercent]);
				}
			};

			var setNestedStages = function(){

				var pipelines = $scope.data.resumoNegocios;
				$scope.data.resumoNegocios = [];

				var groups = {};
				pipelines.map(function(pipeline){

					var group = pipeline.resumoNegocioPipelineStageGrupo;

					if(!groups[group]){
						groups[group] = {
							subStages: []
						};
						groups[group].href = urls.apiPaths.transactions + '?filters='
							+ JSON.stringify({pipelineStageGrupo:group});
						groups[group][$scope.properties.stages.name] = group;
						groups[group][$scope.properties.stages.nestedStages] = [];
						groups[group][$scope.properties.stages.value] = 0;
						groups[group][$scope.properties.stages.transactions] = 0;
						groups[group][$scope.properties.stages.percentTransactions] = 0;
						groups[group][$scope.properties.stages.valuePercent] = 0;

						$scope.data.resumoNegocios.push(groups[group]);
					}

					groups[group][$scope.properties.stages.transactions] +=
						pipeline[$scope.properties.stages.transactions];

					groups[group][$scope.properties.stages.nestedStages].push(
						pipeline[$scope.properties.stages.name]
					);

					setStageTransactionsPercent(groups[group], pipeline[$scope.properties.stages.percentTransactions]);
					setStageValuePercent(groups[group], pipeline[$scope.properties.stages.valuePercent]);

					groups[group][$scope.properties.stages.value] +=
						pipeline[$scope.properties.stages.value];

					groups[group].subStages.push(pipeline);

				});

			};

			var perfilTransactionsSummarySucess = function(data){

				if(!data.fields){
					error();

					return;
				}

				$scope.empty = false;
				$scope.data = angular.copy(data.fields);

				setNestedStages();

				$scope.loading = false;

				$timeout(function(){
					$($element).find('[data-toggle="tooltip"]').tooltip({
						html: true
					});
				},0);

			};

			var dispatchCallbackAttrs = {
				success: perfilTransactionsSummarySucess
			};
			notificationCenterTransactionSumary.dispatchCallback(dispatchCallbackAttrs);

			$scope.$on(
				'$destroy',
				function(){
					// prevent memory leaks
					dispatchCallbackAttrs.success = null;
				}
			);

		}
	)

	.directive('perfilTransactionsSummary', function(){
		return {
			restrict: 'E',
			templateUrl: 'perfil-transactions-summary/perfil-transactions-summary.html',
			controller: 'PerfilTransactionsSummaryController',
			scope: {

			}
		};
	});

})();
