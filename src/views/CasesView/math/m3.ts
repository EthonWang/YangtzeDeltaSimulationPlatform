/**
 * Array of 2 numbers
 */
type Vector2 = [number, number];

/**
 * 3x3 Matrix, containing functions made for 2d, init as an identity matrix
 */
export default class Matrix3 {
    isMat3: boolean;
    elements: number[];

    constructor() {
        this.isMat3 = true;
        this.elements = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

    /**
     * set numbers in the 3x3 Matrix in row-oriented direction
     * @param n11 row 1, col 1
     * @param n12 row 1, col 2
     * @param n13 row 1, col 3
     * @param n21 row 2, col 1
     * @param n22 row 2, col 2
     * @param n23 row 2, col 3
     * @param n31 row 3, col 1
     * @param n32 row 3, col 2
     * @param n33 row 3, col 3
     * @returns 3x3 matrix consisting of numbers input
     */
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): Matrix3 {
        const te = this.elements;
        te[0] = n11; te[1] = n21; te[2] = n31;
        te[3] = n12; te[4] = n22; te[5] = n32;
        te[6] = n13; te[7] = n23; te[8] = n33;
        return this;
    }

    /**
     * make this matrix an identity matrix
     * @returns an identity matrix
     */
    identity() {
        this.set(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );
        return this;
    }

