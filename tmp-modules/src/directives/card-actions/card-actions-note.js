
'use strict';

(function(){

	angular.module('directives.card-actions-note',[])

	.controller(
		'CardActionsNoteController',

		function(
			$rootScope,
			$scope,
			$timeout,
			$filter,
			followupService
		){

			if($scope.$parent.cardActionsTabSelectedDelegate){

				$scope.$parent.cardActionsTabSelectedDelegate['note'] = function(attrs){

					console.log('cardActionsTabSelectedDelegate["note"]', attrs);

					if($scope.$parent.modalDelegate){
						$scope.$parent.modalDelegate.setTitle($scope.$parent.tabSelected);
					}

				};

			}

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};
			$scope.form = null;
			$scope.formOptions = {};

			var modelFoo = {
				reminder: false
			};

			$scope.model = {
				fields: {
					interacaoNota: {
						tarefa: {
							alarme: {}
						}
					}
				}
			};

			$scope.fields = [];

			var hideDateTime = function(){

				if($scope.edit || modelFoo.reminder){
					return false;
				}

				if(alarmeDtAlarmeField.model[alarmeDtAlarmeField.key]){
					delete alarmeDtAlarmeField.model[alarmeDtAlarmeField.key];
				}

				return true;
			};

			if(!$scope.edit){
				$scope.fields.push(
					{
						type: 'textarea',
						model: $scope.model.fields.interacaoNota,
						key: 'interacaoTexto',
						templateOptions: {
							required: true,
							placeholder: 'escreva sua nota',
							rows: 10,
							hint: 'Dica: Adicione Hashtags (#) para se organizar melhor!'
						}
					},
					{
						template: '<hr />'
					},
					{
						type: 'anaproCheckbox',
						model: modelFoo,
						key: 'reminder',
						templateOptions: {
							label: 'Lembre-me'
						}
					}
				);
			}

			var alarmeDtAlarmeField = {
				key: 'alarmeDtAlarme',
				type: 'anaproDateTime',
				model: $scope.model.fields.interacaoNota.tarefa.alarme,
				hideExpression: hideDateTime,
				defaultValue: $filter('date')(
					new Date(new Date().setHours(new Date().getHours() + 2)),
					'yyyy-MM-ddTHH:00:00'
				),
				templateOptions: {
					label: 'Data e Hora',
					required: true,
					min: new Date()
				},
				validation: {
					messages: {
						min: '"A data precisa ser maior que agora"'
					}
				}
			};
			$scope.fields.push(alarmeDtAlarmeField);

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

				if(model.fields.interacaoNota.tarefa.alarme.alarmeDtAlarme){
					model.fields.interacaoNota.tarefa.tarefaDtTarefa =
						model.fields.interacaoNota.tarefa.alarme.alarmeDtAlarme;
				}

				if($scope.edit){
					model = {
						fields: model.fields.interacaoNota
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

	.directive('cardActionsNote', function(){

		return {
			restrict: 'E',
			templateUrl: 'card-actions/card-actions-note.html',
			controller: 'CardActionsNoteController',
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
