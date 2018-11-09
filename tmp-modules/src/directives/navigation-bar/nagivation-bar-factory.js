
'use strict';

(function(){

	angular.module('factories.navigationBar',[])

	.factory(
		'navigationBarFactory',

		function(
			$window
		){

			var backButton = {

				hidden: false,
				customFunction: null,

				hide: function(){
					backButton.hidden = true;
				},

				show: function(){
					backButton.hidden = false;
				},

				isHidden: function(){
					return backButton.hidden;
				},

				run: function(){
					if(backButton.customFunction){
						backButton.customFunction();
						backButton.customFunction = null;
					}else{
						$window.history.back();
					}
				},

				set: function(func){
					backButton.customFunction = func;
				},

			};

			var logo = {
				data: {
					company: null
				},

				set: function(data){
					angular.extend(logo.data, data || {});
				},

				get: function(){
					return logo.data;
				}
			};

			return {
				backButton: backButton,
				logo: logo
			};

		}
	);

})();
