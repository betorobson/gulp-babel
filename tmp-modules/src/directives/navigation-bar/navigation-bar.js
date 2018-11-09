
'use strict';

(function(){

	angular.module('directives.navigationBar',[
		'directives.navigationBarChat',
		'directives.navigationBarMobileUserStatus',
		'directives.navigationBarWhatsnew',
		'directives.navigationBarActions'
	])

	.controller(
		'NavigationBarController',

		function(
			$rootScope,
			$scope,
			$timeout,
			path,
			permission,
			navigationBarFactory,
			mainController,
			usersService,
			notificationCenterTransactionsAwaiting,
			transactionsService,
			navigationBarActionsFactory
		){

			$scope.urlAnaproOld;

			var setUrlAnaproOld = function(){
				usersService.getUserProfile({
					success: function(response){
						$scope.urlAnaproOld = response.data.extraInfo;
					}
				});
			};

			$scope.showNavigationBarActionsModal = navigationBarActionsFactory.showModal;

			$scope.model = {
				q: ''
			};

			$scope.isBackButtonHidden = navigationBarFactory.backButton.isHidden;
			$scope.goBack = navigationBarFactory.backButton.run;

			var isMobile = function(){
				return mainController.getDevice() == 'mobile';
			};

			if(isMobile()){
				$scope.showMenuNav = false;
			}else{
				$scope.showMenuNav = true;
			}

			$scope.mobileSideMenuShowItems = true;

			$scope.hideMobileNavbar = function(){
				if(isMobile()){
					$timeout(function(){
						$scope.showMenuNav = false;
						setBodyScrollBars();
					}, 200);
				}
			};

			$scope.showMobileNavbar = function(){
				if(isMobile()){
					$scope.showMenuNav = true;
					setBodyScrollBars();
				}
			};

			$scope.toogleMobileNavBar = function(){
				if(isMobile()){

					$scope.showMenuNav = !$scope.showMenuNav;
					setBodyScrollBars();

				}
			};

			var setBodyScrollBars = function(){
				$rootScope.mainController.mobileSideMenuShow = $scope.showMenuNav;
			};

			$scope.submitSearchForm = function(){

				$scope.mainController.go(
					path.getPath('transactions')
					+ $scope.model.q
				);

				$timeout(function(){
					$('[button-search]').collapse('toggle');
				},0);

			};

			$scope.getLogo = function(){
				return navigationBarFactory.logo.get();
			};

			$scope.mobileUserStatusDelegate = {
				show: function(){
					$scope.mobileSideMenuShowItems = false;
				},
				hide: function(){
					$scope.mobileSideMenuShowItems = true;
				}
			};

			this.isActive = function(views){
				return {
					active: views.split(',').indexOf(path.getCurrentViewName()) >= 0,
				};
			};

			$scope.getTotalTransactionsAwaiting = function(){
				return notificationCenterTransactionsAwaiting.getTotalNewClients();
			};

			$scope.getViewTransactionsLink = function(){

				if(notificationCenterTransactionsAwaiting.getTotalNewClients() > 0){
					return transactionsService.getTransactionsAwaitingLink();
				}else{
					return path.getPath('transactions');
				}

			};

			setUrlAnaproOld();

		}
	)

	.directive('navigationBar', function(){
		return {
			restrict: 'E',
			templateUrl: 'navigation-bar/navigation-bar.html',
			controller: 'NavigationBarController as navigationBarController'
		};
	});

})();
