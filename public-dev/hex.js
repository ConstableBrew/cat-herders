import Point from './point';

const rad2deg = Math.PI / 180;
const sqrt3 = 1.7320508075688772;
const sqrt3_2 = sqrt3/2;

export default class Hex {
    constructor(q = 0, r = 0, hexMap = null) {
        this.q = q;
        this.r = r;
        this.hexMap = hexMap;
        this.strokeStyle = '#aaa';
    }

    /**
     * Returns the standardized coordinate string of the given hex or coordinates
     **/
    static coords(q, r) {
        if (q instanceof Hex)
            return `${q.q},${q.r}`;
        return `${q},${r}`;
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
        if (hex.hexMap)
            return hex.hexMap[Hex.coords((hex.q | 0) + dir.q, (hex.r | 0) + dir.r)]
        return new Hex((hex.q | 0) + dir.q, (hex.r | 0) + dir.r);
    }

    neighbor(direction) {
        return Hex.neighbor(this, direction);
    }

    /**
     * Returns coordinates of all neighboring hexes out to the given distance.
     **/
    static neighborhood(hex, distance) {
        let q = hex.q;
        let r = hex.r;
        let d = distance;
        let neighbors = [];
        let myCoords = hex.coords();

        for (let dq = -d; dq <= d; ++dq) {
            for (let dr = -d; dr <= d; ++dr) {
                let tmpHex = new Hex(q + dq, r + dr);
                let coords = tmpHex.coords();
                if (coords !== myCoords && hex.distance(tmpHex) <= distance) {
                    if (hex.hexMap) {
                        let neighbor = hex.hexMap[coords];
                        if (neighbor)
                            neighbors.push(neighbor);
                    } else {
                        neighbors.push(tmpHex);
                    }
                }
            }
        }
        return neighbors;
    }

    neighborhood(distance) {
        return Hex.neighborhood(this, distance);
    }

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
    static corner(center, size, i, flatTop = true) {
        let angleDeg = 60 * (i|0) + (flatTop ? 0 : 30);
        let angleRad = rad2deg * angleDeg;
        return new Point(
            center.x + size / 2 * Math.cos(angleRad),
            center.y + size / 2 * Math.sin(angleRad)
        );
    }

    static render(hex, mapCenter, size, ctx) {
        let hexCenter = new Point(mapCenter.x + hex.q * size.horiz , mapCenter.y + hex.r * size.vert + size.vert/2 * hex.q);
        let p = Hex.corner(hexCenter, size.size, 0);
        ctx.beginPath();
        ctx.fillStyle = hex.fillStyle || '#888';
        ctx.strokeStyle = hex.strokeStyle || '#888';
        ctx.lineWidth = hex.lineWidth || 0.025 * size.size;
        ctx.moveTo(p.x, p.y);
        for (let i = 1; i < 6; ++i) {
            p = Hex.corner(hexCenter, size.size, i);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw cell label
        let text = hex.label;
        if (text) {
            let px = 20;
            ctx.fillStyle = hex.color || '#eee';
            ctx.font = px + 'px serif';
            px = (px * 0.66 * size.size / ctx.measureText(text).width);
            ctx.font = px + 'px serif';
            ctx.fillText(text, hexCenter.x - ctx.measureText(text).width / 2, hexCenter.y + px * 0.25); 
        }
    }

    render(mapCenter, size, ctx) {
        return Hex.render(this, mapCenter, size, ctx);
    }

    static getDimensions(size, flatTop = true) {
        var width, height, horiz, vert;

        if (flatTop) {
            width = size;
            height = width * sqrt3_2;
            horiz = width * 0.75;
            vert = height;
        } else {
            height = size;
            width = height * sqrt3_2;
            vert = height * 0.75;
            horiz = width;
        }

        return {
            size,
            width,
            height,
            horiz,
            vert
        };
    }
}