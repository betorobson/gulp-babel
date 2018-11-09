
'use strict';

(function(){

	angular.module('directives.card-followup-item',[
		'directives.card-followup-email',
		'directives.card-followup-email-modal',
		'directives.card-followup-ligacao',
		'directives.card-followup-chat',
		'directives.card-followup-sells'
	])

	.factory(
		'cardFollowupItemFactory',

		function(){

			var

				typeSVGIcon = {
					interacaoNota: 'note',
					interacaoAtividade: 'appointment',
					call: 'phone',
					interacaoEmail: 'envelope',
					interacaoLog: 'gear',
					interacaoChat: 'chat3',
					interacaoLigacao: 'phone',
					done: 'checked',
					interacaoNegociacao: {
						'defaultType': 'house-with-dollar-sign2',
						'NEGOCIACAOSIMULACAO': 'house-calculator',
						'NEGOCIACAOPROPOSTA': 'house-calculator'
					}
				},

				contentByType = {
					interacaoAtividade: 'interacaoTexto',
					interacaoNota: 'interacaoTexto',
					interacaoChat: 'interacaoChatConversas',
					interacaoLog: 'interacaoTexto',
					interacaoLigacao: 'interacaoLigacaoDuracao',
					interacaoEmail: 'interacaoEmailAssunto'
				};

			var getTypeSVGIcon = function(type, interaction){

				if(typeSVGIcon[type].defaultType){

					return typeSVGIcon[type][interaction.interacaoTipoSubSys] || typeSVGIcon[type].defaultType;

				}else{

					return typeSVGIcon[type];

				}

			};

			return {
				getTypeSVGIcon: getTypeSVGIcon,
				contentByType: contentByType
			};

		}
	)

	.controller(
		'CardFollowupItemController',

		function(
			$scope,
			$timeout,
			$sce,
			path,
			cardFollowupItemFactory,
			followupService,
			originalEmailFactory,
			ligacaoFollowupFactory,
			chatFollowupFactory,
			sellsFollowupFactory
		){

			var
				type,
				cardContentSize = 200;

			// to be used when set pill colors`
			$scope.clientName;

			var generateContentByType = {
				interacaoChat: function(){

					return chatFollowupFactory.generateChatContent({
						item: $scope.item.fields.interacaoChat
					});
				},
				interacaoLigacao: function(){

					return ligacaoFollowupFactory.generateLigacaoContent({
						item: $scope.item.fields.interacaoLigacao
					});
				},
				interacaoNegociacao: function(){

					return sellsFollowupFactory.generateContent({
						item: $scope.item.fields.interacaoNegociacao
					});
				}
			};

			var setContentHashTags = function(){
				$scope.content = $sce.trustAsHtml(
					$scope.content.replace(
						/(#.*?)(\s|\n|$)/g,
						function(arg1, arg2, arg3){
							return '<a href="'
							+ path.getPath('transactions')
							+ encodeURIComponent(arg1)
							+ '">' + arg2 + '</a>' + arg3;
						}
					)
				);
			};

			var setContent = function(){
				$scope.content = generateContentByType[type]
					? generateContentByType[type]()
					: $scope.interaction[cardFollowupItemFactory.contentByType[type] || 'interacaoTexto'];
			};

			var setItem = function(){
				type = followupService.getType($scope.item);
				$scope.interaction = followupService.getInteraction($scope.item);
			};

			$scope.getTypeInteraction = function(){
				var type = followupService.getType($scope.item);

				if(
					/interacaoNota|interacaoAtividade|interacaoNegociacao/.test(type)
					&&
					$scope.interaction.interacaoTipoSub
				){
					return true;
				}

				return false;
			};

			var getAlarmDate = function(){

				if($scope.interaction.tarefa && $scope.interaction.tarefa.alarme){
					return $scope.interaction.tarefa.alarme.alarmeDtAlarme;
				}

				return false;

			};

			var setDateTemplate = function(){
				$scope.dateTemplate = getAlarmDate()
					|| $scope.interaction.interacaoDtConclusao
					|| $scope.interaction.interacaoDtInclusao;
			};

			var setDropdownMenu = function(){
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

			$scope.toggleDropdownMenu = function(event){

				event.stopPropagation();

				$($(event.target).closest('.btn-group')).find('.dropdown-menu').dropdown('toggle');

			};

			$scope.getDescriptionBodyClass = function(){
				return {
					'hidden-content': $scope.showButtonMoreContent && $scope.isContentHidden,
					'display-content': $scope.showButtonMoreContent && !$scope.isContentHidden
				};
			};

			$scope.showButtonMoreContent = false;
			$scope.isContentHidden = true;

			$scope.toggleHiddenContent = function(){
				$scope.isContentHidden = !$scope.isContentHidden;
			};

			var setShowButtonMoreContent = function(){
				var content = $scope.content;

				if(content.length > cardContentSize){
					$scope.showButtonMoreContent = true;
				}

			};

			var processItem = function(){
				setItem();
				setContent();
				setShowButtonMoreContent();
				setContentHashTags();
				setDateTemplate();
				setDropdownMenu();
				setAvatarItem();
			};

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.resource = $scope.$parent.resource;

			$scope.modalDelegate = {
				hide: function(){
					$scope.edit = false;
				}
			};

			$scope.getSVGIcon = function(){

				return cardFollowupItemFactory.getTypeSVGIcon(type, $scope.interaction);

				// if(/interacaoNota|interacaoAtividade/.test(type)
				// 	&& $scope.interaction.interacaoRealizado
				// 	&& $scope.interaction.tarefa
				// ){
				// 	svgIcon = typeSVGIcon['done'];
				// }

				// return svgIcon;
			};

			$scope.edit = false;

			$scope.activeEdit = function(){
				$scope.edit = true;
			};

			$scope.done = function(){

				$scope.edit = false;

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
					toastrMessages: getToastMessage('atualizar'),
					success: function(response){
						$scope.submitStatus.success = true;
						postExecute();
						$scope.itemDelegate.reschedule(response.data);
					},
					error: function(){
						$scope.submitStatus.error = true;
						postExecute();
					}
				});

			};

			// $scope.deleteItem = function(){

			// 	$scope.loading = true;

			// 	followupService.deleteItem({
			// 		item: $scope.item,
			// 		success: function(response){
			// 			$scope.submitStatus.success = true;
			// 			postExecute(function(){
			// 				$scope.delegate.deleteItem($scope.item);
			// 			});
			// 			showToast(response);
			// 		},
			// 		error: function(response){
			// 			$scope.submitStatus.error = true;
			// 			postExecute();
			// 			showToast(response);
			// 		}
			// 	});

			// };

			$scope.getOriginalEmail = function() {

				originalEmailFactory.show({
					item: $scope.item
				});

			};

			$scope.itemDelegate = {
				reschedule: function(item){

					var oldItem = $scope.item;

					$scope.item = item;

					processItem();

					itemClass.overdue = false;

					if($scope.interaction.tarefa){
						if($scope.interaction.tarefa.tarefaRealizado){
							itemClass.due = false;
						}else{
							itemClass.due = true;
						}
					}

					$scope.delegate.patchItem(oldItem, item);

				}
			};

			$scope.getType = function(){
				return type;
			};

			$scope.isType = function(itemType){
				return type == itemType;
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

			if($scope.item.added){
				$timeout(function(){
					delete $scope.item.added;
				},1000);
			}

			$scope.isOverdue = function(){
				return itemClass.overdue;
			};

			var itemClass = {
				overdue: $scope.overdue === 'true',
				due: $scope.due === 'true'
			};

			$scope.getItemClass = function(){
				return itemClass;
			};

			$scope.avatarItem = {};

			var setAvatarItem = function(){

				$scope.avatarItem= angular.merge(
					{},
					$scope.interaction.interacaoAtorPartida.usuario,
					$scope.interaction.interacaoAtorPartida.prospect
				);

			};

			$scope.hasAvatar = function(){

				return $scope.avatarItem.usuarioUrlImagem || $scope.avatarItem.prospectUrlImagem;
			};

			processItem();

		}
	)

	.directive('cardFollowupItem', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-followup/item/item.html',
			controller: 'CardFollowupItemController',
			scope: {
				overdue: '@',
				due: '@',
				item: '=item',
				delegate: '=delegate'
			}
		};

	});

})();
