
'use strict';

(function(){

	angular.module('directives.card-actions.factory', [])

	.factory(
		'cardActionFactory',

		function(
			$modal,
			followupService,
			mainController,
			transactionsService
		){

			var modalTitlesByTabName = {
				default: 'Ações',
				activity: 'Atividade',
				note: 'Nota',
				'call-activity': 'Ligação',
				email: 'E-mail',
				whatsapp: 'WhatsApp',
				sells: 'Proposta e Venda'
			};

			var getContactLinks = function(data){

				return {
					email: 'mailto:'
						+ data.emailClient
						+ '?subject='
						+ (data.title || '')
						+ '&cc='
						+ data.emailFollowup
						+ '&body='
						+ 'Olá '
						+ data.prospectNome
						+ ',%0A%0A%0A',
					phone: data.phoneClient ? 'tel:' + data.phoneClient : null,
					whatsapp: data.phoneClient ? '//wa.me/55' + data.phoneClient : null,
				};

			};

			var getSubTypeId = function(attrs){
				followupService.getSubTypes({
					success: function(response){

						var id;

						response.data.data.map(function(item){
							if(item.fields.interacaoTipoSubSys == attrs.interacaoTipoSub){
								id = item.fields.interacaoTipoSubIdGuid;
							}
						});

						if(typeof attrs.success == 'function'){
							attrs.success(id);
						}

					}
				});
			};

			var preventModalAndPerformAction = function(attrs){

				if(attrs.data){

					attrs.data.emails = attrs.data.emails || [];

					var contactLinks = getContactLinks(attrs.data);

					if(
						attrs.tabButtonActivated == 'email'
						&&
						attrs.data.emails.length == 1
					){

						if(mainController.getDevice() == 'desktop'){
							window.open(contactLinks.email, 'AnaproAppSendEmail');
						}else{
							document.location = contactLinks.email;
						}

						return true;

					}

				}

				return false;

			};

			var showModal = function(attrs){

				if(preventModalAndPerformAction(attrs)){
					return;
				}

				return $modal({
					templateUrl: 'card-actions/card-actions-modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope,$timeout){

						$scope.hideTabButtons = true;
						$scope.cardActionsAttrs = attrs;

						var setTitle = function(tabName){
							$scope.title =
								modalTitlesByTabName[tabName || 'noop']
								||
								modalTitlesByTabName[$scope.cardActionsAttrs.tabButtonActivated]
								||
								modalTitlesByTabName['default'];
						};

						$scope.delegate = {
							setTitle: setTitle
						};

						if($scope.cardActionsAttrs.tabButtonActivated){
							$timeout(function(){
								$scope.delegate.setTabSelected({
									targetId: $scope.cardActionsAttrs.tabButtonActivated
								});
							});
						}

						setTitle();

					},
					onHide: function(){
						console.log('directives.card-actions.factory.modal.onHide');
					},

				});

			};

			var getNewCardActionsData = function(){

				var data = {
					title: '',
					emailFollowup: '',
					prospectNome: '',
					emailClient: null,
					emails: [],
					phoneClient: null,
					phones: [],
					urlModuleSells: null
				};

				data.update = updateCardActionsData.bind(data);

				return data;

			};

			var updateCardActionsData = function(newData){

				var data = this;

				//normalize arrays
				newData.emails = newData.emails || [];
				newData.phones = newData.phones || [];

				// empty arrays
				data.emails.splice(
					0,
					data.emails.length
				);

				data.phones.splice(
					0,
					data.phones.length
				);

				angular.merge(
					data,
					newData
				);

				data.emailClient =
					data.emails.length == 1
					? data.emails[0].prospectEmailValor
					: null;

				data.phoneClient =
					data.phones.length == 1
					? data.phones[0].prospectTelefoneFull
					: null;

				return data;

			};

			var getItemByResourceServices = {

				transactions: function(attrs){
					transactionsService.getItem({
						id: attrs.resource.id,
						params: {
							'_expand': ['clients']
						},
						success: function(response){

							response.data.extraInfo.prospectTelefones =
								response.data.expand.clients.fields.prospectTelefones;

							response.data.extraInfo.prospectEmails =
								response.data.expand.clients.fields.prospectEmails;

							attrs.success(response.data);

						},
						error: attrs.error
					});
				}

			};

			var getItemByResource = function(attrs){
				getItemByResourceServices[attrs.resource.resource](attrs);
			};

			var service = {
				getContactLinks: getContactLinks,
				showModal: showModal,
				getSubTypeId: getSubTypeId,
				getNewCardActionsData: getNewCardActionsData,
				modalTitlesByTabName: modalTitlesByTabName,
				getItemByResource: getItemByResource
			};

			return service;
		}
	)
	;

})();
