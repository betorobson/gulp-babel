
'use strict';

(function(){

	angular.module('views.transaction')

	.controller(
		'viewTransactionStageController',
		function(
			$rootScope,
			$scope,
			$timeout,
			transactionsService,
			stageFormFactory,
			momentFactory,
			permission
		){

			$scope.stages = [];

			var stageField = 'atendimentoPipelineStageIdGuid';
			var fields = $scope.transactionItem.fields.atendimento;

			$scope.loading = false;
			$scope.hideOverlay = false;
			$scope.hasPermissionToBackwardsPipeline =
				permission.checkPermissions('atd_voltar_fase');

			$scope.submitStatus = {
				success: false,
				error: false
			};

			var setStagesDone = function(reset){

				if(reset){
					$scope.stages.map(function(stage){
						stage.done = false;
					});
				}

				for(var i=0; i<$scope.stages.length; i++){

					var stage = $scope.stages[i];
					stage.done = true;

					if(stage.id === fields[stageField]){
						break;
					}

				}

			};

			var postExecute = function(){
				$timeout(function(){

					setStagesDone(true);
					$scope.submitStatus.success = false;
					$scope.submitStatus.error = false;
					$scope.loading = false;

					if($scope.modalSetStageDelegate.hide){
						$scope.modalSetStageDelegate.hide();
					}

				},500);
			};

			var updatePipelines = function(data){
				if(data.embed && data.embed.pipelines){
					getPipelinesSuccess({
						data: data.embed.pipelines
					});
				}
			};

			var setTransactionItem = function(item){
				angular.extend(
					$scope.transactionItem,
					item
				);
				fields = $scope.transactionItem.fields.atendimento;
			};

			var callDelegate = function(response){
				if($scope.delegate){
					$scope.delegate(response);
				}
			};

			$scope.modal = {};

			$scope.setModal = function(group, index){
				$scope.modal = {
					group: group,
					index: index
				};
			};

			$scope.modalSetStageDelegate = {};

			var stageFormDelegate = {
				onFormShowUp: function(){
					$scope.hideOverlay = true;
				},
				onFormDestroy: function(){
					$scope.hideOverlay = false;
				},
				onInitSetStage: function(){
					$scope.loading = true;
				},
				success: function(response){
					$scope.submitStatus.success = true;
					setTransactionItem(response.data);
					updatePipelines(response.data);
					postExecute();
					callDelegate(response);
				},
				error: function(){
					$scope.submitStatus.error = true;
					postExecute();
				}
			};

			$scope.durationsByGroup = {};

			var setDurations = function(){

				var durations = {};

				$scope.stages.map(function(item){

					var group = item.fields.pipelineStage.pipelineStageGrupo;

					durations[group] = durations[group] || {total: 0};
					durations[group].total += item.fields.pipelineStage.pipelineStagePermanencia || 0;

				});

				Object.keys(durations).map(function(group){
					durations[group].moment =
						momentFactory.getDuration(
							durations[group].total > 0 && durations[group].total < 60
							? 60
							: durations[group].total,
							'seconds'
						);
				});

				$scope.durationsByGroup = durations;

			};

			var getPipelinesSuccess = function(response){

				// response.data.data.map(function(item){
				// 	var stage = item.fields.pipelineStage;
				// 	$scope.stages.push({
				// 		index: stage.pipelineStageOrdem + 1,
				// 		id: stage.pipelineStageIdGuid,
				// 		name: stage.pipelineStageNome,
				// 		group: stage.pipelineStageGrupo,
				// 		fields: stage.pipelineStageFields
				// 	});
				// 	initSwiper();
				// });

				initSwiper();

				$scope.stages = response.data.data;

				setDurations();

				setStagesDone();

			};

			$scope.getCurrentPipelineStage = function(){
				return $scope.transactionItem.extraInfo.pipelineStageNome.replace(/.*?\/\W/,'');
			};

			$scope.setTransactionStage = function(event, item){
				if(!stageFormFactory.checkPermissionsToastr()){
					return;
				}else if(
					$scope.hasPermissionToBackwardsPipeline
					||
					!item.fields.pipelineStage.pipelineStageFulFilled
				){
					stageFormFactory.setTransactionStage({
						element: event.target,
						scope: $scope,
						delegate: stageFormDelegate,
						transactionItem: $scope.transactionItem,
						stageItem: item
					});
				}
			};

			$scope.swiperLoaded = true;

			var initSwiper = function(){

				if($rootScope.mainController.device == 'mobile'){
					$scope.swiperLoaded = false;

					$timeout(function(){

						new Swiper(
							'view-transaction-stage .swiper',
							{
								pagination: '.swiper-pagination',
								slidesPerView: 1,
								slidesPerGroup: 1,
								paginationClickable: true,
								spaceBetween: 0,
								initialSlide: Object.keys($scope.durationsByGroup)
									.indexOf($scope.transactionItem.extraInfo.pipelineStageGrupo)
							}
						);

						$scope.swiperLoaded = true;

					},0);

				}

			};

			transactionsService.getPipelines({
				id: $scope.transactionItem.id,
				success: getPipelinesSuccess
			});

		}
	)

	.directive('viewTransactionStage', function(){
		return {
			restrict: 'E',
			scope: {
				transactionItem: '=',
				delegate: '='
			},
			controller: 'viewTransactionStageController',
			templateUrl: 'transaction/directives/stage/stage.html'
		};
	})

	;

})();
