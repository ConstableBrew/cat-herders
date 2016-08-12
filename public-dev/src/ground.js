import Hex from './hex';

export class Unoccupied extends Hex {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static type = 'unoccupied';
	type  = 'unoccupied';
	label = '';
}

export class Grass extends Unoccupied {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static  subtype = 'grass';
	subtype     = 'grass';
	fillStyle   = '#6c9023';
}

export class Fence extends Unoccupied {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static  subtype = 'fence';
	subtype     = 'fence';
	fillStyle   = '#784315';
}