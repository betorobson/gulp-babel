
'use strict';

(function(){

	var resources = {

		userProfile: {
			title: 'Meus dados',
			getUrl: function(){
				return '//login.anapro.com.br/web/pages/Usuario/Cadastro/Editar.aspx';
			}
		},

		// transfer: {
		// 	url: 'http://anapro.crm.anapro.com.br/webcrm/pages/atendimento/atendimento_transferir.aspx?key=dt7cwfkSJLk1&op=',
		// 	title: 'Transferir Atendimento',
		// 	getUrl: function(data){
		// 		return resources.transfer.url
		// 			+ '&id='
		// 			+ data.data.id
		// 			+ '&AnaproAppModal=true';
		// 	}
		// }

	};

	angular.module('directives.modal-iframe-anapro-v1',[])

	.provider('modalIframeAnaproV1', function(){

		var scope;
		var rootScope;
		rootScope;

		var self = this;

		self.show = function(data){
			scope.data = data;
			scope.show();
		};

		self.setScope = function(directiveScope){
			scope = directiveScope;
		};

		self.$get = function($rootScope){
			rootScope = $rootScope;

			return self;
		};

	})

	.controller(
		'modaliFrameAnaproV1Controller',

		function(
			$scope,
			$sce,
			$location,
			$document,
			modalIframeAnaproV1
		){

			modalIframeAnaproV1.setScope($scope);

			var setIframeURL = function(){

				$scope.iframeURL = $sce.trustAsResourceUrl(
					resources[$scope.data.resource].getUrl($scope.data)
				);

			};

			$scope.show = function(){
				$scope.title = resources[$scope.data.resource].title;
				setIframeURL();
				$('#modal-iframe-anaprov1').modal();
			};

			$scope.modalDelegate = {
				reset: function(message){

					if($scope.data && $scope.data.callback){
						$scope.data.callback(message, $scope.data.data);
					}

					$scope.data = null;
					$scope.iframeURL = null;

				}
			};

			$scope.$root.$on('$routeChangeStart', function(){
				if($scope.data
					&&
					$location.$$path
					&&
					$($document).find('body').hasClass('modal-open')
				){
					$scope.modalDelegate.hide();
				}
			});

			$scope.$root.$on('$messageIncoming', function(event, data){
				$scope.modalDelegate.hide(angular.fromJson(data));
			});

		}
	)

	.directive('modalIframeAnaproV1', function(){

		return {
			restrict: 'E',
			templateUrl: 'modal-iframe-anapro-v1/modal-iframe-anapro-v1.html',
			controller: 'modaliFrameAnaproV1Controller',
			scope: {}
		};

	});

})();
