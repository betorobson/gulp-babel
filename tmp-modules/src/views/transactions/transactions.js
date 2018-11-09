
'use strict';

(function(){

	angular.module('views.transactions',[])

	.controller(
		'ViewTransactionsController',

		function(
			$scope,
			$timeout,
			$routeParams,
			$location,
			path,
			transactionsService,
			pipelinesService,
			stageFormFactory,
			listFactory,
			navigationBarFactory,
			destroyFactory,
			notificationCenterTransactionsAwaiting,
			pendingProcessingService
		){

			navigationBarFactory.backButton.hide();

			path.setCurrent('transactions');

			$scope.breadcrumbs = [
				{
					label: path.getCurrent().label,
					path: false
				}
			];

			$scope.loading = true;
			$scope.empty = false;
			$scope.error = false;

			var generateStageSelectOption = function(response){
				if(!$scope.listObj.stageSelectOptions.length){
					$scope.listObj.stageSelectOptions = response.data.data;
					attachStagesToTransactions();
				}
			};

			var attachStagesToTransactions = function(){

				var stagesById = {};
				$scope.listObj.stageSelectOptions.map(function(item){
					stagesById[item.id] = item;
				});

				$scope.listObj.data.data.map(function(item){
					item.originalStageItem = item.stageItem =
						stagesById[item.fields.atendimento.atendimentoPipelineStageIdGuid];
				});

			};

			var viewStatuses = null;

			var setViewStatuses = function(filters){

				if(!viewStatuses){

					viewStatuses = {};

					filters.map(function(item){
						if(item.field == 'atendimentoStatus'){
							viewStatuses.defaultValue = item.defaultValue;
							item.options.map(function(status){
								viewStatuses[status.value] = status.name;
							});
						}
					});

				}

			};

			$scope.viewTitle = {};

			var setViewTitle = function(attrs, filters){

				setViewStatuses(filters);

				$scope.viewTitle.title = path.getCurrent().label;

				if(attrs.params && attrs.params.filters && attrs.params.filters.atendimentoStatus){
					$scope.viewTitle.desc = viewStatuses[attrs.params.filters.atendimentoStatus];
				}else{
					$scope.viewTitle.desc = viewStatuses[viewStatuses.defaultValue];
				}

			};

			var fixWhenEmptyFilterByWaitingClients = function(filter){

				if(
					$scope.empty
					&&
					filter
					&&
					filter.filters
					&&
					Object.keys(filter.filters)[0] == 'atendimentoStatus'
					&&
					filter.filters.atendimentoStatus == transactionsService.statuses.queue
					&&
					filter.removeFilterWhenEmpty
					&&
					notificationCenterTransactionsAwaiting.getTotalNewClients() > 0
				){
					pendingProcessingService.setEmptyTransactionsAwaiting();
					$scope.mainController.go(path.getPath('transactions'), true);
				}

			};

			var get = function(attrs){

				$scope.empty = false;
				$scope.loading = true;
				$scope.error = false;

				transactionsService.get(
					{
						params: attrs.params,
						link: attrs.link,
						toastrMessages: {
							serverError: {
								title: 'Momentaneamente nenhum atendimento foi localizado.',
								message: 'Realize sua busca novamente.'
							}
						},
						success: function(response){

							$scope.listObj.data = response.data;
							$scope.loading = false;
							$scope.empty = !response.data.data || !response.data.data.length;

							fixWhenEmptyFilterByWaitingClients(attrs.params);

							if(!$scope.empty){
								pipelinesService.get({
									success: generateStageSelectOption,
									toastrMessages: {
										serverError: {
											onlyErrorMessage: true,
											title: 'Desculpe, estamos momentaneamente com dificuldades para permitir a troca de fases dos atendimentos',
											message: 'Por favor, tente novamente mais tarde, obrigado.'
										}
									}
								});
							}

							if(attrs.success){
								attrs.success();
							}

							setViewTitle(attrs, response.data.filters);

						},
						error: function(response){
							$scope.error = response.config.errorMessage;
						}
					}
				);
			};

			var gerFilterHashLink = function(attrs){

				return transactionsService.gerFilterHashLink(
					path.getPath('transactions'),
					attrs,
					$routeParams
				);

			};

			$scope.listObj = {
				data: {},
				stageSelectOptions: [],
				delegate: {
					get: function(attrs){
						var hashLink = gerFilterHashLink(attrs);
						$scope.mainController.go(hashLink);
					},
					gerFilterHashLink: gerFilterHashLink
				}
			};

			$scope.$on(
				'$viewContentLoaded',
				function(){
					$timeout(function(){

						var attrs = listFactory.getAttrsFromRouteParams($routeParams);

						get(attrs);

					}, 0);
				}
			);

			$scope.$on(
				'$destroy',
				function() {
					navigationBarFactory.backButton.show();
				}
			);

			destroyFactory({
				scope: $scope,
				objects: [
					$scope.listObj
				]
			});

		}
	)

	;

})();
