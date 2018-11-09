
'use strict';

(function(){

	angular.module('views.queues-handler-position',[
	])

	.controller(
		'ViewQueuesHandlerPositionController',

		function(
			$scope,
			$routeParams,
			path,
			permission,
			usersService,
			userStatusFactory,
			userStatusLabels,
			userQueueStatusProperties,
			firebaseListenerQueuesChannel
		){

			path.setCurrent('queues-handler-position');

			$scope.breadcrumbs = [{
				label: path.get('queues-handler-position').label,
				path: false
			}];

			$scope.viewTitle = {
				title: path.getCurrent().label,
				subtitle: '',
				desc: ''
			};

			var currentUserId;
			var data;

			$scope.channelProperties;

			$scope.dataQueue = {};
			$scope.users = [];

			$scope.error = false;
			$scope.loading = true;

			var listener;

			var setViewTitle = function(){

				$scope.viewTitle.subtitle = userStatusLabels[data.channel];

				$scope.viewTitle.desc = data.CampanhaNome
					+ ' : '
					+ data.CanalNome;

			};

			var mergeUsersPosition = function(){

				data.Posicoes.map(function(user){

					var userPositionInView = $scope.users.filter(function(userInView){
						return user.UsuarioContaSistemaIdGuid == userInView.UsuarioContaSistemaIdGuid;
					});

					if(userPositionInView && userPositionInView.length){
						angular.merge(
							userPositionInView[0],
							user
						);
					}else{
						$scope.users.push(user);
					}

				});

			};

			var removeUsersPosition = function(){

				var removedUsers = [];

				removedUsers = $scope.users.filter(function(userInView){

					var found = false;

					data.Posicoes.map(function(user){
						if(user.UsuarioContaSistemaIdGuid == userInView.UsuarioContaSistemaIdGuid){
							found = true;
						}
					});

					return !found;

				});

				removedUsers.map(function(item){
					$scope.users.splice($scope.users.indexOf(item), 1);
				});

			};

			var normalizeUserNames = function(){
				data.Posicoes.map(function(item){

					var splitedName = item.UsuarioContaSistemaNome.split(' ');

					item.UsuarioContaSistemaNome = (splitedName.shift()
						+ ' '
						+ (splitedName.pop() || '')
					).trim();

				});
			};

			var getSuccess = function(collectionDoc){

				data = collectionDoc;

				$scope.dataQueue = data;

				$scope.channelProperties = userStatusFactory.getChannelProperties(data.channel);

				if(!$scope.channelProperties){

					getError({
						title: 'Esse canal está indisponível',
						message: 'O canal da fila está indisponível no momento, tente novamente mais tarde. Obrigado.'
					});

					return;
				}

				setViewTitle();

				if(permission.checkPermissions(
					$scope.channelProperties.permissionPositionInQueue
				) === false){

					getError({
						title: 'Sem permissão',
						message: 'Você não tem permissão para ver essa fila.'
					});

				}else if(permission.checkPermissions(
					$scope.channelProperties.permissionPositionInQueue
				) === 'disabled'){

					getError({
						title: 'Fila desativada',
						message: 'Essa fila está desativada temporariamente.'
					});

				}else{

					normalizeUserNames();
					mergeUsersPosition();
					removeUsersPosition();

					$scope.loading = false;

				}

			};

			var getError = function(error){
				$scope.error = error;
			};

			var startListener = function(contaSistemaIdGuid){
				listener = firebaseListenerQueuesChannel.getListener({
					channel: 'chat',
					id: contaSistemaIdGuid + ':' + $routeParams.id,
					success: getSuccess,
					error: function(){
						getError({
							title: 'Essa fila esta indisponível no momento',
							message: 'Tente novamente mais tarde'
						});
					}
				});
			};

			$scope.isSameUser = function(item){
				return currentUserId == item.UsuarioContaSistemaIdGuid;
			};

			$scope.getStatusProperties = function(status){
				return userQueueStatusProperties[status];
			};

			$scope.$on(
				'$viewContentLoaded',
				function(){
					usersService.getUserProfile({
						success: function(response){
							currentUserId = response.data.id;
							startListener(response.data.extraInfo.contaSistemaIdGuid);
						}
					});
				}
			);

			$scope.$on(
				'$destroy',
				function() {
					listener();
					listener = null;
				}
			);

		}
	)

	;

})();
