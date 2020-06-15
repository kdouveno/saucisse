const hasher = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

const un = v => typeof(v) === "undefined";
const M32SI = -(1<<31);

class Rand
{
	constructor(seed)
	{
		this.hasher;
		this.a = 16807;
		this.b = 0;
		this.m = 0x7FFFFFFF;
		this.seed = (un(seed) ? 1 : hasher(""+seed));
		this.seedCounter = new Map();
	}

	generate(seed, limit, max)
	{
		if (typeof(seed) !== "undefined")
			this.seed = hasher(seed);
		this.seed = (this.a * this.seed + this.b) % this.m;
		var out = this.seed;
		out = out % M32SI / M32SI;
		return out;
	}
};

function Random(seed) {
	this._seed = seed % 2147483647;
	if (this._seed <= 0) this._seed += 2147483646;
  }
  
  /**
   * Returns a pseudo-random value between 1 and 2^32 - 2.
   */
  Random.prototype.next = function () {
	return this._seed = this._seed * 16807 % 2147483647;
  };
  
  
  /**
   * Returns a pseudo-random floating point number in range [0, 1).
   */
  Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
	// We know that result of next() will be 1 to 2147483646 (inclusive).
	return (this.next() - 1) / 2147483646;
  };

class vector{
	constructor(x, y, x2, y2) {
		if (un(x2)) {
			this.x = x;
			this.y = y;
		} else {
			this.x = x2 - x;
			this.y = y2 - y;
		}
	}

	dotProduct(vec) {
		return vec.x * this.x + vec.y * this.y;
	}

	norm() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize() {
		var norm = this.norm();

		this.x /= norm;
		this.y /= norm;
		return this;
	}

	multiply(scal) {
		this.x *= scal;
		this.y *= scal;
		return this;
	}
}

class PerlinNoise{
	constructor(cellSize, seed) {
		this.cellSize = cellSize;
		this.seed = seed;
		this.dots = new Map();
	}

	gradient(w, x, y)
	{
		var key = w + " " + x + " " + y;
		if (this.dots.has(key))
			return this.dots.get(key)
		constr.strokeStyle = '#00ff00';
		constr.beginPath();
		constr.arc(x * this.cellSize, y * this.cellSize, 3, 0, 2 * Math.PI);
		var rand = prng.Alea(this.seed, w, x, y);
		var grad = new vector(
			rand() - .5,
			rand() - .5
		);
		constr.moveTo(this.cellSize * x, this.cellSize * y);
		constr.lineTo(this.cellSize * (x + grad.x), this.cellSize * (y + grad.y));
		constr.closePath();
		constr.stroke();

		this.dots.set(key, grad);
		return (grad);
	}

	dotGridGradient(w, xi, yi, x, y) {
		
		var vec = new vector(xi, yi, x, y);

		return vec.dotProduct(this.gradient(w, xi, yi));
	}

	lerp(a0, a1, w) {
		return (1.0 - w)*a0 + w*a1;
	}

	perlin(w, x, y)
	{
		// Determine grid cell coordinates
		x /= this.cellSize;
		y /= this.cellSize;

		var x0 = ~~x;
		var x1 = x0 + 1;
		var y0 = ~~y;
		var y1 = y0 + 1;
		// console.log(x0, y);
		var sx = x - x0;
		var sy = y - y0;

		var n0, n1, ix0, ix1, value;
		n0 = this.dotGridGradient(w, x0, y0, x, y);
		n1 = this.dotGridGradient(w, x1, y0, x, y);
		// console.log(n0, n1);

		ix0 = this.lerp(n0, n1, sx);
		
		n0 = this.dotGridGradient(w, x0, y1, x, y);
		n1 = this.dotGridGradient(w, x1, y1, x, y);
		// console.log(n0, n1);

		ix1 = this.lerp(n0, n1, sx);
		value = this.lerp(ix0, ix1, sy);
		// console.log(ix0, ix1, value);

		return value;
	}
}

var el = document.getElementById("hauteur");
var draw = el.getContext('2d');
var constr = document.getElementById("construction").getContext("2d");
var perlin = new PerlinNoise(128, "pattern");
var perlin2 = new PerlinNoise(32, "pattern");
var perlin3 = new PerlinNoise(8, "pattern");

for (var y = 0; y < 512; y++) {
	for (var x = 0; x < 512; x++) {
		var value = perlin.perlin("a", x, y);
		value = ~~((value + 1) * 128);
		var value2 = perlin2.perlin("b", x, y);
		value2 = ~~((value2) * 20);
		var value3 = perlin3.perlin("c", x, y);
		value3 = ~~((value3) * 20);
		value += value2;
		draw.fillStyle = 'rgb('+value+','+value+','+value+')';
		draw.fillRect(x, y, 1, 1);
	}
}
// var x=0,y=0;
// var inter = setInterval(()=>{
// 		var value = perlin.perlin("a", x, y);
// 		value = ~~((value + 1) * 128);
// 		draw.fillStyle = 'rgb('+value+', 0, 0)';
// 		draw.fillRect(x, y, 1, 1);
// 		x++;
// 		if (x > 512)
// 		{
// 			x = 0;
// 			y++;
// 			if (y > 512)
// 				clearInterval(inter);
// 		}
// }, 0.0001)

// // Function to linearly interpolate between a0 and a1
// // Weight w should be in the range [0.0, 1.0]
//  function lerp(float a0, float a1, float w) {
// 	return (1.0 - w)*a0 + w*a1;
// }

// // Computes the dot product of the distance and gradient vectors.
// function dotGridGradient(int ix, int iy, float x, float y) {

// 	// Precomputed (or otherwise) gradient vectors at each grid node
// 	extern float Gradient[IYMAX][IXMAX][2];

// 	// Compute the distance vector
// 	float dx = x - (float)ix;
// 	float dy = y - (float)iy;

// 	// Compute the dot-product
// 	return (dx*Gradient[iy][ix][0] + dy*Gradient[iy][ix][1]);
// }

// // Compute Perlin noise at coordinates x, y
// function perlin(float x, float y) {

// 	// Determine grid cell coordinates
// 	int x0 = floor(x);
// 	int x1 = x0 + 1;
// 	int y0 = floor(y);
// 	int y1 = y0 + 1;

// 	// Determine interpolation weights
// 	// Could also use higher order polynomial/s-curve here
// 	float sx = x - (float)x0;
// 	float sy = y - (float)y0;

// 	// Interpolate between grid point gradients
// 	float n0, n1, ix0, ix1, value;
// 	n0 = dotGridGradient(x0, y0, x, y);
// 	n1 = dotGridGradient(x1, y0, x, y);
// 	ix0 = lerp(n0, n1, sx);
// 	n0 = dotGridGradient(x0, y1, x, y);
// 	n1 = dotGridGradient(x1, y1, x, y);
// 	ix1 = lerp(n0, n1, sx);
// 	value = lerp(ix0, ix1, sy);

// 	return value;
// }