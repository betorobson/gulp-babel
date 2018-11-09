
'use strict';

(function(){

	angular.module('directives.notifications-container.dialog.provider', [])

	.provider('notificationsContainerDialog', function(){

		console.log('notificationsContainerDialog.provider');

		var
			self = this,
			baseAnimationDuration = 400,
			dialogTypes = {},
			dialogTypesByPriority = [],
			dialogs = [];

		self.getDialogType = function(type){
			return dialogTypes[type];
		};

		self.putDialogType = function(type, obj){

			obj.type = type;

			dialogTypes[type] = obj;

			dialogTypesByPriority.push(obj);

			dialogTypesByPriority.sort(function(a, b){
				return a.priority - b.priority;
			});

			return obj;
		};

		self.getDialogTypesByPriority = function(){
			return dialogTypesByPriority;
		};

		var getType = function(){

			var dialog = this;

			return dialogTypes[dialog.data.type];

		};

		var isValidDialog = function(newDialog){

			if(!newDialog.type || !dialogTypes[newDialog.type]){

				console.warn(
					'Sorry, this dialog type has been not register yet. type = `',
					newDialog.type, '`, ',
					newDialog
				);

				return false;
			}

			return true;

		};

		var minimizeAllCurrentDialogs = function(newDialogObj){

			if(!newDialogObj.data.minimized){
				dialogs.map(function(dialog){
					if(dialog.minimize){
						dialog.minimize();
					}
				});
			}

		};

		var setMinimizedWhenLessPriority = function(newDialogObj){

			var currentMaxmizedDialog = self.getCurrentMaxmized();

			if(
				currentMaxmizedDialog
				&&
				currentMaxmizedDialog.getType().priority < newDialogObj.getType().priority
			){
				newDialogObj.data.minimized = true;
			}

		};

		var noop = function(){
			return;
		};

		self.$get = function(
			$timeout,
			$compile,
			mainController,
			notificationsContainerDialogContainer,
			CacheFactory
		){

			var cache = CacheFactory(
				'dialog.provider',
				{
					storagePrefix: 'AnaproAPP-Caches.',
					storageMode: 'localStorage'
				}
			);

			var setDialogAttrsWhenDeviceMobile = function(attrs){

				// init dialog always minimized when running on mobile
				if(mainController.getDevice() == 'mobile'){
					angular.merge(
						attrs,
						{
							minimized: true
						}
					);
				}

			};

			var getNewDialogObj = function(attrs){

				setDialogAttrsWhenDeviceMobile(attrs);

				if(isMinimizedIdCache(attrs.id) >= 0){
					attrs.minimized = true;
				}

				return {
					data: attrs,
					remove: remove,
					minimize: minimize,
					getType: getType
				};

			};

			self.getDialogs = function(){
				return dialogs;
			};

			self.getCurrentMaxmized = function(){

				var dialog;

				dialogs.map(function(item){
					if(item && item.data && !item.data.minimized){
						dialog = item;
					}
				});

				return dialog;

			};

			self.put = function(attrs){

				if(!isValidDialog(attrs)){
					return;
				}

				var newDialogObj = getNewDialogObj(attrs);

				setMinimizedWhenLessPriority(newDialogObj);

				minimizeAllCurrentDialogs(newDialogObj);

				dialogs.push(newDialogObj);

				compile(newDialogObj);

				append(newDialogObj);

				// setContainerHeight();

				window.dialog = newDialogObj;

				return newDialogObj;

			};

			// [todo] animation container height resize
			// var setContainerHeight = function(){

			// 	var height = 0;

			// 	dialogs.map(function(item){
			// 		if(item.data.minimized){
			// 			height += 60;
			// 		}
			// 	});

			// 	containerElement.css({
			// 		height: height + 'px'
			// 	});
			// };

			var compile = function(dialog){

				var scope = notificationsContainerDialogContainer.getNewScope();

				scope.dialog = dialog;

				scope.dialog.element = $compile(
					'<notifications-container-dialog dialog="dialog">'
					+ '</notifications-container-dialog>'
				)(scope);

			};

			var append = function(dialog){

				notificationsContainerDialogContainer.append(dialog);

			};

			var isMinimizedIdCache = function(id){

				var cacheIds = cache.get('minimizedIds') || [];

				return cacheIds.indexOf(id);

			};

			var addMinimizedCache = function(dialog){

				if(dialog.data && dialog.data.id){

					var id = dialog.data.id;

					var cacheIds = cache.get('minimizedIds') || [];

					if(isMinimizedIdCache(id) < 0){
						cacheIds.push(id);
						cache.put('minimizedIds', cacheIds);
					}

				}

			};

			var removeMinimizedCache = function(dialog){

				if(dialog.data && dialog.data.id){

					var id = dialog.data.id;

					var cacheIds = cache.get('minimizedIds') || [];

					var index = isMinimizedIdCache(id);

					if(index >= 0){
						cacheIds.splice(index, 1);
						cache.put('minimizedIds', cacheIds);
					}

				}

			};

			var remove = function(attrs){

				attrs = attrs || {};

				var
					dialog = this,
					index = dialogs.indexOf(dialog);

				if(attrs.actionOrigin == 'open'){
					removeMinimizedCache(dialog);
				}

				dialog.element.addClass('removing');

				$timeout(function(){

					dialog.element.remove();
					// delete scope.dialog;
					// scope.$destroy();

					if(index >= 0){
						dialogs.splice(index, 1);
					}else{
						console.warn('Sorry, this dialog do not exist!', dialog);
					}

					Object.keys(dialog).map(function(key){
						delete dialog[key];
					});

					// setContainerHeight();

				}, baseAnimationDuration);

				// replace remove by noop in order to prevent double remove invokes
				dialog.remove = noop;

			};

			var minimize = function(){

				var dialog = this;

				addMinimizedCache(dialog);

				if(!dialog.data.minimized){

					dialog.element.addClass('minimizing');

					$timeout(function(){
						if(dialog.data){
							dialog.data.minimized = true;
						}
					}, baseAnimationDuration);

					// setContainerHeight();

				}
			};

			return self;
		};

	});

})();
