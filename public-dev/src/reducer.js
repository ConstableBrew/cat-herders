import Hex from './hex';
import HexMap from './hex-map';
import Canvas from './canvas';
import Point from './point';
import {Token, Cat, Player, Player1, Player2} from './tokens';
import {Field, Grass} from './ground';


export default function reducer(state = {}, action) {
	switch (action.type) {
		case 'init':
			let canvas = new Canvas();
			let map = new HexMap(action.radius);
			state.map = map;
			state.canvas = canvas;
			initGame(state);
			resize(state);
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
			if (!state.selectedHex) {
				let touchedHex = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
				if (touchedHex && touchedHex.mayMove) {
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
			if (state.selectedHex && (performance.now() - (state.t || 0) ) > 150) {
				let dropHex = state.map.pixelToHex(state.center, state.pxPerHex, action.x, action.y);
				if (state.selectedHex.validMove(dropHex)) {
					state.selectedHex.moveTo(dropHex);
					state.selectedHex.mayMove = false;
					if (state.selectedHex instanceof Player) {
						state.movedPlayerToken = state.selectedHex;
						initCatTurn(state);
					} else if (state.selectedHex instanceof Cat && state.cats.every(cat => !cat.mayMove)) {
						captureCats(state);
					}
				}
				state.selectedHex = null;
				state.hoverHex = null;
			}
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
	state.pxPerHex = Math.min(state.canvas.cvs.width, state.canvas.cvs.height) / state.map.radius / 2;
	state.hexDimensions = Hex.getDimensions(state.pxPerHex);
}

function initGame(state) {
	state.score = {player1: 0, player2: 0};
	state.movedPlayerToken = null;

	// Randomize the grass so we can pick starting locations for the cats
	let grass = [];
	state.cats = [];
	state.map.forEach( hex => {
		if (hex.subtype === 'grass') {
			let i = ~~(Math.random() * grass.length + 0.5);
			if (i === grass.length) {
				grass.push(hex);
			} else {
				grass.push(grass[i]);
				grass[i] = hex;
			}
		}
	});

	let startingPos;

	// Setup cats into 9 random grass locations
	startingPos = grass.slice(0, 9).map(hex => {return {q: hex.q, r: hex.r}});
	state.cats = initTokens(startingPos, Cat, state);

	// Setup player 1 at 3 corners of the field
	startingPos = [
		{q: state.map.radius *  0, r: state.map.radius * -1},
		{q: state.map.radius *  1, r: state.map.radius *  0},
		{q: state.map.radius * -1, r: state.map.radius *  1}
	];
	state.player1 = initTokens(startingPos, Player1, state);

	// Setup player 2 at the other 3 corners of the field
	startingPos = [
		{q: state.map.radius * -1, r: state.map.radius *  0},
		{q: state.map.radius *  1, r: state.map.radius * -1},
		{q: state.map.radius *  0, r: state.map.radius *  1}
	];
	state.player2 = initTokens(startingPos, Player2, state);

	initTurn('player1', state);
}

function initTokens(startingPositions, Constructor, state) {
	return startingPositions.map( coords => {
		let token = new Constructor(coords.q, coords.r, state.map);
		state.map[token.coords()] = token;
		return token;
	});
}

function initTurn(player, state) {
	let currentPlayer;
	let otherPlayer
	if (player === 'player1') {
		currentPlayer = state.player1;
		otherPlayer   = state.player2;
	} else {
		currentPlayer = state.player2;
		otherPlayer   = state.player1;
	}

	currentPlayer.forEach(player => player.mayMove = true);
	otherPlayer.forEach(player => player.mayMove = false);
	state.cats.forEach(cat => cat.mayMove = false);
	state.movedPlayerToken = null;
}

function initCatTurn(state) {
	state.player1.forEach(player => player.mayMove = false);
	state.player2.forEach(player => player.mayMove = false);
	state.cats.forEach(cat => cat.mayMove = false);
	let neighborhood = state.movedPlayerToken.neighborhood(1);
	let strayCats = neighborhood.filter(hex => hex.subtype === 'cat');
    strayCats.forEach(cat => cat.mayMove = true);
    	
    // no cats next to the moved player, immediately check for captured cats
    if (strayCats.length === 0) {
    	captureCats(state);
    }
}

function captureCats(state) {
	let player = state.movedPlayerToken.subtype;
	let capturedCats = state.cats.filter(cat => {
		let catchers = cat.neighborhood(1).filter(hex => hex.subtype === player);
		return catchers.length >= 2;
	});
	capturedCats.forEach(cat => {
		let i = state.cats.indexOf(cat);
		~i && state.cats.splice(i,1);
		state.map.unoccupy(cat.q, cat.r);
		console.log('Captured', cat.q, cat.r);
	});
	state.score[player] += capturedCats.length;
	togglePlayerTurn(state);
}

function togglePlayerTurn(state) {
	let player = state.movedPlayerToken.subtype;
	if (player === 'player1') {
		player = 'player2';
	} else {
		player = 'player1';
	}
	initTurn(player, state)
}