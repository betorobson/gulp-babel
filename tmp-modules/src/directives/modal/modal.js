
'use strict';

(function(){

	angular.module('directives.modal',[])

	.controller(
		'ModalController',

		function(
			$location,
			$rootScope,
			$scope,
			$attrs,
			$document,
			$element,
			$timeout
		){

			$scope.attrs = $attrs;

			if(!$scope.delegate){
				$scope.delegate = {};
				console.error(
					'You must to implement the \'modal.delegate.\' on current $scope',
					$element
				);
			}

			var removeBodyClass = function(){
				$($document).find('body').removeClass('modal-open');
			};

			// remove any opened modal trace when user back history navigation
			$rootScope.$on('$routeChangeStart', function(){
				if($location.$$path){

					if($scope.$parent.$hide){
						$scope.$parent.$hide();
					}else{
						$('.modal-backdrop').remove();
					}

					removeBodyClass();
				}
			});

			$scope.delegate.hide = function(data){

				if($scope.$parent.$hide){
					$scope.$parent.$hide();
				}else{
					$($element).modal('hide');
					// $($element).find(' > .modal').modal('hide');
				}

				removeBodyClass();

				if($scope.delegate.reset){
					$scope.delegate.reset(data);
				}

			};

			$scope.hide = function(){
				$scope.delegate.hide();
			};

			// remove .fade class when animation has applies AngularMotion .am-fade-*
			$timeout(function(){
				if(/am-fade/.test($element[0].className)){
					angular.element($element[0]).removeClass('fade');
				}
			},0);

			// destroy scope when modal element is removed from DOM
			$element.on(
				'$destroy',
				function() {
					if($scope.$parent.$hide){
						$scope.$parent.$destroy();
					}
				}
			);

		}
	)

	.directive('modal', function(){

		return {
			restrict: 'E',
			templateUrl: 'modal/modal.html',
			controller: 'ModalController',
			replace: true,
			transclude: {
				title: '?modalTitle',
				bodyCustom: '?modalBodyCustom',
				body: '?modalBody',
				footer: '?modalFooter'
			},
			scope: {
				delegate: '=?'
			}
		};

	});

})();
