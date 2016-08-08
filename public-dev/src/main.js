import reducer from './reducer';
import { createStore } from 'redux';
import Hex from './hex';

let store = createStore(reducer);

store.dispatch({type: 'init', mapSize: 5});
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

	state.map.render(state.center, state.hexDimensions, state.canvas.ctx);
	if (state.hoverHex) {
		let hoverHex = new Hex(state.hoverHex);
		hoverHex.label = state.hoverHex.label;
		hoverHex.fillStyle = 'rgba(255,0,0,0.25)';
		if (state.hoverHex.type === 'grass' && state.hoverHex.distance(state.selectedHex) == 1) {
			hoverHex.fillStyle = 'rgba(0,255,0,0.25)';
		}
		hoverHex.render(state.center, state.hexDimensions, state.canvas.ctx);
	}
}


window.requestAnimationFrame(render);