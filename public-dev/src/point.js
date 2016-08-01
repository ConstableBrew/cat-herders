export default class Point {
	constructor(x = 0, y = 0) {
		if (x instanceof Point) return new Point(x.x, x.y); // Clone a given Point
		if (!(this instanceof Point)) return new Point(x, y);
		this.x = +x || 0;
		this.y = +y || 0;
	}

    /**
     * Calculates the Pythagorean distance between two given points
     **/
    static distance(A, B) {
        let a = A instanceof Point ? A : new Point();
        let b = B instanceof Point ? B : new Point();

        let x = b.x - a.x;
        let y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    distance(B) {
        return Point.distance(this, B);
    }
}