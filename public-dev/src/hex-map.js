import Hex from './hex';
import {Grass, Fence} from './ground';

const sqrt3 = 1.7320508075688772;
const sqrt3_2 = sqrt3/2;
const sqrt3_3 = sqrt3/3;

export default class HexMap {
    constructor(radius) {
        // Build a hex-shaped map filled with Hex objects
        this.radius = radius;
        for (let q = -radius; q <= radius; ++q) {
            for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); ++r) {
                this.unoccupy(q, r);
            }
        }
    }

    static validCoordinates(hexMap, q, r) {
        return hexMap.radius >= Math.abs(q) && hexMap.radius >= Math.abs(r);
    }

    validCoordinates(q, r) {
        return HexMap.validCoordinates(this, q, r);
    }

    static forEach(hexMap, func) {
        if (typeof func !== 'function') return;

        let hexes = Object.keys(hexMap);
        hexes.forEach( coords => {
            let hex = hexMap[coords];
            if (hex instanceof Hex)
                func(hex);
        });
    }

    forEach(func) {
        return HexMap.forEach(this, func);
    }

    static toArray(hexMap) {
        let array = [];
        hexMap.forEach( hex => array.push(hex));
        return array;
    }

    toArray() {
        return HexMap.toArray(this);
    }

    /**
     * Returns all neighboring hexes to the given hex out to the given distance.
     **/
    static neighborhood(hexMap, hex, distance = 1) {
        if (!hexMap instanceof HexMap) return [];
        if (!hex instanceof Hex) return [];
        let neighbors = [];

        for (let dq = -distance; dq <= distance; ++dq) {
            for (let dr = -distance; dr <= distance; ++dr) {
                let neighborHex = hexMap[Hex.coords(hex.q + dq, hex.r + dr)];
                neighborHex && neighbors.push(neighborHex);
            }
        }
        return neighbors;
    }

    neighborhood(hex, distance) {
        return HexMap.neighborhood(this, hex, distance);
    }

    static unoccupy(hexMap, q, r) {
        let hex = new Grass(q, r, hexMap);
        if (hex.distance() === hexMap.radius) {
            hex = new Fence(q, r, hexMap);
        }
        hexMap[hex.coords()] = hex;
    }

    unoccupy(q, r) {
        HexMap.unoccupy(this, q, r);
    }

    static render(hexMap, center, size, ctx) {
        hexMap.forEach( hex => {
            hex.render(center, size, ctx);
        });
    }

    render(center, size, ctx) {
        return HexMap.render(this, center, size, ctx);
    }

    static pixelToHex(hexMap, center, size, x, y) {
        size = size / 2;

        // Flat top hexes
        let q = (x - center.x) * 0.6666666666666666 / size;
        let r = (-(x - center.x) / 3 + sqrt3_3 * (y - center.y)) / size;
        let coords = Hex.coords(Math.round(q, 0), Math.round(r, 0));
        return hexMap[coords];
    }

    pixelToHex(center, size, x, y) {
        return HexMap.pixelToHex(this, center, size, x, y);
    }
}