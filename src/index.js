
let x = 1;
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

for(let x=1; x<10; x++){
	console.log(x);
}

const objx = {
	nums: [1,3,4],
	loop() {
		this.nums.map((num, index) => {
			console.log(this.nums[index]);
		});
	}
};

objx.loop();

const obj = {
	fn: function()  {
		console.log(typeof this);
		return new Promise((res, rej) => {
			rej;
			console.log(typeof this);
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
