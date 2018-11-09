
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionFollowersController',

		function(
			$scope,
			$modal,
			usersService,
			transactionsService
		){

			angular.merge(
				$scope.transactionItem.extraInfo,
				{
					usuarioSeguidores: []
				}
			);

			var currentUser;
			var followersList = $scope.transactionItem.extraInfo.usuarioSeguidores;

			usersService.getUserProfile({
				success: function(response){
					currentUser = response.data;
				}
			});

			$scope.summary = {};
			$scope.btnLikeClassName = {
				active: false
			};

			$scope.canEditWhenNotActive = function(){
				return transactionsService.canEditWhenNotActive($scope.transactionItem);
			};

			var setSummary = function(){

				$scope.summary = {
					names: '',
					total: 0
				};

				$scope.btnLikeClassName = {
					active: !!followersList.filter(function(item){
						return item.usuarioIdGuid == currentUser.id;
					}).length
				};

				var limit = 2;
				var count = followersList.length;

				if(count){

					var names = '';

					for(var i=0; i<followersList.length; i++){

						var item = followersList[i];

						names += names
							? ' e '
							: '';

						names += item.usuarioApelido || item.usuarioNome;

						if(i == (limit - 1)){
							break;
						}

					}

					$scope.summary.names = names;
					$scope.summary.total = count;

				}

			};

			var followersListDelegate = {
				updateTransactionItemFollowers: function(newFollowersList){

					followersList.splice(0);

					angular.extend(
						followersList,
						newFollowersList
					);

					setSummary();
				}
			};

			var success = function(response){

				followersList.splice(0);

				angular.extend(
					followersList,
					response.data.extraInfo.usuarioSeguidores
				);

				setSummary();

			};

			var error = function(){

				toggleLike();

				setFollowersList();

				setSummary();

			};

			var toggleLike = function(){
				$scope.btnLikeClassName.active = !$scope.btnLikeClassName.active;
			};

			var setFollowersList = function(){
				if($scope.btnLikeClassName.active){
					followersList.push({
						usuarioIdGuid: currentUser.id,
						usuarioNome: currentUser.fields.usuario.usuarioNome,
						usuarioApelido: currentUser.fields.usuario.usuarioApelido
					});
				}else{

					var listRemovedCurrentUser = followersList.filter(function(item){
						return item.usuarioIdGuid != currentUser.id;
					});

					followersList.splice(0);
					angular.extend(followersList, listRemovedCurrentUser);

				}
			};

			$scope.toggleFollowing = function(){

				toggleLike();

				setFollowersList();

				var list = followersList.map(function(item){
					return item.usuarioIdGuid;
				});

				transactionsService.actions({
					action: 'followers',
					method: 'POST',
					item: $scope.transactionItem,
					data: {
						fields: {
							usuarioSeguidoresIdGuids: list
						}
					},
					success: success,
					error: error
				});

			};

			$scope.showListModal = function(){

				if(!$scope.canEditWhenNotActive() && !$scope.summary.total){
					return;
				}

				var transactionItem = $scope.transactionItem;

				$modal({
					templateUrl: 'transaction/directives/followers/modal.html',
					show: true,
					animation: 'am-fade-and-slide-top',
					controller: function($scope){
						$scope.delegate = followersListDelegate;
						$scope.transactionItem = transactionItem;
					}

				});

			};

			setSummary();

		}
	)

	.directive('viewTransactionFollowers', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '='
			},
			controller: 'viewTransactionFollowersController',
			templateUrl: 'transaction/directives/followers/followers.html'
		};
	})

	;

})();
