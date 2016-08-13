import Hex from './hex';
import Point from './point';

export class Token extends Hex {
	constructor(q, r, hexMap, sprite) {
		super(q, r, hexMap);
		this.spritesheet = sprite.spritesheet;
		this.sx = sprite.sx;
		this.sy = sprite.sy;
		this.sw = sprite.sw;
		this.sh = sprite.sh;
	}
	mayMove = false; // True if the token is allowed to be moved (but may not have any valid moves, see canMove)
	
	// validMove// Returns true if the given coordinates are a valid place to move to
	// moveTo  = void 0; // Moves the token to the new coordinates

	/**
	 * Returns true if the token has any valid places to move to (but may not be allowed to move, see mayMove)
	 **/
	canMove() {
		let neighborhood = this.neighborhood(2);
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

    static render(hex, mapCenter, size, ctx) {
        let topLeft = new Point(mapCenter.x + hex.q * size.horiz - size.width/2, mapCenter.y + hex.r * size.vert + size.vert/2 * hex.q - size.height/2);
        ctx.drawImage(hex.spritesheet, hex.sx, hex.sy, hex.sw, hex.sh, topLeft.x, topLeft.y, size.width, size.height);
    }

    render(mapCenter, size, ctx) {
    	super.render(mapCenter, size, ctx);
    	Token.render(this, mapCenter, size, ctx);
    }
}

export class Player extends Token {
	constructor(q, r, hexMap, sprite) {
		super(q, r, hexMap, sprite);
	}

	type = 'player';
	fillStyle = '#888';

	validMove(q, r) {
		let coords;
		if (q instanceof Hex) {
			coords = q.coords();
		} else {
			coords = Hex.coords(q, r);
		}
		let destination = this.hexMap[coords];
		return destination && destination.type === 'unoccupied' && destination.distance(this) <= 2;
	}
}

export class Cat extends Token {
	constructor(q, r, hexMap, sprite) {
		super(q, r, hexMap, sprite);
	}

	type      = 'cat';
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
			// For each adjacent grass space, count the number of catchers adjacent to that space.
			// Valid moves are only to the spaces with the fewest number of adjacent catchers.
			let neighboringGrass = this.neighborhood(1)
				.filter(hex => hex.subtype === 'grass')
				.reduce((heap, hex) => {
					let catcherCount = hex.neighborhood(1).filter(h => h.type === 'player').length;
					!heap[catcherCount] && (heap[catcherCount] = []);
					heap[catcherCount].push(hex);
					return heap;
				},{});
			let lowest = Math.min.apply(null, Object.keys(neighboringGrass));
			let validMoves = neighboringGrass[lowest];
			return ~validMoves.indexOf(destination);
		}
	}
}

export class Player1 extends Player {
	constructor(q, r, hexMap, sprite) {
		super(q, r, hexMap, sprite);
	}

	subtype = 'player1';
	label   = '(ツ)';
	color   = '#d00';
}

export class Player2 extends Player {
	constructor(q, r, hexMap, sprite) {
		super(q, r, hexMap, sprite);
	}

	subtype = 'player2';
	label   = '(◔̯◔)';
	color   = '#00d';
}
