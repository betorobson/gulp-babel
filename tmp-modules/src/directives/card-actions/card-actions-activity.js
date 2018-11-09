
'use strict';

(function(){

	angular.module('directives.card-actions-activity',[])

	.controller(
		'CardActionsActivityController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$filter,
			$element,
			followupService,
			followupSubTypes,
			cardActionFactory
		){

			if($scope.$parent.cardActionsTabSelectedDelegate){
				$scope.$parent.cardActionsTabSelectedDelegate['activity'] = function(attrs){

					if($scope.$parent.modalDelegate){
						$scope.$parent.modalDelegate.setTitle($scope.$parent.tabSelected);
					}

					initWithSubTypeSelected(attrs);

				};
			}

			var initWithSubTypeSelected = function(attrs){

				if(attrs.interacaoTipoSub){
					cardActionFactory.getSubTypeId({
						interacaoTipoSub: attrs.interacaoTipoSub,
						success: function(id){
							$scope.model.fields.interacaoAtividade.interacaoTipoSubIdGuid = id;
						}
					});
				}

			};

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};
			$scope.form = null;
			$scope.formOptions = {};

			$scope.model = {
				fields: {
					interacaoAtividade: {
						tarefa: {
							alarme: {},
						},
					}
				}
			};

			var modelWhen = {};

			$scope.fields = [
				{
					key: $scope.edit
						? 'alarmeDtAlarme'
						: 'interacaoDtInteracao',
					type: 'anaproDateTime',
					model: $scope.edit
						? $scope.model.fields.interacaoAtividade.tarefa.alarme
						: $scope.model.fields.interacaoAtividade,
					defaultValue: $filter('date')(
						$scope.edit
							? $scope.item.fields.interacaoAtividade.interacaoDtInteracao
							: new Date(),
						'yyyy-MM-ddTHH:mm:00'
					),
					hideExpression: function(){
						return modelWhen.when == 'doing';
					},
					templateOptions: {
						// label: 'Data da atividade',
						required: true
					}
				}
			];

			var setFields = function(){

				if(!$scope.edit){

					var modelWhenValue = angular.merge(
						{
							activity: {
								modelWhen: 'doing'
							}
						},
						$scope.delegate.tabButtonAttrs
					);

					modelWhen.when = modelWhenValue.activity.modelWhen;

					$scope.fields.splice(
						0,
						0,
						{
							type: 'anaproSelectButtons',
							key: 'when',
							model: modelWhen,
							elementAttributes: {
								'layout': 'row'
							},
							templateOptions: {
								required: true,
								label: 'Quando?',
								noErrorSpace: true,
								options: [
									{
										name: 'Já fiz',
										value: 'done'
									},
									{
										name: 'Agora',
										value: 'doing'
									},
									{
										name: 'Vou fazer',
										value: 'todo'
									}
								]
							}
						}
					);
				}

				$scope.fields.push(
					{
						type: 'select-async',
						key: 'interacaoTipoSubIdGuid',
						model: $scope.model.fields.interacaoAtividade,
						className: 'input-nogrow',
						elementAttributes: {
							'layout': 'row'
						},
						data: {
							async: {
								resource: 'followupsSubTypes'
							}
						},
						templateOptions: {
							label: 'Tipo:',
							options: []
						}
					},
					{
						type: 'textarea',
						model: $scope.model.fields.interacaoAtividade,
						key: 'interacaoTexto',
						templateOptions: {
							required: true,
							placeholder: 'escreva sua nota',
							rows: 10,
							hint: 'Dica: Adicione Hashtags (#) para se organizar melhor!'
						}
					}
				);

			};

			if(!$scope.edit){
				setFields();
			}

			var postExecute = function(response){

				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

					if($scope.$parent.modalDelegate){
						$scope.$parent.modalDelegate.hide();
					}

					delegate(response);

				},500);
			};

			var delegate = function(response){
				if($scope.delegate && response){

					if($scope.edit){
						$scope.delegate.reschedule(response.data);
					}else{
						$scope.delegate.postItem(response.data);
					}

				}
			};

			var getModelBeforeSubmit = function(){

				var model = angular.copy($scope.model);

				if(modelWhen.when == 'doing'){
					delete $scope.model.fields.interacaoAtividade.interacaoDtInteracao;
				}

				if(model.fields.interacaoAtividade.tarefa.alarme.alarmeDtAlarme){
					model.fields.interacaoAtividade.tarefa.tarefaDtTarefa =
						model.fields.interacaoAtividade.tarefa.alarme.alarmeDtAlarme;
				}

				if($scope.edit){
					model = {
						fields: model.fields.interacaoAtividade
					};
				}

				return model;

			};

			$scope.cancel = function(){
				if($scope.$parent.modalDelegate){
					$scope.$parent.modalDelegate.hide();
				}
			};

			$scope.submit = function(){

				if($scope.form.$valid && !$scope.loading){

					$scope.loading = true;

					var model = getModelBeforeSubmit();

					var attrs = {
						item: $scope.item,
						data: model,
						toastrMessages: getToastrMessages(),
						success: function(response){

							$scope.submitStatus.success = true;
							postExecute(response);
							$scope.formOptions.resetModel();
						},
						error: function(){
							$scope.submitStatus.error = true;
							postExecute();
						}
					};

					if($scope.edit){
						attrs.action = 'reschedule';
						followupService.actions(attrs);
					}else{
						attrs.resource = $scope.$parent.resource || null;
						followupService.post(attrs);
					}

				}
			};

			var getToastrMessages = function(){

				var
					messageActionSuccess,
					messageActionError;

				if($scope.edit){
					messageActionError = 'remarcar';
					messageActionSuccess = 'remarcada';
				}else{
					messageActionError = 'inserir';
					messageActionSuccess = 'criada';
				}

				return {
					success: {
						title: 'Nota '+ messageActionSuccess
							+ ' com sucesso.'
					},
					serverError: {
						title: 'Desculpe, estamos com dificuldades para '
							+ messageActionError
							+ ' sua nota',
						message: 'Tente novamente mais tarde, obrigado.'
					}
				};

			};

		}
	)

	.directive('cardActionsActivity', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-activity.html',
			controller: 'CardActionsActivityController',
			scope: {
				active: '=?',
				edit: '=?',
				item: '=?',
				delegate: '=?'
			},
			replace: true
		};

	});

})();
