import Hex from './hex';

export class Token extends Hex {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static type = 'token';
	type    = 'token';
	mayMove = false; // True if the token is allowed to be moved (but may not have any valid moves, see canMove)
	
	// validMove// Returns true if the given coordinates are a valid place to move to
	// moveTo  = void 0; // Moves the token to the new coordinates

	/**
	 * Returns true if the token has any valid places to move to (but may not be allowed to move, see mayMove)
	 **/
	canMove() {
		let neighborhood = this.neighborhood(1);
		return neighborhood.some(neighbor => this.validMove(neighbor));
	}

	moveTo(q, r) {
		let toCoords;
		if (q instanceof Hex) {
			toCoords = q.coords();
			r = q.r;
			q = q.q;
		} else {
			toCoords = Hex.coords(q, r);
		}
		this.hexMap[toCoords] = this;
		this.hexMap.unoccupy(this.q, this.r);
		this.q = q;
		this.r = r;
	}
}

export class Player extends Token {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	fillStyle = '#888';

	validMove(q, r) {
		let coords;
		if (q instanceof Hex) {
			coords = q.coords();
		} else {
			coords = Hex.coords(q, r);
		}
		let destination = this.hexMap[coords];
		return destination && destination.type === 'unoccupied' && destination.distance(this) === 1;
	}
}

export class Cat extends Token {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static subtype = 'cat';
	subtype   = 'cat';
	label     = '>^.^<';
	color     = '#fff';
	fillStyle = '#6c9023';

	validMove(q, r) {
		let coords;
		if (q instanceof Hex) {
			coords = q.coords();
		} else {
			coords = Hex.coords(q, r);
		}
		
		let destination = this.hexMap[coords];
		if (destination && destination.subtype === 'grass' && destination.distance(this) === 1) {
			return true; //todo count number of catchers adjacent to space
		}
	}
}

export class Player1 extends Player {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static subtype = 'player1';
	subtype = 'player1';
	label   = '(ツ)';
	color   = '#d00';
}

export class Player2 extends Player {
	constructor(q, r, hexMap) {
		super(q, r, hexMap);
	}

	static subtype = 'player2';
	subtype = 'player2';
	label   = '(◔̯◔)';
	color   = '#00d';
}
