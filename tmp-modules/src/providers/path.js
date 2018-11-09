
'use strict';

(function(){

	angular.module('provider.path', [])

	.provider('path', function(){

		var rootScope;

		var paths = {

			// keys must be same name of views

			logout: {
				path: '/sair/',
				label: 'Sair',
				icon: 'logout'
			},

			calendar: {
				path: '/agenda/',
				label: 'Agenda',
				icon: 'calendar2'
			}

		};

		var self = this;
		self.currentKey = 'home';

		self.get = function(view){
			return paths[view];
		};

		self.addPath = function(view, object){
			paths[view] = object;

			return paths[view];
		};

		self.getPath = function(view){
			return paths[view].path;
		};

		self.getIcon = function(view){
			return paths[view].icon;
		};

		self.getLabel = function(view){
			return paths[view].label;
		};

		self.getCurrent = function(){
			return paths[self.currentKey];
		};

		self.getCurrentViewName = function(){
			return self.currentKey;
		};

		self.setCurrent = function(view){
			self.currentKey = view || 'home';

			if(rootScope.mainController.setViewAttribute){
				rootScope.mainController.setViewAttribute();
			}
		};

		self.$get = function($rootScope){
			rootScope = $rootScope;

			return self;
		};

	});

})();
