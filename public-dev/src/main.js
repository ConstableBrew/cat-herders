import Hex from './hex';
import HexMap from './hex-map';
import Canvas from './canvas';
import Point from './point';

const mapSize = 5;

let centerHex = new Hex();
let map = new HexMap(mapSize);
map.forEach( hex => {
	if(hex.distance(centerHex) === 5) {
		hex.strokeStyle = '#aaa';
		hex.fillStyle = '#784315';
	} else {
		hex.strokeStyle = '#aaa';
		hex.fillStyle = '#6c9023';
	}
})
let canvas = new Canvas();

function render() {
	canvas.render();
	let center = new Point(canvas.cvs.width / 2, canvas.cvs.height / 2);
	let size = Math.min(canvas.cvs.width, canvas.cvs.height) / mapSize / 2;
	map.render(center, size, canvas.ctx);
}

setTimeout(render,0);