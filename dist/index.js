"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var x = 1;
var array1 = [1, 2, 3, 4];
var reducer = function reducer(accumulator, currentValue) {
	return accumulator + currentValue;
};

for (var _x = 1; _x < 10; _x++) {
	console.log(_x);
}

var objx = {
	nums: [1, 3, 4],
	loop: function loop() {
		undefined.nums.map(function (num, index) {
			console.log(undefined.nums[index]);
		});
	}
};

objx.loop();

var obj = {
	fn: function fn() {
		var _this = this;

		console.log((0, _typeof3.default)(this));
		return new _promise2.default(function (res, rej) {
			rej;
			console.log((0, _typeof3.default)(_this));
			setTimeout(res, 1000);
		});
	}
};

obj.fn();

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15

console.log(array1.includes(2));

console.log(x);