    /**
     * set this matrix using data from a number array, also return this matrix
     * @param array number array containing data for the matrix
     * @param offset the start postion of array to input data
     * @returns a 3x3 matrix made by number input
     */
    fromArray(array: number[], offset = 0) {
        for (let i = 0; i < 9; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }

    /**
     * output matrix data to an array
     * @param array number array for output
     * @param offset the start postion of array for output data
     * @returns new array with matrix data
     */
    toArray(array: number[] = [], offset = 0) {
        const te = this.elements;

        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];

        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];

        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];

        return array;
    }

    /**
     * deep copy this matrix
     * @returns an identical matrix
     */
    clone() {
        return new Matrix3().fromArray(this.elements);
    }

    /**
     * 3x3 Matrix multiply with sequence of a*b
     * @param a one 3x3 Matrix
     * @param b another 3x3 Matrix b
     * @returns multiply result matrix
     */
    static multiply(a: Matrix3, b: Matrix3) {
        const dst = new Matrix3();
        const a00 = a.elements[0 * 3 + 0];
        const a01 = a.elements[0 * 3 + 1];
        const a02 = a.elements[0 * 3 + 2];
        const a10 = a.elements[1 * 3 + 0];
        const a11 = a.elements[1 * 3 + 1];
        const a12 = a.elements[1 * 3 + 2];
        const a20 = a.elements[2 * 3 + 0];
        const a21 = a.elements[2 * 3 + 1];
        const a22 = a.elements[2 * 3 + 2];
        const b00 = b.elements[0 * 3 + 0];
        const b01 = b.elements[0 * 3 + 1];
        const b02 = b.elements[0 * 3 + 2];
        const b10 = b.elements[1 * 3 + 0];
        const b11 = b.elements[1 * 3 + 1];
        const b12 = b.elements[1 * 3 + 2];
        const b20 = b.elements[2 * 3 + 0];
        const b21 = b.elements[2 * 3 + 1];
        const b22 = b.elements[2 * 3 + 2];

        dst.elements[0] = b00 * a00 + b01 * a10 + b02 * a20;
        dst.elements[1] = b00 * a01 + b01 * a11 + b02 * a21;
        dst.elements[2] = b00 * a02 + b01 * a12 + b02 * a22;
        dst.elements[3] = b10 * a00 + b11 * a10 + b12 * a20;
        dst.elements[4] = b10 * a01 + b11 * a11 + b12 * a21;
        dst.elements[5] = b10 * a02 + b11 * a12 + b12 * a22;
        dst.elements[6] = b20 * a00 + b21 * a10 + b22 * a20;
        dst.elements[7] = b20 * a01 + b21 * a11 + b22 * a21;
        dst.elements[8] = b20 * a02 + b21 * a12 + b22 * a22;

        return dst;
    }

    /**
     * projection matrix with specific width & height
     * @param width 
     * @param height 
     * @returns projection matrix (flippig y axis)
     */
    static projection(width: number, height: number) {
        const dst = new Matrix3();
        // Note: This matrix flips the Y axis so 0 is at the top.
        dst.elements[0] = 2 / width;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = -2 / height;
        dst.elements[5] = 0;
        dst.elements[6] = -1;
        dst.elements[7] = 1;
        dst.elements[8] = 1;

        return dst;
    }

    /**
     * project a matrix with specific width and height
     * @param m original matrix 
     * @param width 
     * @param height 
     * @returns matrix projected
     */
    static project(m: Matrix3, width: number, height: number) {
        return Matrix3.multiply(m, Matrix3.projection(width, height));
    }

    /**
     * create a 2d-translation matrix
     * @param tx xAxis translation 
     * @param ty yAxis translation 
     * @returns translation matrix
     */
    static translation(tx: number, ty: number) {
        const dst = new Matrix3();

        dst.elements[0] = 1;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 1;
        dst.elements[5] = 0;
        dst.elements[6] = tx;
        dst.elements[7] = ty;
        dst.elements[8] = 1;

        return dst;
    }

    /**
     * add translation to a matrix
     * @param m original matrix
     * @param tx xAxis translation 
     * @param ty yAxis translation 
     * @returns matrix with translation added
     */
    static translate(m: Matrix3, tx: number, ty: number) {
        return Matrix3.multiply(m, Matrix3.translation(tx, ty));
    }

    /**
     * create a rotation martix
     * @param angleInRadians rotation angle in rad
     * @returns a rotation matrix
     */
    static rotation(angleInRadians: number) {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        const dst = new Matrix3();

        dst.elements[0] = c;
        dst.elements[1] = -s;
        dst.elements[2] = 0;
        dst.elements[3] = s;
        dst.elements[4] = c;
        dst.elements[5] = 0;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 1;

        return dst;
    }

    /**
     * add rotation to a matrix
     * @param m original matrix
     * @param angleInRadians rotation angle in rad
     * @returns matrix with rotation added
     */
    static rotate(m: Matrix3, angleInRadians: number) {
        return Matrix3.multiply(m, Matrix3.rotation(angleInRadians));
    }

    /**
     * create a scale matrix
     * @param sx xAxis scale
     * @param sy yAxis scale
     * @returns a scale matrix
     */
    static scaling(sx: number, sy: number) {
        const dst = new Matrix3();

        dst.elements[0] = sx;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = sy;
        dst.elements[5] = 0;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 1;

        return dst;
    }

    /**
     * add scale to to a matrix
     * @param m original matrix
     * @param sx xAxis scale
     * @param sy yAxis scale
     * @returns matrix with scale added
     */
    static scale(m: Matrix3, sx: number, sy: number) {
        return Matrix3.multiply(m, Matrix3.scaling(sx, sy));
    }

    /**
     * dot product of two vec2 with xy
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     * @returns dot product result
     */
    static dot(x1: number, y1: number, x2: number, y2: number) {
        return x1 * x2 + y1 * y2;
    }

    /**
     * dot product of two vec2
     * @param v1 one vector2
     * @param v2 another vector2
     * @returns dot product result
     */
    static dotVec2(v1: Vector2, v2: Vector2) {
        return v1[0] * v2[0] + v1[1] * v2[1];
    }

    /**
     * calculate distance between two vectors with xy
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     * @returns distance
     */
    static distance(x1: number, y1: number, x2: number, y2: number) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * calculate distance between two vectors
     * @param v1 one vector
     * @param v2 another vector
     * @returns distance
     */
    static distanceVec2(v1: Vector2, v2: Vector2) {
        const dx = v1[0] - v2[0];
        const dy = v1[1] - v2[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * normalize vector with xy
     * @param x 
     * @param y 
     * @returns normalized vec2
     */
    static normalize(x: number, y: number) {
        const l = Matrix3.distance(0, 0, x, y);
        if (l > 0.00001) {
            return [x / l, y / l] as Vector2;
        } else {
            return [0, 0] as Vector2;
        }
    }

    /**
     * normalize vector with
     * @param v vec2
     * @returns normalized vec2
     */
    static normalizeVec2(v: Vector2) {
        const l = Matrix3.distance(0, 0, v[0], v[1]);
        if (l > 0.00001) {
            return [v[0] / l, v[1] / l] as Vector2;
        } else {
            return [0, 0] as Vector2;
        }
    }

    /**
     * reflect incident vec2 with normal vec2 (xy)
     * i = incident
     * n = normal
     * @param ix 
     * @param iy 
     * @param nx 
     * @param ny 
     * @returns 
     */
    static reflect(ix: number, iy: number, nx: number, ny: number) {
        // I - 2.0 * dot(N, I) * N.
        const d = Matrix3.dot(nx, ny, ix, iy);
        return [
            ix - 2 * d * nx,
            iy - 2 * d * ny,
        ] as Vector2;
    }

    /**
     * reflect incident vec2 with normal vec2
     * @param incident incident vec2
     * @param normal normal vec2
     * @returns reflection vec2
     */
    static reflectVec2(incident: Vector2, normal: Vector2) {
        // I - 2.0 * dot(N, I) * N.
        const d = Matrix3.dotVec2(incident, normal);
        return [
            incident[0] - 2 * d * normal[0],
            incident[1] - 2 * d * normal[1],
        ] as Vector2;
    }

    static radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    static degToRad(d: number) {
        return d * Math.PI / 180;
    }

    /**
     * 2d-transform a point with a matrix
     * @param m trans matrix
     * @param v vec2 standing for a point
     * @returns point transformed
     */
    static transformPoint(m: Matrix3, v: Vector2) {
        const v0 = v[0];
        const v1 = v[1];
        const d = v0 * m.elements[0 * 3 + 2] + v1 * m.elements[1 * 3 + 2] + m.elements[2 * 3 + 2];
        return [
            (v0 * m.elements[0 * 3 + 0] + v1 * m.elements[1 * 3 + 0] + m.elements[2 * 3 + 0]) / d,
            (v0 * m.elements[0 * 3 + 1] + v1 * m.elements[1 * 3 + 1] + m.elements[2 * 3 + 1]) / d,
        ] as Vector2;
    }

    /**
     * inverse the matrix
     * @param m original matrix
     * @returns xirtam
     */
    static inverse(m: Matrix3) {
        const dst = new Matrix3();

        const m00 = m.elements[0 * 3 + 0];
        const m01 = m.elements[0 * 3 + 1];
        const m02 = m.elements[0 * 3 + 2];
        const m10 = m.elements[1 * 3 + 0];
        const m11 = m.elements[1 * 3 + 1];
        const m12 = m.elements[1 * 3 + 2];
        const m20 = m.elements[2 * 3 + 0];
        const m21 = m.elements[2 * 3 + 1];
        const m22 = m.elements[2 * 3 + 2];

        const b01 = m22 * m11 - m12 * m21;
        const b11 = -m22 * m10 + m12 * m20;
        const b21 = m21 * m10 - m11 * m20;

        const det = m00 * b01 + m01 * b11 + m02 * b21;
        const invDet = 1.0 / det;

        dst.elements[0] = b01 * invDet;
        dst.elements[1] = (-m22 * m01 + m02 * m21) * invDet;
        dst.elements[2] = (m12 * m01 - m02 * m11) * invDet;
        dst.elements[3] = b11 * invDet;
        dst.elements[4] = (m22 * m00 - m02 * m20) * invDet;
        dst.elements[5] = (-m12 * m00 + m02 * m10) * invDet;
        dst.elements[6] = b21 * invDet;
        dst.elements[7] = (-m21 * m00 + m01 * m20) * invDet;
        dst.elements[8] = (m11 * m00 - m01 * m10) * invDet;

        return dst;
    }
}


export {
    Matrix3,
    Vector2
}
