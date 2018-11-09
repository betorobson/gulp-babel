
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionFollowersListController',

		function(
			$scope,
			transactionsService
		){

			var followersObject;
			var listFollowers = [];
			var followersObjectList;
			var initEmptyFollowers = true;

			$scope.delegate = $scope.delegate || {};
			$scope.empty = false;
			$scope.loading = true;
			$scope.model = {};
			$scope.fields = [{
				type: 'input',
				key: 'filter',
				model: $scope.model,
				modelOptions: {
					debounce: {
						default: 200,
					}
				},
				templateOptions: {
					placeholder: 'Busque pelo nome ou apelido',
					hint: 'Se o usuário não estiver na lista, é porque ele não pertence à campanha e canal deste atendimento.',
					minlength: 2,
					noErrorSpace: true
				}
			}];

			var setFollowersObject = function(filters){

				filters.map(function(item){
					if(item.field == 'usuarioSeguidoresIdGuids'){
						followersObject = item;
					}
				});

				followersObjectList = followersObject.defaultValue || [];

			};

			var setListFollowers = function(){

				if(!followersObject.options || !followersObject.options.length){
					$scope.empty = true;

					return;
				}

				listFollowers = followersObject.options.filter(function(followersObjectItem){
					return followersObjectList.indexOf(followersObjectItem.value) >= 0;
				});

				initEmptyFollowers = !listFollowers.length;

			};

			var getFollowersSuccess = function(response){

				setFollowersObject(response.data.filters);
				setListFollowers();

				$scope.loading = false;

			};

			var getFollowersError = function(){
				if($scope.delegate.hide){
					$scope.delegate.hide();
				}
			};

			$scope.getLimitTo = function(){
				return listFollowers.length ? null : 100;
			};

			$scope.isFollowing = function(item){
				return listFollowers.indexOf(item) >= 0;
			};

			$scope.getList = function(){

				if(!followersObject){
					return [];
				}

				var regExp = new RegExp(
					($scope.model.filter || '')
						.toLowerCase()
						.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
						.replace(/([*()\u005B\u005D{}.?^$])/g,'\\$1'),
					'i'
				);

				if($scope.model.filter){
					return followersObject.options.filter(function(item){
						return regExp.test(
							(
								item.name
								+ ' '
								+ (item.properties.usuarioEmail || '')
								+ ' '
								+ (item.properties.usuarioApelido || '')
							)
							.toLowerCase()
							.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
						);
					});
				}

				if(listFollowers.length && !initEmptyFollowers){
					return listFollowers;
				}

				return followersObject.options;

			};

			$scope.add = function(item){
				listFollowers.push(item);
				postAction();
			};

			$scope.remove = function(item){
				listFollowers.splice(listFollowers.indexOf(item), 1);
				postAction();
			};

			$scope.canEditWhenNotActive = function(){
				return transactionsService.canEditWhenNotActive($scope.transactionItem);
			};

			var runDelegates = function(transactionItemFollowers){

				if($scope.delegate.updateTransactionItemFollowers){
					$scope.delegate.updateTransactionItemFollowers(transactionItemFollowers);
				}

			};

			var postActionSuccess = function(response){
				runDelegates(response.data.extraInfo.usuarioSeguidores || []);
			};

			var postActionError = function(){
				setListFollowers();
			};

			var postAction = function(){

				var ids = (listFollowers.map(function(item){
					return item.value;
				}));

				transactionsService.actions({
					action: 'followers',
					method: 'POST',
					item: $scope.transactionItem,
					data: {
						fields: {
							usuarioSeguidoresIdGuids: ids
						}
					},
					success: postActionSuccess,
					error: postActionError
				});

			};

			transactionsService.actions({
				action: 'followers',
				method: 'GET',
				item: $scope.transactionItem,
				success: getFollowersSuccess,
				error: getFollowersError
			});

		}
	)

	.directive('viewTransactionFollowersList', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '=',
				delegate: '='
			},
			controller: 'viewTransactionFollowersListController',
			templateUrl: 'transaction/directives/followers/list.html'
		};
	})

	;

})();
