import Hex from './hex';
import Point from './point';

export default class HexMap {
    constructor(radius) {
        // Build a hex-shaped map filled with Hex objects
        let counter = 0;
        for (let q = -radius; q <= radius; ++q) {
            for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); ++r) {
                let hex = new Hex(q, r);
                this[hex.coords()] = hex;
                counter++;
            }
        }
        console.log(counter)
    }

    static forEach(hexMap, func) {
        if (typeof func !== 'function') return;

        let hexes = Object.keys(hexMap);
        hexes.forEach( coords => {
            let hex = hexMap[coords];
            func(hex);
        });
    }

    forEach(func) {
        return HexMap.forEach(this, func);
    }

    static render(hexMap, center, size, ctx) {
         // Flat top hexes
        const width = size;
        const height = width * 0.8660254037844386; // sqrt(3)/2
        const horiz = width * 0.75;
        const vert = height;
        // // Pointy top hexes
        // const height = size;
        // const width = height * 0.8660254037844386; // sqrt(3)/2
        // const vert = height * 0.75;
        // const horiz = width;
        const halfVert = vert * 0.5;

        hexMap.forEach( hex => {
            let c = new Point(center.x + hex.q * horiz , center.y + hex.r * vert + halfVert * hex.q);
            hex.render(c, size, ctx);
            ctx.fillStyle = '#eee';
            ctx.font = '1rem sans-serif';
            ctx.fillText(hex.coords(), c.x - ctx.measureText(hex.coords()).width / 2, c.y + 5);
        });
    }

    render(center, size, ctx) {
        return HexMap.render(this, center, size, ctx);
    }
}