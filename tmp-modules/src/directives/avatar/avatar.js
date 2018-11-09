
'use strict';

(function(){

	angular.module('directives.avatar',[])

	.controller(
		'AvatarController',

		function(
			$scope
		){

			$scope.item = $scope.item || {};
			$scope.itemObj = {};

			$scope.getStyle = function(){

				if($scope.imgsrc) {
					return {
						'background-image': 'url(' + $scope.imgsrc + ')'
					};
				}else{
					return {};
				}
			};

			var setItemObj = function(){
				if($scope.item.prospectUrlImagem){
					$scope.itemObj = {
						name: $scope.item.prospectNome,
						imgsrc: $scope.item.prospectUrlImagem
					};

				}else if($scope.item.usuarioUrlImagem){
					$scope.itemObj = {
						name: $scope.item.usuarioNome
						+
						', '
						+ $scope.item.usuarioApelido,
						imgsrc: $scope.item.usuarioUrlImagem
					};
				}

				if(!$scope.imgsrc){
					$scope.imgsrc = $scope.itemObj.imgsrc || '';
				}

			};

			setItemObj();

		}
	)

	.directive('avatar', function(){
		return {
			restrict: 'E',
			scope: {
				imgsrc: '=?',
				item: '=?'
			},
			transclude: true,
			templateUrl: 'avatar/avatar.html',
			controller: 'AvatarController'
		};
	});

})();
