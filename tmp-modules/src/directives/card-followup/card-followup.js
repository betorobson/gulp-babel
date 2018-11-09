
'use strict';

(function(){

	angular.module('directives.card-followup',[
		'directives.card-followup-item',
		'services.followup'
	])

	.controller(
		'CardFollowupController',

		function(
			$scope,
			$timeout,
			followupService
		){

			$scope.loading = true;
			$scope.data = {
				fields: []
			};

			var filterByType;

			$scope.getClass = function(item){
				return {
					removed: item.removed,
					added: item.added && !item.removed
				};
			};

			$scope.toggleFilterByType = function(type){

				var index = filterByType.indexOf(type);

				if(index < 0){
					filterByType.push(type);
				}else{
					filterByType.splice(index,1);
				}

			};

			$scope.isTypeInFilterList = function(item){

				if(item.constructor.name == 'String'){
					return filterByType.indexOf(item) >= 0;
				}else if(filterByType.length === 0){
					return true;
				}else if(item.fields){

					var itemType = Object.keys(item.fields)[0];

					if(!$scope.summaryLabels[itemType]){
						itemType = 'interacaoLog';
					}

					return filterByType.indexOf(itemType) >= 0;
				}

				return false;

			};

			$scope.summaryLabels = {
				interacaoAtividade: 'Atividades',
				interacaoVisita: 'Visitas',
				interacaoEmail: 'E-mails',
				interacaoChat: 'Chat',
				interacaoLigacao: 'Ligações',
				interacaoNegociacao: 'Proposta e Venda',
				interacaoNota: 'Notas',
				interacaoLog: 'Sistema'
			};

			var setFilterByType = function(){

				if(Object.keys($scope.summary).length > 1 && !filterByType){
					filterByType = Object.keys($scope.summaryLabels).filter(function(item){
						return item != 'interacaoLog';
					});
				}

				filterByType = filterByType || [];

			};

			var setSummary = function(){

				$scope.summary = {};

				var items = [].concat(
					$scope.data.fields.due,
					$scope.data.fields.overdue,
					$scope.data.fields.done,
					$scope.data.fields.unread
				);

				items.map(function(item){
					if(item){

						var itemType = Object.keys(item.fields)[0];

						if(!$scope.summaryLabels[itemType]){
							itemType = 'interacaoLog';
						}

						$scope.summary[itemType] =
							!$scope.summary[itemType] ? 1 : $scope.summary[itemType] + 1;

					}
				});

				setFilterByType();

			};

			var deleteItem = function(item){

				var items = $scope.data.data;

				item.removed = true;

				if(items.overdue && items.overdue.indexOf(item) > -1){
					items = items.overdue;
				}else if(items.due && items.due.indexOf(item) > -1){
					items = items.due;
				}

				$timeout(function(){
					items.splice(items.indexOf(item), 1);
					setSummary();
				},500);

			};

			var addLogItem = function(item){
				$scope.data.fields.done = $scope.data.fields.done || [];
				$scope.data.fields.done.splice(0,0,item);
				setSummary();
			};

			var addDueItem = function(item){
				$scope.data.fields.due = $scope.data.fields.due || [];
				$scope.data.fields.due.splice(0,0,item);
				setSummary();
			};

			var patchItem = function(oldItem, newItem){

				var items = $scope.data.fields;

				if(items.overdue.indexOf(oldItem) > -1){
					items = items.overdue;
				}else if(items.due.indexOf(oldItem) > -1){
					items = items.due;
				}else if(items.done.indexOf(oldItem) > -1){
					items = items.done;
				}

				var index = items.indexOf(oldItem);
				items[index] = newItem;

			};

			$scope.followupItemDelegate = {
				deleteItem: deleteItem,
				patchItem: patchItem
			};

			$scope.delegate.addItem = function(item){

				var type = Object.keys(item.fields)[0];
				item.added = true;

				if(item.fields[type].tarefa && item.fields[type].tarefa.alarme){
					addDueItem(item);
				}else{
					addLogItem(item);
				}

			};

			var success = function(response){

				$scope.loading = false;
				$scope.data = response.data;

				setSummary();

				if($scope.delegate.getSuccess){
					$scope.delegate.getSuccess(response.data);
				}

			};

			var error = function(){
				$scope.loading = false;
			};

			followupService.get({
				resource: $scope.resource,
				success: success,
				error: error,
				toastrMessages: {
					serverError: {
						title: 'Desculpe, estamos com dificuldades para exibir as interações e tarefas desse atendimento.'
					}
				}
			});

		}
	)

	.directive('cardFollowup', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-followup/card-followup.html',
			controller: 'CardFollowupController',
			scope: {
				modalDelegate: '=?modalDelegate',
				delegate: '=?',
				resource: '=resource'
			}
		};

	});

})();
