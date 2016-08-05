import Hex from './hex';
import Point from './point';

const sqrt3 = 1.7320508075688772;
const sqrt3_2 = sqrt3/2;
const sqrt3_3 = sqrt3/3;

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
        hexMap.forEach( hex => {
            hex.render(center, size, ctx);
        });
    }

    render(center, size, ctx) {
        return HexMap.render(this, center, size, ctx);
    }

    static pixelToHex(center, size, x, y) {
        size = size / 2;

        // Flat top hexes
        let q = (x - center.x) * 0.6666666666666666 / size;
        let r = (-(x - center.x) / 3 + sqrt3_3 * (y - center.y)) / size;
        return Hex.coords(Math.round(q, 0), Math.round(r, 0));
    }

    pixelToHex(center, size, x, y) {
        return this[HexMap.pixelToHex(center, size, x, y)];
    }
}