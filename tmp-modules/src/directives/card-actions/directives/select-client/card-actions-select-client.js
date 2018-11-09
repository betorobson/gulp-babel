
'use strict';

(function(){

	angular.module('directives.card-actions-select-client',[])

	.controller(
		'CardActionsSelectClient',

		function(
			$scope,
			$element,
			$timeout,
			transactionsService,
			cardActionFactory
		){

			$scope.item;
			$scope.model = {
				q: ''
			};

			$scope.empty = false;
			$scope.error = false;
			$scope.loading = false;

			//Digite o nome do cliente antes de inserir uma atividade.

			var labelTextsByTabName = {
				activity: 'inserir uma ',
				note: 'inserir uma ',
				'call-activity': 'realizar uma ',
				email: 'enviar um ',
				whatsapp: 'enviar um ',
				sells: 'fazer uma '
			};

			var setLabel = function(){

				$scope.label = 'Digite o nome do cliente antes de ';

				if($scope.tabButtonActivated){
					$scope.label += labelTextsByTabName[$scope.tabButtonActivated];
					$scope.labelTabName =
						cardActionFactory.modalTitlesByTabName[$scope.tabButtonActivated]
						.toLowerCase();
				}else{
					$scope.label += ' inserir ';
					$scope.labelTabName =
						cardActionFactory.modalTitlesByTabName['default']
						.toLowerCase();
				}

			};

			var setInputFocus = function(){
				$timeout(function(){
					$element[0].querySelector('input[type=text]').focus();
				});
			};

			$scope.fields = [
				{
					type: 'input',
					key: 'q',
					className: 'icon-right',
					templateOptions: {
						placeholder: 'Busca por cliente, email, código, telefone ou #hashtag',
						type: 'text',
						required: true,
						minlength: 3
					},
					templateManipulators: {
						postWrapper: [function(template){

							var tmp = $('<div></div>').html(template);

							tmp.find('.form-input-extras').append('<button class="btn-lupa" type="submit"><icon-svg name="search"></icon-svg></button>');

							return tmp.html();
						}]
					}
				}
			];

			$scope.setClientId = function(item){
				$scope.delegate.setClientId(item);
			};

			$scope.submit = function(){

				if($scope.form.$valid && !$scope.loading){

					$scope.empty = false;
					$scope.error = false;
					$scope.loading = true;

					transactionsService.get(
						{
							params: $scope.model,
							success: function(response){
								$scope.item = response.data.data;
								$scope.loading = false;
								$scope.empty = !response.data.data || !response.data.data.length;
							},
							error: function(response){
								$scope.error = response.config.errorMessage;
							}
						}
					);
				}
			};

			setLabel();
			setInputFocus();

		}
	)

	.directive('cardActionsSelectClient', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/directives/select-client/card-actions-select-client.html',
			controller: 'CardActionsSelectClient',
			scope: {
				delegate: '=?',
				tabButtonActivated: '='
			},
		};

	});

})();
