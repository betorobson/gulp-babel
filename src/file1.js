
// const modulex = require('../tmp-modules/misc');

// console.log(modulex);

let o = {
	a:1
};

console.log(Object.keys(o));

const arrayfile1 = [1, 2, 3, 4];

console.log(arrayfile1.reduce((accumulator, currentValue) => accumulator + currentValue));

const objxyz = {
	fn: function(txt)  {
		console.log(txt, typeof this);
		return new Promise((res, rej) => {
			rej;
			console.log(txt, typeof this);
			setTimeout(res, 1000);
		});
	}
};

objxyz.fn('Promisse timeout file1 zaa');

