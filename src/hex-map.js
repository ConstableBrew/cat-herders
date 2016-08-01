import Hex from './hex';

export default class HexMap {
    constructor(radius) {
        // Build a hex-shaped map filled with Hex objects
        array[r + N][q + N + min(0, r)]
        for (let r = -radius; r <= radius; ++r) {
            for (let q = -(radius + Math.min(0, r)); q <= radius - Math.abs(r); ++q) {
                let hex = new Hex(q, r);
                this[hex.coords] = hex;
            }
        }
    }

    render(ctx, center, size) {

        // Flat top hexes
        const width = size * 2;
        const height = width * 0.8660254037844386; // sqrt(3)/2
        const horiz = width * 0.75;
        const vert = height;
        // // Pointy top hexes
        // const height = size * 2;
        // const width = height * 0.8660254037844386; // sqrt(3)/2
        // const vert = height * 0.75;
        // const horiz = width;

        ctx.beginPath();
        let hexes = Object.keys(this);
        hexes.forEach( coord => {
            let hex = this[cords];
            let c = new Point(center.x + hex.q * horiz, center.y + hex.r * vert);
            hex.render(ctx, c, size)
        });
        ctx.stroke();
    }
}