import Point from './point';

export default class Hex {
    constructor(q = 0, r = 0) {
        if (q instanceof Hex) return new Hex(q.q, q.r); // Clone a given hex
        this.q = q;
        this.r = r;
    }

    /**
     * Returns the coordinate string of the given hex
     **/
    static coords(hex) {
        return `${q},${r}`
    }

    coords() {
        return Hex.coords(this);
    }

    /**
     * Helper function to identify the cardinal directions of a hex
     **/
    static direction(direction) {
        let directions = [
            {q:+1, r: 0}, {q:+1, r:-1}, {q: 0, r:-1},
            {q:-1, r: 0}, {q:-1, r:+1}, {q: 0, r:+1}
        ];
        let dir = (direction | 0) % 6;
        return directions[dir];
    }
    
    /**
     * Returns the neighboring (adjacent) hex in the given direction
     **/
    static neighbor(hex, direction) {
        hex = hex instanceof Object ? hex : {};

        let dir = Hex.direction(direction);
        return new Hex((hex.q | 0) + dir.q, (hex.r | 0) + dir.r);
    }

    neighbor(direction) {
        return Hex.neighbor(this, direction);
    }

    /**
     * Returns coordinates of all neighboring hexes out to the given distance.
     **/
    static neighborhood(hex, distance) {
        let hex = hex instanceof Object ? hex : {};
        let q = hex.q | 0;
        let r = hex.r | 0;
        let d = distance | 0;
        let neighbors = [];

        for (let dq = -d; dq <= d; ++dq) {
            for (let dr = -d; dr <= d; ++dr) {
                neighbors.push(new Hex(q + dq, r + dr))
            }
        }
        return neighbors;
    }

    neighborhood(distance) {
        return Hex.neighborhood(this, distance);
    }

    satic const rad2deg = Math.PI / 180;
    

    /**
     * Calculates the manhattan distance between two given hexes
     **/
    static distance(A, B) {
        let a = A instanceof Hex ? A : new Hex();
        let b = B instanceof Hex ? B : new Hex();

        return (Math.abs(a.q - b.q) 
            + Math.abs(a.q + a.r - b.q - b.r)
            + Math.abs(a.r - b.r)) / 2
    }

    distance(B) {
        return Hex.distance(this, B);
    }

    /**
     * Helper function to return the point of the given corner
     **/
    static corner(center, size, i) {
        let angleDeg = 60 * (i|0) + 30;
        let angleRad = Hex.rad2deg * angleDeg;
        return new Point(
            center.x + size * Math.cos(angleRad),
            center.y + size * sin(angleRad)
        );
    }

    static render(ctx, center, size) {
        let p = Hex.corner(center, size, 0);
        ctx.moveTo(p.x, p.y);
        for (let i = 1; i < 6; ++i) {
            p = Hex.corner(center, size, i);
            ctx.lineTo(p.x, p.y);
        }
    }

    render(ctx, center, size) {
        return Hex.render(ctx, center, size);
    }
}