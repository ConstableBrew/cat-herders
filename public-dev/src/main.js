import reducer from './reducer';
import { createStore } from 'redux';

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
	if(state.touching) {
		let fillStyle = state.touching.fillStyle;
		let label = state.touching.label;
		
		state.touching.label = state.touching.coords();
		state.touching.fillStyle = 'rgba(255,0,0,0.25)';
		state.touching.render(state.center, state.hexDimensions, state.canvas.ctx);
		
		state.touching.label = label;
		state.touching.fillStyle = fillStyle;
	}
}


window.requestAnimationFrame(render);