
'use strict';

(function(){

	angular.module('directives.card-actions',[
		'directives.card-actions-tab-button',
		'directives.card-actions-tour',
		'directives.card-actions-email',
		'directives.card-actions-call',
		'directives.card-actions-sms',
		'directives.card-actions-note',
		'directives.card-actions-activity',
		'directives.card-actions-whatsapp',
		'directives.card-actions-phone-select',
		'directives.card-actions-email-select',
		'directives.card-actions-sells',
		'directives.card-actions-select-client',
		'directives.card-actions.factory'
	])

	.controller(
		'CardActionsController',

		function(
			$scope,
			$element,
			$timeout,
			$rootScope,
			path,
			cardActionFactory,
			usersService,
			mainController
		){

			$scope.tabButtonAttrs = $scope.tabButtonAttrs || {};

			$scope.urlModuleSells = false;

			usersService.getUserProfile({
				success: function(response){
					$scope.urlModuleSells = response.data.extraInfo.contaSistemaVendasUrl;
				}
			});

			if(!$scope.hideTabButtons){
				$scope.hideTabButtons = false;
			}

			$scope.isHiddenTabButtons = function(){
				return $scope.hideTabButtons && $scope.tabButtonActivated;
			};

			$scope.delegate = $scope.delegate || {
				postItem: function(){
					console.log('directives.card-actions.delegate.postItem()');
				},
				reschedule: function(){
					console.log('directives.card-actions.delegate.reschedule()');
				}
			};

			var onlyTabButtonsList = [];
			$scope.cardActionsTabSelectedDelegate = {};

			var setOnlyTabButtonsList = function(){
				if(typeof $scope.onlyTabButtons === 'string' && $scope.onlyTabButtons != ''){
					onlyTabButtonsList = $scope.onlyTabButtons.split(',');
				}
			};

			$scope.isTabButtonListed = function(tabButton){

				return onlyTabButtonsList.length === 0 || onlyTabButtonsList.indexOf(tabButton) >= 0;
			};

			if(mainController.getDevice() == 'desktop' && !$scope.tabButtonActivated){
				$scope.tabButtonActivated = 'activity';
			}

			$scope.isActived = function(tabButton){
				return	$scope.tabButtonActivated == tabButton;
			};

			$scope.tabSelected = null;

			$scope.setTabSelected = function(attrs){

				$scope.tabSelected = attrs.targetId;

				var tabAction = $($element[0]).find('#tab-acoes-' + attrs.targetId);

				if(tabAction.length){
					$scope.tabButtonActivated = attrs.targetId;
					$($element[0]).find('.tab-pane').removeClass('active');
					tabAction.addClass('active');
				}

				if(typeof $scope.cardActionsTabSelectedDelegate[attrs.targetId] === 'function'){
					$scope.cardActionsTabSelectedDelegate[attrs.targetId](attrs);
				}

			};

			// set modal close delegate
			if($scope.modalDelegate){

				$scope.modalDelegate.reset = function(){

					$timeout(function(){
						$($element).find('.active').removeClass('active');
					}, 0);

					$scope.tabSelected = null;
				};

				$scope.modalDelegate.setTabSelected = $scope.setTabSelected;

			}

			$scope.cardActionsSelectClientDelegate = {
				setClientId: function(item){

					$scope.data = cardActionFactory
						.getNewCardActionsData()
						.update({
							title: item.extraInfo.produtoNome,
							emailFollowup: item.extraInfo.atendimentoFollowUpEmail,
							prospectNome: item.extraInfo.prospectNome,
							phones: item.extraInfo.prospectTelefones,
							emails: item.extraInfo.prospectEmails,
							urlModuleSells: item.extraInfo.integracaoVendasUrl
						});

					$scope.cardActionsItemDelegate.data = $scope.data;

					$scope.resource.id = item.id;

					if($scope.tabButtonActivated){
						$timeout(function(){
							$scope.setTabSelected({
								targetId: $scope.tabButtonActivated
							});
						});
					}

				}
			};

			$scope.cardActionsItemDelegate = {
				postItem: function(item){

					item.extraInfo = item.extraInfo || {};

					angular.merge(
						item,
						{
							extraInfo: {
								prospectNome: $scope.data.prospectNome
							}
						},
						{
							extraInfo: item.extraInfo
						}
					);

					$scope.delegate.postItem(item);
				},
				data: $scope.data,
				tabButtonAttrs: $scope.tabButtonAttrs
			};

			var contactActionLinks = {};

			$scope.getContactActionLinks = function(){
				angular.merge(contactActionLinks, cardActionFactory.getContactLinks($scope.data));

				return contactActionLinks;
			};

			$scope.goToClient = function(){

				if($scope.resource.resource == 'transactions'){
					$rootScope.mainController.go(path.get('transaction').withItem({
						id: $scope.resource.id
					}));
				}

				if($scope.modalDelegate){
					$scope.modalDelegate.hide();
				}

			};

			if($scope.resource.id && !$scope.data){

				$scope.loading = true;

				cardActionFactory.getItemByResource({
					resource: $scope.resource,
					success: function(data){
						$scope.cardActionsSelectClientDelegate.setClientId(data);
						$scope.loading = false;
					},
					error: function(){
						if($scope.modalDelegate){
							$scope.modalDelegate.hide();
						}
					}
				});

			}

			setOnlyTabButtonsList();

		}
	)

	.directive('cardActions', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions.html',
			controller: 'CardActionsController',
			scope: {
				delegate: '=?',
				modalDelegate: '=?modalDelegate',
				resource: '=resource',
				data: '=?data',
				onlyTabButtons: '@',
				tabButtonActivated: '@',
				tabButtonAttrs: '=?',
				hideTabButtons: '=?'
			}
		};

	});

})();
