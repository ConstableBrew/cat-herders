import reducer from './reducer';
import { createStore } from 'redux';
import Hex from './hex';

let store = createStore(reducer);

store.dispatch({type: 'init', radius: 5});
store.subscribe( () => window.requestAnimationFrame(render));

document.body.addEventListener('mousemove', event => {
	store.dispatch({type: 'touchmove', x: event.clientX, y: event.clientY});
});
document.body.addEventListener('mousedown', event => {
	store.dispatch({type: 'touchstart', x: event.clientX, y: event.clientY});
});
document.body.addEventListener('mouseup', event => {
	store.dispatch({type: 'touchend', x: event.clientX, y: event.clientY});
});
document.body.addEventListener('touchmove', event => {
	store.dispatch({type: 'touchmove', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
});
document.body.addEventListener('touchstart', event => {
	store.dispatch({type: 'touchstart', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
});
document.body.addEventListener('touchend', event => {
	store.dispatch({type: 'touchend', x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
});
window.onresize = event => {
	store.dispatch({type: 'resize'});
};

function render() {
	let state = store.getState();
	state.canvas.render();
	renderScore(state);
	renderMap(state);
}

function renderMap(state) {
	state.map.render(state.center, state.hexDimensions, state.canvas.ctx);
	renderValidHexes(state);
	renderMouseHover(state);
}

function renderValidHexes(state) {
	let validHexes;
	if (state.selectedHex) {
		validHexes = state.selectedHex.neighborhood(1).filter(hex => state.selectedHex.validMove(hex));
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


window.requestAnimationFrame(render);