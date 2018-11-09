
'use strict';

(function(){

	angular.module('factories.moment',[])

	.factory(

		'momentFactory',

		function(){

			// duration time threshold
			moment.relativeTimeThreshold('s', 60);
			moment.relativeTimeThreshold('m', 60);
			moment.relativeTimeThreshold('h', 24);
			moment.relativeTimeThreshold('d', 30);
			moment.relativeTimeThreshold('M', 12);

			var humanizeUnitsSequence = [
				'years',
				'months',
				'days',
				'hours',
				'minutes'
			];

			var getMomentHumanize = function(momentObj, sequence, size){

				if(humanizeUnitsSequence[sequence] && size > 0){

					if(momentObj._data[humanizeUnitsSequence[sequence]] > 0){

						var humanize = moment.duration(
							momentObj._data[humanizeUnitsSequence[sequence]],
							humanizeUnitsSequence[sequence]
						).locale('pt-br').humanize();

						var nextSequence = getMomentHumanize(momentObj, sequence + 1, --size);

						return humanize + (nextSequence ? ' e ' + nextSequence : '');

					}else{

						return getMomentHumanize(momentObj, sequence + 1, size);

					}

				}else{

					return '';

				}

			};

			var getDuration = function(length, unit){

				var duration = moment.duration(length, unit);

				duration.humanize = getMomentHumanize(duration, 0, 2);

				return duration;

			};

			var factory = {
				getDuration: getDuration
			};

			return factory;
		}
	);

})();
