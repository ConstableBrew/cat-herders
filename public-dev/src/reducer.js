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
			if (state.selectedHex) {
				state.hoverHex = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
			}
			return state;
		case 'touchstart':
			console.log('down', state.selectedHex);
			if (!state.selectedHex) {
				let touchedHex = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
				if (touchedHex && touchedHex.type === state.turnStates[state.turn % 4]) {
					state.selectedHex = touchedHex;
					state.hoverHex = touchedHex;
				} else {
					state.selectedHex = null;
					state.hoverHex = null;
				}
				state.t = performance.now();
			}
			return state;
		case 'touchend':
			console.log('up', state.selectedHex);
			if (state.selectedHex && (performance.now() - (state.t || 0) ) > 150) {
				let dropHex = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
				if (dropHex.type === 'grass' && dropHex.distance(state.selectedHex) == 1) {
					let tempHex = {...dropHex};
					dropHex.type = state.selectedHex.type;
					dropHex.label = state.selectedHex.label;
					dropHex.color = state.selectedHex.color;
					state.selectedHex.type = tempHex.type;
					state.selectedHex.label = tempHex.label;
					state.selectedHex.color = tempHex.color;
					state.selectedHex.turn = state.turn;

					if (state.turnStates[state.turn % 4] !== 'cat') {
						state.turn++;
						state.movedHex = dropHex;
					}

					state.selectedHex = null;
					state.hoverHex = null;

					let mustMoveCats = state.map.neighborhood(state.movedHex, 1).filter( hex => hex && hex.type === 'cat' && hex.turn !== state.turn && (hex.mustMove = state.turn));
					if (!mustMoveCats)
						state.turn++;
					console.log(state.turnStates[state.turn % 4], state.movedHex, mustMoveCats);
				} else {
					state.selectedHex = null;
					state.hoverHex = null;
				}
			}

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
	state.turn = 0;
	state.turnStates = ['playerA', 'cat', 'playerB', 'cat'];
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
		hex.type = 'cat';
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
		hex.color = '#d00';
		hex.type = 'playerA';
	});
	state.playerB.forEach( hex => {
		hex.label = '(◔̯◔)';
		hex.color = '#00d';
		hex.type = 'playerB';
	});
}