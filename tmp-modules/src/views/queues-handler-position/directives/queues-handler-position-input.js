
'use strict';

(function(){

	angular.module('views.queues-handler-position')

	.controller(
		'QueuesHandlerPositionInputController',

		function(
			$scope,
			$timeout,
			$element,
			permission,
			queuesService
		){

			var currentPosition;

			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			var postExecute = function(){
				$timeout(function(){

					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

				},500);
			};

			$scope.reset = function(){
				$scope.edit = false;
				$scope.model = {};
			};

			$scope.setEdit = function(){

				if($scope.hasHandlerPositionPermission() !== true){
					return;
				}

				$scope.$parent.$parent.$broadcast('QueuesHandlerPositionEditing', $scope.item);

				currentPosition = $scope.item.Ordem;

				$scope.edit = true;

				$scope.fields = [
					{
						type: 'numberInput',
						key: 'position',
						defaultValue: currentPosition,
						className: 'input-position',
						templateOptions: {
							type: 'tel',
							required: true,
							decimals: 0,
							minValue: 1,
							noErrorSpace: true
						}
					}
				];

				$timeout(function(){

					$($element).find('input').focus();

				});

			};

			$scope.formOptions = {};
			$scope.model = {};

			$scope.submit = function(form){

				if(form.$valid){

					$scope.edit = false;
					$scope.loading = true;

					$scope.item.Ordem = $scope.model.position;

					if($scope.item.Ordem > $scope.queue.Posicoes.length){
						$scope.item.Ordem = $scope.queue.Posicoes.length;
					}

					queuesService.actions({
						action: 'position',
						data: {
							fields: {
								queue: {
									campanhaIdGuid: $scope.queue.CampanhaIdGuid,
									canalIdGuid: $scope.queue.CanalIdGuid,
									usuarioIdGuid: $scope.item.UsuarioContaSistemaIdGuid,
									queuePosition: $scope.item.Ordem
								}
							}
						},
						success: function(){
							$scope.submitStatus.success = true;
							currentPosition = $scope.item.Ordem;
							postExecute();
						},
						error: function(){
							$scope.submitStatus.error = true;
							$scope.item.Ordem = currentPosition;
							postExecute();
						}
					});

				}

			};

			$scope.hasHandlerPositionPermission = function(){

				if($scope.channelProperties.permissionHandlerPositionInQueue){
					return permission.checkPermissions(
						$scope.channelProperties.permissionHandlerPositionInQueue
					);
				}

				return true;
			};

			var bsTooltip = {
				type: '',
				title: ''
			};

			$scope.getBsTooltip = function(){

				var permisionStatus = $scope.hasHandlerPositionPermission();

				if(permisionStatus === true){
					angular.merge(
						bsTooltip,
						{
							type: 'info',
							title: 'Alterar posição'
						}
					);
				}else if(permisionStatus === false){
					angular.merge(
						bsTooltip,
						{
							type: 'warn',
							title: 'Você não tem permissão para alterar a ordem da fila'
						}
					);
				}else if(permisionStatus === 'disabled'){
					angular.merge(
						bsTooltip,
						{
							type: 'error',
							title: 'Alterar ordem da fila foi desligado temporariamente'
						}
					);
				}

				return bsTooltip;

			};

			$scope.$on('QueuesHandlerPositionEditing', function(item){
				if(item != $scope.item){
					$scope.reset();
				}
			});

		}
	)

	.directive('queuesHandlerPositionInput', function(){
		return {
			restrict: 'E',
			templateUrl: 'queues-handler-position/directives/queues-handler-position-input.html',
			controller: 'QueuesHandlerPositionInputController',
			scope: {
				queue: '=',
				item: '=',
				channelProperties: '='
			}
		};
	});

})();
