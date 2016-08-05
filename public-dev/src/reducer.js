import Hex from './hex';
import HexMap from './hex-map';
import Canvas from './canvas';
import Point from './point';

export default function reducer(state = {}, action) {
	switch (action.type) {
		case 'init':
			let canvas = new Canvas();
			let centerHex = new Hex();
			let map = new HexMap(action.mapSize);
			map.forEach( hex => {
				if(hex.distance(centerHex) === action.mapSize) {
					hex.strokeStyle = '#aaa';
					hex.fillStyle = '#784315';
					hex.type = 'wall';
				} else {
					hex.strokeStyle = '#aaa';
					hex.fillStyle = '#6c9023';
					hex.type = 'grass';
				}
			})

			state.mapSize = action.mapSize;
			state.map = map;
			state.canvas = canvas;
			resize(state);
			initGame(state);
			return state;

		case 'resize':
			resize(state);
			return state;

		case 'touchmove':
		case 'touchstart':
		case 'touchend':
			state.touching = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
			return state;

		default:
			return state;
	}
}


const sqrt3 = 1.7320508075688772;
const sqrt3_2 = sqrt3/2;

function resize(state) {
	state.canvas.cvs.width = window.innerWidth;
	state.canvas.cvs.height = window.innerHeight;
	state.center = new Point(state.canvas.cvs.width / 2, state.canvas.cvs.height / 2);
	state.pxPerHex = Math.min(state.canvas.cvs.width, state.canvas.cvs.height) / state.mapSize / 2;
	state.hexDimensions = Hex.getDimensions(state.pxPerHex);
}

function initGame(state) {
	let grass = [];
	state.cats = [];
	state.map.forEach( hex => {
		if (hex.type === 'grass') {
			// Randomize the grass
			let i = ~~(Math.random() * grass.length + 0.5);
			if (i === grass.length) {
				grass.push(hex);
			} else {
				grass.push(grass[i]);
				grass[i] = hex;
			}
		}
	});
	state.cats = grass.slice(0, 9);
	state.cats.forEach( hex => {
		hex.label = '>^.^<';
	});
	state.playerA = [];
	[[0,-1],[1,0],[-1,1]].forEach( startingPos => {
		let q = startingPos[0] * state.mapSize;
		let r = startingPos[1] * state.mapSize;
		state.playerA.push(state.map[Hex.coords(q, r)]);
	});
	state.playerB = [];
	[[-1,0],[1,-1],[0,1]].forEach( startingPos => {
		let q = startingPos[0] * state.mapSize;
		let r = startingPos[1] * state.mapSize;
		state.playerB.push(state.map[Hex.coords(q, r)]);
	});
	state.playerA.forEach( hex => {
		hex.label = '(ツ)';
	});
	state.playerB.forEach( hex => {
		hex.label = '(◔̯◔)';
	});
}