
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionHashtagController',

		function(
			$scope,
			$timeout,
			$element,
			clientsService,
			path
		){
			angular.merge(
				$scope.transactionItem.expand.clients.fields,
				{
					prospectHashTags: []
				}
			);

			var prospectHashTagsOriginal = [];

			var setProspectHashTagsOriginal = function(){
				prospectHashTagsOriginal = angular.copy($scope.transactionItem.expand.clients.fields.prospectHashTags);
			};

			var resetProspectHashTags = function(){
				var hashtags = $scope.transactionItem.expand.clients.fields.prospectHashTags;
				hashtags.splice(0, hashtags.length);

				angular.extend(hashtags,prospectHashTagsOriginal);
			};

			$scope.model = {};
			$scope.edit = false;
			$scope.loading = false;
			$scope.submitStatus = {
				success: false,
				error: false
			};

			$scope.editHashtag = function(){
				setTextArea();
				$scope.edit = true;

				$timeout(function(){
					$($element).find('textarea').focus();
				});

			};

			var setTextArea = function(){
				$scope.model.textArea = $scope.transactionItem.expand.clients.fields.prospectHashTags.join(' #');

				if($scope.model.textArea){
					$scope.model.textArea = '#' + $scope.model.textArea;
				}
			};

			var getToastrMessages = function(){

				return {
					serverError: {
						title: 'Desculpe, estamos com dificuldades para atualizar os dados do cliente.',
						message: 'Tente novamente mais tarde, obrigado.'
					}
				};
			};

			$scope.getPath = function(hashtag){
				return path.getPath('transactions')
				+ encodeURIComponent(
					'#'
					+ hashtag.toLowerCase()
				);
			};

			$scope.patchHashtag = function(attrs){

				console.log(attrs);

				attrs = attrs || {};

				if($scope.edit){
					attrs.hashtags = $scope.model.textArea
					? $scope.model.textArea.replace(/#/g,'').replace(/\s+/g,' ').split(' ')
					: [];
				}

				$scope.loading = true;

				clientsService.patchItem({
					item: $scope.transactionItem.expand.clients,
					data: {
						fields: {
							prospectHashTags: attrs.hashtags
						}
					},
					toastrMessages: getToastrMessages(),
					success: success,
					error: function(){

						if(!$scope.edit){
							resetProspectHashTags();
						}

						$scope.submitStatus.error = true;
						postExecute();

					}
				});

				return false;
			};

			$scope.removeHashtag = function(index){
				$scope.transactionItem.expand.clients.fields.prospectHashTags.splice(index, 1);

				$scope.patchHashtag({
					hashtags: $scope.transactionItem.expand.clients.fields.prospectHashTags
				});

				$scope.loading = false;
				$scope.submitStatus.success = false;
				$scope.submitStatus.error = false;

			};

			$scope.cancel = function(){
				setTextArea();
				$scope.edit = false;
			};

			var success = function(response){
				var hashtags = $scope.transactionItem.expand.clients.fields.prospectHashTags;
				hashtags.splice(0, hashtags.length);

				angular.extend(hashtags, response.data.fields.prospectHashTags);
				setProspectHashTagsOriginal();
				$scope.submitStatus.success = true;

				$scope.edit = false;
				postExecute();
			};

			var postExecute = function(){
				$timeout(function(){
					$scope.loading = false;
					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
				},500);
			};

			setProspectHashTagsOriginal();

		}
	)

	.directive('hashtag', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '='
			},
			controller: 'viewTransactionHashtagController',
			templateUrl: 'transaction/directives/hashtag/hashtag.html'
		};
	})

	;

})();
