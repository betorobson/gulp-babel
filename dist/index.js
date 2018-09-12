"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
		var _this = this;

		this.nums.map(function (num, index) {
			console.log(_this.nums[index]);
		});
	}
};

objx.loop();

var obj = {
	fn: function fn() {
		var _this2 = this;

		console.log(_typeof(this));
		return new Promise(function (res, rej) {
			rej;
			console.log(_typeof(_this2));
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