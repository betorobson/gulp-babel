
'use strict';

(function(){

	angular.module('views.calendar',[
		'views.calendar.list',
		'views.calendar.list-filter',
		'views.calendar.link-integration'
	])

	.controller(
		'ViewCalendarController',

		function(
			$scope,
			$routeParams,
			$timeout,
			destroyFactory,
			path,
			calendarService,
			listFactory,
			cardActionFactory,
			linkIntegrationFactory
		){
			path.setCurrent('calendar');

			$scope.loading = true;
			$scope.error = false;
			$scope.empty = false;

			$scope.breadcrumbs = [
				{
					label: path.getCurrent().label
				}
			];

			$scope.viewTitle = {
				title: 'Agenda',
				desc: ''
			};

			var gerFilterHashLink = function(attrs){

				return calendarService.gerFilterHashLink(
					path.getPath('calendar'),
					attrs,
					$routeParams
				);

			};

			$scope.listObj = {
				data: {},
				delegate: {
					get: function(attrs){
						var hashLink = gerFilterHashLink(attrs);
						$scope.mainController.go(hashLink);
					},
					gerFilterHashLink: gerFilterHashLink,
					cardActions: {
						postItem: function(item){
							isSameMonth(item);
						}
					},
					calendarListItem: {
						newAction: function(attrs){
							$scope.addNewAppointment(attrs);
						}
					},
					calendarListFilter: {
						newAction: function(attrs){
							$scope.addNewAppointment(attrs);
						}
					}
				}
			};

			$scope.showModalLinkIntegration = function(){
				linkIntegrationFactory.showModal();
			};

			var getMonthNameFilter = function(){
				return $scope.listObj.data.filters[0].initialValue
				? moment($scope.listObj.data.filters[0].initialValue).format('MMMM [de] YYYY')
				: null;
			};

			var success = function(response){
				$scope.listObj.data = response.data;
				$scope.empty = !response.data.data || !response.data.data.length;
				$scope.loading = false;
				setViewTitleDesc();
			};

			var isSameMonth = function(item){

				var interactionObj = item.fields[Object.keys(item.fields)[0]];

				if(!interactionObj.tarefa || interactionObj.tarefa.tarefaRealizado){
					return;
				}

				var currentMonth = $scope.listObj.data.filters[0].initialValue;
				var currentMonthYear;

				if(currentMonth){
					currentMonth = new Date(currentMonth);
					currentMonthYear = currentMonth.getMonth() + '-' + currentMonth.getFullYear();
				}

				var itemDate = new Date(interactionObj.tarefa.tarefaDtTarefa);
				var itemMonthYear = itemDate.getMonth() + '-' + itemDate.getFullYear();

				if(currentMonth && (currentMonthYear == itemMonthYear) || !currentMonth){

					if(!$scope.listObj.data.data){
						$scope.listObj.data.data = [];
						$scope.empty = false;
					}

					$scope.listObj.data.data.push(item);
				}

			};

			$scope.addNewAppointment = function(attrs){
				attrs = attrs || {};
				var resource = attrs.resource || { id: null, resource: 'transactions' };

				cardActionFactory.showModal({
					resource: resource,
					tabButtonActivated: attrs.resource ? null : 'activity',
					tabButtonAttrs: attrs.resource ? {} : {
						activity: {
							modelWhen: 'todo'
						}
					},
					delegate: $scope.listObj.delegate.cardActions
				});
			};

			var setViewTitleDesc = function(){
				$scope.viewTitle.desc = getMonthNameFilter() || '';
			};

			var get = function(attrs){

				$scope.empty = false;
				$scope.error = false;
				$scope.loading = true;

				calendarService.get(
					{
						link: attrs.link,
						params: attrs.params,
						success:  success,
						toastrMessages: {
							serverError: {
								onlyErrorMessage: true,
								title: 'Momentaneamente nenhum agendamento foi localizado.',
								message: 'Realize sua busca novamente.'
							}
						},
						error: function(response){
							$scope.error = response.config.errorMessage;
						}
					}
				);
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
