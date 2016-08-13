import reducer from './reducer';
import { createStore } from 'redux';
import Hex from './hex';

let store = createStore(reducer);

store.dispatch({type: 'init', radius: 5});
store.subscribe( () => window.requestAnimationFrame(render));
setupInputListeners(store);

let spritesheet = store.getState().spritesheet;
spritesheet.src = 'cat-herders-pieces.png';
spritesheet.addEventListener('load', () => store.dispatch({type: 'spritesheet', spritesheet}), false);

function setupInputListeners(store) {
	let docBody = document.body;
	docBody.addEventListener('mousemove', event => {
		store.dispatch({type: 'touchmove', x: event.clientX, y: event.clientY});
	});
	docBody.addEventListener('mousedown', event => {
		store.dispatch({type: 'touchstart', x: event.clientX, y: event.clientY});
	});
	docBody.addEventListener('mouseup', event => {
		store.dispatch({type: 'touchend', x: event.clientX, y: event.clientY});
	});
	docBody.addEventListener('touchmove', event => {
		store.dispatch({type: 'touchmove', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
	});
	docBody.addEventListener('touchstart', event => {
		store.dispatch({type: 'touchstart', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
	});
	docBody.addEventListener('touchend', event => {
		store.dispatch({type: 'touchend', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
	});
	window.onresize = event => {
		store.dispatch({type: 'resize'});
	};
	document.getElementById('instructions').addEventListener('click', hideInstructions);
	document.getElementById('backdrop').addEventListener('click', hideInstructions);
}

function hideInstructions (){
	document.getElementById('instructions').style.display = 'none';
	document.getElementById('backdrop').style.display = 'none';
}

function render() {
	let state = store.getState();
	state.canvas.render();
	renderScore(state);
	renderMap(state);
	if (!state.cats.length) renderGameOver(state);
}

function renderMap(state) {
	state.map.render(state.center, state.hexDimensions, state.canvas.ctx);
	renderValidHexes(state);
	renderMouseHover(state);
}

function renderValidHexes(state) {
	let validHexes;
	if (state.selectedHex) {
		validHexes = state.selectedHex.neighborhood(2).filter(hex => state.selectedHex.validMove(hex));
	} else {
		validHexes = state.map.toArray().filter(hex => hex.mayMove);
	}
	if (validHexes.length) {
		// highlight all the valid hexes
		validHexes.forEach(hex => {
			let highlightHex = new Hex(hex.q, hex.r);
			highlightHex.fillStyle = 'rgba(0,0,0,0)';
			highlightHex.strokeStyle = 'rgba(0,255,0,0.75)';
			highlightHex.render(state.center, state.hexDimensions, state.canvas.ctx);
		});
	}
}

function renderMouseHover(state) {
	if (state.hoverHex) {
		// Indicate whether or not the hoverHex is a valid drop location
		let hoverHex = new Hex(state.hoverHex.q, state.hoverHex.r);
		hoverHex.label = state.hoverHex.label;
		hoverHex.color = state.hoverHex.color;
		if (state.selectedHex.validMove(state.hoverHex)) {
			hoverHex.fillStyle = 'rgba(0,255,0,0.25)';
			hoverHex.strokeStyle = 'rgba(0,255,0,0.75)';
		} else {
			hoverHex.fillStyle = 'rgba(255,0,0,0.25)';
			hoverHex.strokeStyle = 'rgba(255,0,0,0.75)';
		}
		hoverHex.render(state.center, state.hexDimensions, state.canvas.ctx);
	}
}

function renderScore(state) {
	let ctx = state.canvas.ctx;
    let px = 20;
    let text;
    let textWidth;

	// player 1
	text = '(ツ)';
	ctx.fillStyle = '#d00';
    ctx.font = px + 'px serif';
    px = (px * state.hexDimensions.width / ctx.measureText(text).width);
    ctx.font = px + 'px serif';
    textWidth = ctx.measureText(text).width;
	ctx.fillText(text, 20, 1.5 * px);
	ctx.fillText(state.score['player1'], 20 + textWidth + px, 1.5 * px);

	// player 2
	text = '(◔̯◔)';
	ctx.fillStyle = '#00d';
    let px2 = (px * state.hexDimensions.width / ctx.measureText(text).width);
    ctx.font = px2 + 'px serif';
	ctx.fillText(text, 20, 3 * px);
    ctx.font = px + 'px serif';
	ctx.fillText(state.score['player2'], 20 + textWidth + px, 3 * px);
}

function renderGameOver(state) {
	let ctx = state.canvas.ctx;
	let cvs = state.canvas.cvs;
    let px = 30;
    let text;
    let color;

    if (state.score['player1'] > state.score['player2']) {
		// player 1
		text = '(ツ) WINS!';
		color = '#d00';
    } else {
		// player 2
		text = '(◔̯◔) WINS!';
		color = '#00d';
    }
    ctx.font = px + 'px serif';
    let textWidth = ctx.measureText(text).width;
    let offset = cvs.width - textWidth;
	ctx.fillStyle = '#fff';
	ctx.fillText(text, offset/2 + 1.5, cvs.height/2 + 1.5);
	ctx.fillText(text, offset/2 + 1.5, cvs.height/2 + 0);
	ctx.fillText(text, offset/2 + 1.5, cvs.height/2 - 1.5);
	ctx.fillText(text, offset/2 + 0, cvs.height/2 + 1.5);
	ctx.fillText(text, offset/2 + 0, cvs.height/2 - 1.5);
	ctx.fillText(text, offset/2 - 1.5, cvs.height/2 + 1.5);
	ctx.fillText(text, offset/2 - 1.5, cvs.height/2 + 0);
	ctx.fillText(text, offset/2 - 1.5, cvs.height/2 - 1.5);

	ctx.fillStyle = color;
	ctx.fillText(text, offset/2 + 0, cvs.height/2 + 0);
}


window.requestAnimationFrame(render);