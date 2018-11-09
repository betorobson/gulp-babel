
'use strict';

(function(){

	angular.module('views.calendar.list-item', [])

	.controller(
		'ViewCalendarListItemController',
		function(
			$scope,
			$element,
			$popover,
			$timeout,
			$rootScope,
			$modal,
			$sce,
			followupService,
			usersService
		){

			$scope.hasAlarm;
			$scope.hasTaskToBeDone;
			$scope.loading = false;
			$scope.showItemUser = false;
			$scope.descriptionItem;

			var showModalReschedule = function() {

				var cardActionsNoteDelegate = $scope.cardActionsNoteDelegate;
				var item = $scope.item;

				$modal({
					templateUrl: 'calendar/directives/list-item/list-item-note-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope) {
						$scope.cardActionsNoteDelegate = cardActionsNoteDelegate;
						$scope.item = item;

						$scope.modalDelegate = {
							hide: function(){
								$scope.cardActionsNoteDelegate.hide();
							}
						};
					},
					onHide: function() {
						console.log('modalAddClient hide');
					}
				});

			};

			$scope.addNewAppointment = function(){
				if($scope.delegate.calendarListItem.newAction){

					$scope.delegate.calendarListItem.newAction({
						resource: $scope.clientContactsResource
					});
				}
			};

			$scope.cardActionsNoteDelegate = {
				reschedule: function(item){
					var oldItem = $scope.item;

					$scope.delegate.patchItem(oldItem, item);

					processItem();

					$scope.modalDelegate.hide();

					console.log('itemreschedule', $scope.item);

				}
			};

			$scope.canExpandDescription = false;
			$scope.expandedDescription = false;

			$scope.expandDescription = function(event){

				if(
					$scope.expandedDescription
					&&
					$(event.target).closest('.description-task').length
				){
					event.stopPropagation();
				}

				$scope.expandedDescription = !$scope.expandedDescription;
				setDescription();

			};

			var setDescription = function(){

				var desc = $scope.interaction.interacaoTexto || '';

				if(desc.length > 100 && !$scope.expandedDescription){

					$scope.canExpandDescription = true;

					desc = desc.substring(0,100) + '...';

				}

				$scope.descriptionItem = $sce.trustAsHtml(desc.replace(/\n/g, '<br />'));

			};

			$scope.submitStatus = {
				success: false,
				error: false
			};

			var getToastMessage = function(action){

				return {
					serverError: {
						title: 'Desculpe, estamos com dificuldades para '
							+ action
							+ ' esse item',
						message: 'Tente novamente mais tarde, obrigado.'
					}
				};

			};

			var postExecute = function(callback){
				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

					if(callback){
						callback();
					}

				},500);
			};

			$scope.done = function(){

				$scope.loading = true;

				followupService.actions({
					item: $scope.item,
					action: 'taskDone',
					data: {
						fields: {
							tarefa: {
								tarefaRealizado: true
							}
						}
					},
					toastrMessage: getToastMessage('atualizar'),
					success: function(response){
						$scope.submitStatus.success = true;
						// $scope.overdue = false;
						postExecute();
						$scope.cardActionsNoteDelegate.reschedule(response.data);
					},
					error: function(){
						$scope.submitStatus.error = true;
						postExecute();
					}
				});

			};

			$scope.modalDelegate = {
				hide: function(){
					if(reschedulePopover){
						reschedulePopover.hide();
					}
				}
			};

			var setItem = function(){
				$scope.interaction = followupService.getInteraction($scope.item);
			};

			$scope.getType = function(){
				var type = followupService.getType($scope.item);

				if(
					/interacaoNota|interacaoAtividade/.test(type)
					&&
					$scope.interaction.interacaoTipoSub
				){
					return true;
				}

				return false;
			};

			var setActionsButtons = function(){
				if($scope.interaction.interacaoRealizado){
					$scope.hasTask = false;
					$scope.hasTaskToBeDone = false;
					$scope.hasAlarm = false;
				}else{
					$scope.hasTask = !!$scope.interaction.tarefa;
					$scope.hasTaskToBeDone = $scope.hasTask && !$scope.interaction.interacaoRealizado;
					$scope.hasAlarm = !$scope.interaction.interacaoRealizado
						&& $scope.hasTask && !!$scope.interaction.tarefa.alarme;
				}
			};

			var processItem = function(){
				setItem();
				setActionsButtons();
				setDescription();
				setReschedulePopover();
			};

			var reschedulePopover;

			var setReschedulePopover = function(){
				if($scope.hasAlarm && $rootScope.mainController.device == 'desktop'){
					$timeout(function(){

						reschedulePopover = $popover(
							angular.element($element[0].querySelector('.dropdown-toggle')),
							{
								scope: $scope,
								title: 'Reagendar', //[todo] remove
								contentTemplate: 'calendar/directives/list-item/list-item-note-popover.html',
								trigger: 'manual',
								autoClose: true,
								animation: 'am-flip-x',
								placement: 'bottom-left'
							}
						);

					});
				}
			};

			$scope.reschedule = function(){
				if($rootScope.mainController.device == 'desktop'){
					reschedulePopover.show();
				}else{
					showModalReschedule();
				}
			};

			$scope.clientContactsResource = {
				id: $scope.item.parentResources.transactions.id,
				resource: 'transactions'
			};

			var setUser = function(){

				usersService.getUserProfile({
					success: function(response){
						if(
							response.data.id
							!=
							$scope.interaction.interacaoAtorPartida.usuario.usuarioIdGuid
						){
							$scope.showItemUser = true;
						}
					}
				});

			};

			processItem();
			setUser();
		}
	)

	.directive('calendarListItem', function(){
		return {
			restrict: 'E',

			scope: {
				item: '=',
				delegate: '=delegate'
			},
			controller: 'ViewCalendarListItemController',
			templateUrl: 'calendar/directives/list-item/list-item.html'
		};

	})

	;

})();
