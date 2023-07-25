import Matrix3 from "./m3";

/**
 * Array of 3 numbers
 */
type Vector3 = [number, number, number];

/**
 * Array of 4 numbers
 */
type Vector4 = [number, number, number, number];

/**
 * 4x4 Matrix, containing functions for 3d, init as an identity matrix
 */
export default class Matrix4 {
    isMat4: boolean;
    /**
     * store matrix data
     */ 
    elements: number[];

    constructor() {
        this.isMat4 = true;
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number,
        n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number) {

        const te = this.elements;

        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

        return this;
    }

    identity() {
        this.set(

            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

        );
        return this;
    }

    fromArray(array: number[], offset = 0) {
        for (let i = 0; i < 16; i++) {

            this.elements[i] = array[i + offset];

        }

        return this;
    }

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
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];

        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];

        return array;
    }

    clone() {
        return new Matrix4().fromArray(this.elements);
    }

    copy(m: Matrix4) {
        const te = this.elements;
        const me = m.elements;

        te[0] = me[0]; te[1] = me[1]; te[2] = me[2]; te[3] = me[3];
        te[4] = me[4]; te[5] = me[5]; te[6] = me[6]; te[7] = me[7];
        te[8] = me[8]; te[9] = me[9]; te[10] = me[10]; te[11] = me[11];
        te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; te[15] = me[15];

        return this;
    }

    equals(matrix: Matrix4) {
        const te = this.elements;
        const me = matrix.elements;

        for (let i = 0; i < 16; i++) {

            if (te[i] !== me[i]) return false;

        }

        return true;
    }

    copyPosition(m: Matrix4) {
        const te = this.elements, me = m.elements;

        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];

        return this;
    }

    setFromMatrix3(m: Matrix3) {
        const me = m.elements;

        this.set(

            me[0], me[3], me[6], 0,
            me[1], me[4], me[7], 0,
            me[2], me[5], me[8], 0,
            0, 0, 0, 1

        );

        return this;
    }

    static multiply(a: Matrix4, b: Matrix4) {
        const dst = new Matrix4();
        const b00 = b.elements[0 * 4 + 0];
        const b01 = b.elements[0 * 4 + 1];
        const b02 = b.elements[0 * 4 + 2];
        const b03 = b.elements[0 * 4 + 3];
        const b10 = b.elements[1 * 4 + 0];
        const b11 = b.elements[1 * 4 + 1];
        const b12 = b.elements[1 * 4 + 2];
        const b13 = b.elements[1 * 4 + 3];
        const b20 = b.elements[2 * 4 + 0];
        const b21 = b.elements[2 * 4 + 1];
        const b22 = b.elements[2 * 4 + 2];
        const b23 = b.elements[2 * 4 + 3];
        const b30 = b.elements[3 * 4 + 0];
        const b31 = b.elements[3 * 4 + 1];
        const b32 = b.elements[3 * 4 + 2];
        const b33 = b.elements[3 * 4 + 3];
        const a00 = a.elements[0 * 4 + 0];
        const a01 = a.elements[0 * 4 + 1];
        const a02 = a.elements[0 * 4 + 2];
        const a03 = a.elements[0 * 4 + 3];
        const a10 = a.elements[1 * 4 + 0];
        const a11 = a.elements[1 * 4 + 1];
        const a12 = a.elements[1 * 4 + 2];
        const a13 = a.elements[1 * 4 + 3];
        const a20 = a.elements[2 * 4 + 0];
        const a21 = a.elements[2 * 4 + 1];
        const a22 = a.elements[2 * 4 + 2];
        const a23 = a.elements[2 * 4 + 3];
        const a30 = a.elements[3 * 4 + 0];
        const a31 = a.elements[3 * 4 + 1];
        const a32 = a.elements[3 * 4 + 2];
        const a33 = a.elements[3 * 4 + 3];
        dst.elements[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dst.elements[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dst.elements[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dst.elements[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dst.elements[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dst.elements[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dst.elements[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dst.elements[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dst.elements[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dst.elements[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dst.elements[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dst.elements[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dst.elements[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dst.elements[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dst.elements[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dst.elements[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return dst;
    }

    static addVectors(a: Vector3, b: Vector3) {
        const dst = [0, 0, 0] as Vector3;
        dst[0] = a[0] + b[0];
        dst[1] = a[1] + b[1];
        dst[2] = a[2] + b[2];
        return dst;
    }

    static subtractVectors(a: Vector3, b: Vector3) {
        const dst = [0, 0, 0] as Vector3;
        dst[0] = a[0] - b[0];
        dst[1] = a[1] - b[1];
        dst[2] = a[2] - b[2];
        return dst;
    }

    static scaleVector(v: Vector3, s: number) {
        const dst = [0, 0, 0] as Vector3;
        dst[0] = v[0] * s;
        dst[1] = v[1] * s;
        dst[2] = v[2] * s;
        return dst;
    }

    static normalize(v: Vector3) {
        const dst = [0, 0, 0] as Vector3;
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            dst[0] = v[0] / length;
            dst[1] = v[1] / length;
            dst[2] = v[2] / length;
        }
        return dst;
    }

    static len(v: Vector3) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    }

    static lengthSq(v: Vector3) {
        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }

    static cross(a: Vector3, b: Vector3) {
        const dst = [0, 0, 0] as Vector3;
        dst[0] = a[1] * b[2] - a[2] * b[1];
        dst[1] = a[2] * b[0] - a[0] * b[2];
        dst[2] = a[0] * b[1] - a[1] * b[0];
        return dst;
    }

    static dot(a: Vector3, b: Vector3) {
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    }

    static distanceSq(a: Vector3, b: Vector3) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return dx * dx + dy * dy + dz * dz;
    }

    static distance(a: Vector3, b: Vector3) {
        return Math.sqrt(Matrix4.distanceSq(a, b));
    }

    static transpose(m: Matrix4) {
        const dst = new Matrix4();

        dst.elements[0] = m.elements[0];
        dst.elements[1] = m.elements[4];
        dst.elements[2] = m.elements[8];
        dst.elements[3] = m.elements[12];
        dst.elements[4] = m.elements[1];
        dst.elements[5] = m.elements[5];
        dst.elements[6] = m.elements[9];
        dst.elements[7] = m.elements[13];
        dst.elements[8] = m.elements[2];
        dst.elements[9] = m.elements[6];
        dst.elements[10] = m.elements[10];
        dst.elements[11] = m.elements[14];
        dst.elements[12] = m.elements[3];
        dst.elements[13] = m.elements[7];
        dst.elements[14] = m.elements[11];
        dst.elements[15] = m.elements[15];

        return dst;
    }

    static lookAt(cameraPosition: Vector3, target: Vector3, up: Vector3) {
        const dst = new Matrix4();
        const zAxis = Matrix4.normalize(
            Matrix4.subtractVectors(cameraPosition, target));
        const xAxis = Matrix4.normalize(Matrix4.cross(up, zAxis));
        const yAxis = Matrix4.normalize(Matrix4.cross(zAxis, xAxis));

        dst.elements[0] = xAxis[0];
        dst.elements[1] = xAxis[1];
        dst.elements[2] = xAxis[2];
        dst.elements[3] = 0;
        dst.elements[4] = yAxis[0];
        dst.elements[5] = yAxis[1];
        dst.elements[6] = yAxis[2];
        dst.elements[7] = 0;
        dst.elements[8] = zAxis[0];
        dst.elements[9] = zAxis[1];
        dst.elements[10] = zAxis[2];
        dst.elements[11] = 0;
        dst.elements[12] = cameraPosition[0];
        dst.elements[13] = cameraPosition[1];
        dst.elements[14] = cameraPosition[2];
        dst.elements[15] = 1;

        return dst;
    }

    static perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
        const dst = new Matrix4();
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        const rangeInv = 1.0 / (near - far);

        dst.elements[0] = f / aspect;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = f;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 0;
        dst.elements[9] = 0;
        dst.elements[10] = (near + far) * rangeInv;
        dst.elements[11] = -1;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = near * far * rangeInv * 2;
        dst.elements[15] = 0;

        return dst;
    }

    static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const dst = new Matrix4();

        dst.elements[0] = 2 / (right - left);
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = 2 / (top - bottom);
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 0;
        dst.elements[9] = 0;
        dst.elements[10] = 2 / (near - far);
        dst.elements[11] = 0;
        dst.elements[12] = (left + right) / (left - right);
        dst.elements[13] = (bottom + top) / (bottom - top);
        dst.elements[14] = (near + far) / (near - far);
        dst.elements[15] = 1;

        return dst;
    }

    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const dst = new Matrix4();

        const dx = right - left;
        const dy = top - bottom;
        const dz = far - near;

        dst.elements[0] = 2 * near / dx;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = 2 * near / dy;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = (left + right) / dx;
        dst.elements[9] = (top + bottom) / dy;
        dst.elements[10] = -(far + near) / dz;
        dst.elements[11] = -1;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = -2 * near * far / dz;
        dst.elements[15] = 0;

        return dst;
    }

    /**
     * Makes a translation matrix
     * @param {number} tx x translation.
     * @param {number} ty y translation.
     * @param {number} tz z translation.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static translation(tx: number, ty: number, tz: number): Matrix4 {
        const dst = new Matrix4();

        dst.elements[0] = 1;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = 1;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 0;
        dst.elements[9] = 0;
        dst.elements[10] = 1;
        dst.elements[11] = 0;
        dst.elements[12] = tx;
        dst.elements[13] = ty;
        dst.elements[14] = tz;
        dst.elements[15] = 1;

        return dst;
    }

    static translate(m: Matrix4, tx: number, ty: number, tz: number) {
        // This is the optimized version of
        // return multiply(m, translation(tx, ty, tz));
        const dst = new Matrix4();

        const m00 = m.elements[0];
        const m01 = m.elements[1];
        const m02 = m.elements[2];
        const m03 = m.elements[3];
        const m10 = m.elements[1 * 4 + 0];
        const m11 = m.elements[1 * 4 + 1];
        const m12 = m.elements[1 * 4 + 2];
        const m13 = m.elements[1 * 4 + 3];
        const m20 = m.elements[2 * 4 + 0];
        const m21 = m.elements[2 * 4 + 1];
        const m22 = m.elements[2 * 4 + 2];
        const m23 = m.elements[2 * 4 + 3];
        const m30 = m.elements[3 * 4 + 0];
        const m31 = m.elements[3 * 4 + 1];
        const m32 = m.elements[3 * 4 + 2];
        const m33 = m.elements[3 * 4 + 3];

        if (!m.equals(dst)) {
            dst.elements[0] = m00;
            dst.elements[1] = m01;
            dst.elements[2] = m02;
            dst.elements[3] = m03;
            dst.elements[4] = m10;
            dst.elements[5] = m11;
            dst.elements[6] = m12;
            dst.elements[7] = m13;
            dst.elements[8] = m20;
            dst.elements[9] = m21;
            dst.elements[10] = m22;
            dst.elements[11] = m23;
        }

        dst.elements[12] = m00 * tx + m10 * ty + m20 * tz + m30;
        dst.elements[13] = m01 * tx + m11 * ty + m21 * tz + m31;
        dst.elements[14] = m02 * tx + m12 * ty + m22 * tz + m32;
        dst.elements[15] = m03 * tx + m13 * ty + m23 * tz + m33;

        return dst;
    }

    static xRotation(angleInRadians: number) {
        const dst = new Matrix4();
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        dst.elements[0] = 1;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = c;
        dst.elements[6] = s;
        dst.elements[7] = 0;
        dst.elements[8] = 0;
        dst.elements[9] = -s;
        dst.elements[10] = c;
        dst.elements[11] = 0;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = 0;
        dst.elements[15] = 1;

        return dst;
    }

    static xRotate(m: Matrix4, angleInRadians: number) {
        // this is the optimized version of
        // return multiply(m, xRotation(angleInRadians));
        const dst = new Matrix4();

        const m10 = m.elements[4];
        const m11 = m.elements[5];
        const m12 = m.elements[6];
        const m13 = m.elements[7];
        const m20 = m.elements[8];
        const m21 = m.elements[9];
        const m22 = m.elements[10];
        const m23 = m.elements[11];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        dst.elements[4] = c * m10 + s * m20;
        dst.elements[5] = c * m11 + s * m21;
        dst.elements[6] = c * m12 + s * m22;
        dst.elements[7] = c * m13 + s * m23;
        dst.elements[8] = c * m20 - s * m10;
        dst.elements[9] = c * m21 - s * m11;
        dst.elements[10] = c * m22 - s * m12;
        dst.elements[11] = c * m23 - s * m13;

        if (!m.equals(dst)) {
            dst.elements[0] = m.elements[0];
            dst.elements[1] = m.elements[1];
            dst.elements[2] = m.elements[2];
            dst.elements[3] = m.elements[3];
            dst.elements[12] = m.elements[12];
            dst.elements[13] = m.elements[13];
            dst.elements[14] = m.elements[14];
            dst.elements[15] = m.elements[15];
        }

        return dst;
    }

    /**
     * Makes an y rotation matrix
     * @param {number} angleInRadians amount to rotate
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static yRotation(angleInRadians: number): Matrix4 {
        const dst = new Matrix4();
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        dst.elements[0] = c;
        dst.elements[1] = 0;
        dst.elements[2] = -s;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = 1;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = s;
        dst.elements[9] = 0;
        dst.elements[10] = c;
        dst.elements[11] = 0;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = 0;
        dst.elements[15] = 1;

        return dst;
    }

    /**
     * Multiply by an y rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static yRotate(m: Matrix4, angleInRadians: number): Matrix4 {
        // this is the optimized version of
        // return multiply(m, yRotation(angleInRadians));
        const dst = new Matrix4();

        const m00 = m.elements[0 * 4 + 0];
        const m01 = m.elements[0 * 4 + 1];
        const m02 = m.elements[0 * 4 + 2];
        const m03 = m.elements[0 * 4 + 3];
        const m20 = m.elements[2 * 4 + 0];
        const m21 = m.elements[2 * 4 + 1];
        const m22 = m.elements[2 * 4 + 2];
        const m23 = m.elements[2 * 4 + 3];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        dst.elements[0] = c * m00 - s * m20;
        dst.elements[1] = c * m01 - s * m21;
        dst.elements[2] = c * m02 - s * m22;
        dst.elements[3] = c * m03 - s * m23;
        dst.elements[8] = c * m20 + s * m00;
        dst.elements[9] = c * m21 + s * m01;
        dst.elements[10] = c * m22 + s * m02;
        dst.elements[11] = c * m23 + s * m03;

        if (!m.equals(dst)) {
            dst.elements[4] = m.elements[4];
            dst.elements[5] = m.elements[5];
            dst.elements[6] = m.elements[6];
            dst.elements[7] = m.elements[7];
            dst.elements[12] = m.elements[12];
            dst.elements[13] = m.elements[13];
            dst.elements[14] = m.elements[14];
            dst.elements[15] = m.elements[15];
        }

        return dst;
    }

    /**
     * Makes an z rotation matrix
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static zRotation(angleInRadians: number): Matrix4 {
        const dst = new Matrix4();
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        dst.elements[0] = c;
        dst.elements[1] = s;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = -s;
        dst.elements[5] = c;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 0;
        dst.elements[9] = 0;
        dst.elements[10] = 1;
        dst.elements[11] = 0;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = 0;
        dst.elements[15] = 1;

        return dst;
    }

    /**
     * Multiply by an z rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} angleInRadians amount to rotate
     * @return {Matrix4} a new matrix
     * @memberOf module:webgl-3d-math
     */
    static zRotate(m: Matrix4, angleInRadians: number): Matrix4 {
        // This is the optimized version of
        // return multiply(m, zRotation(angleInRadians));
        const dst = new Matrix4();

        const m00 = m.elements[0 * 4 + 0];
        const m01 = m.elements[0 * 4 + 1];
        const m02 = m.elements[0 * 4 + 2];
        const m03 = m.elements[0 * 4 + 3];
        const m10 = m.elements[1 * 4 + 0];
        const m11 = m.elements[1 * 4 + 1];
        const m12 = m.elements[1 * 4 + 2];
        const m13 = m.elements[1 * 4 + 3];
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        dst.elements[0] = c * m00 + s * m10;
        dst.elements[1] = c * m01 + s * m11;
        dst.elements[2] = c * m02 + s * m12;
        dst.elements[3] = c * m03 + s * m13;
        dst.elements[4] = c * m10 - s * m00;
        dst.elements[5] = c * m11 - s * m01;
        dst.elements[6] = c * m12 - s * m02;
        dst.elements[7] = c * m13 - s * m03;

        if (!m.equals(dst)) {
            dst.elements[8] = m.elements[8];
            dst.elements[9] = m.elements[9];
            dst.elements[10] = m.elements[10];
            dst.elements[11] = m.elements[11];
            dst.elements[12] = m.elements[12];
            dst.elements[13] = m.elements[13];
            dst.elements[14] = m.elements[14];
            dst.elements[15] = m.elements[15];
        }

        return dst;
    }

    /**
     * Makes an rotation matrix around an arbitrary axis
     * @param {Vector3} axis axis to rotate around
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static axisRotation(axis: Vector3, angleInRadians: number): Matrix4 {
        const dst = new Matrix4();

        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        const oneMinusCosine = 1 - c;

        dst.elements[0] = xx + (1 - xx) * c;
        dst.elements[1] = x * y * oneMinusCosine + z * s;
        dst.elements[2] = x * z * oneMinusCosine - y * s;
        dst.elements[3] = 0;
        dst.elements[4] = x * y * oneMinusCosine - z * s;
        dst.elements[5] = yy + (1 - yy) * c;
        dst.elements[6] = y * z * oneMinusCosine + x * s;
        dst.elements[7] = 0;
        dst.elements[8] = x * z * oneMinusCosine + y * s;
        dst.elements[9] = y * z * oneMinusCosine - x * s;
        dst.elements[10] = zz + (1 - zz) * c;
        dst.elements[11] = 0;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = 0;
        dst.elements[15] = 1;

        return dst;
    }

    /**
     * Multiply by an axis rotation matrix
     * @param {Matrix4} m matrix to multiply
     * @param {Vector3} axis axis to rotate around
     * @param {number} angleInRadians amount to rotate
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static axisRotate(m: Matrix4, axis: Vector3, angleInRadians: number): Matrix4 {
        // This is the optimized version of
        // return multiply(m, axisRotation(axis, angleInRadians));
        const dst = new Matrix4();

        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        const n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;
        const xx = x * x;
        const yy = y * y;
        const zz = z * z;
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);
        const oneMinusCosine = 1 - c;

        const r00 = xx + (1 - xx) * c;
        const r01 = x * y * oneMinusCosine + z * s;
        const r02 = x * z * oneMinusCosine - y * s;
        const r10 = x * y * oneMinusCosine - z * s;
        const r11 = yy + (1 - yy) * c;
        const r12 = y * z * oneMinusCosine + x * s;
        const r20 = x * z * oneMinusCosine + y * s;
        const r21 = y * z * oneMinusCosine - x * s;
        const r22 = zz + (1 - zz) * c;

        const m00 = m.elements[0];
        const m01 = m.elements[1];
        const m02 = m.elements[2];
        const m03 = m.elements[3];
        const m10 = m.elements[4];
        const m11 = m.elements[5];
        const m12 = m.elements[6];
        const m13 = m.elements[7];
        const m20 = m.elements[8];
        const m21 = m.elements[9];
        const m22 = m.elements[10];
        const m23 = m.elements[11];

        dst.elements[0] = r00 * m00 + r01 * m10 + r02 * m20;
        dst.elements[1] = r00 * m01 + r01 * m11 + r02 * m21;
        dst.elements[2] = r00 * m02 + r01 * m12 + r02 * m22;
        dst.elements[3] = r00 * m03 + r01 * m13 + r02 * m23;
        dst.elements[4] = r10 * m00 + r11 * m10 + r12 * m20;
        dst.elements[5] = r10 * m01 + r11 * m11 + r12 * m21;
        dst.elements[6] = r10 * m02 + r11 * m12 + r12 * m22;
        dst.elements[7] = r10 * m03 + r11 * m13 + r12 * m23;
        dst.elements[8] = r20 * m00 + r21 * m10 + r22 * m20;
        dst.elements[9] = r20 * m01 + r21 * m11 + r22 * m21;
        dst.elements[10] = r20 * m02 + r21 * m12 + r22 * m22;
        dst.elements[11] = r20 * m03 + r21 * m13 + r22 * m23;

        if (!m.equals(dst)) {
            dst.elements[12] = m.elements[12];
            dst.elements[13] = m.elements[13];
            dst.elements[14] = m.elements[14];
            dst.elements[15] = m.elements[15];
        }

        return dst;
    }

    /**
     * Makes a scale matrix
     * @param {number} sx x scale.
     * @param {number} sy y scale.
     * @param {number} sz z scale.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static scaling(sx: number, sy: number, sz: number): Matrix4 {
        const dst = new Matrix4();

        dst.elements[0] = sx;
        dst.elements[1] = 0;
        dst.elements[2] = 0;
        dst.elements[3] = 0;
        dst.elements[4] = 0;
        dst.elements[5] = sy;
        dst.elements[6] = 0;
        dst.elements[7] = 0;
        dst.elements[8] = 0;
        dst.elements[9] = 0;
        dst.elements[10] = sz;
        dst.elements[11] = 0;
        dst.elements[12] = 0;
        dst.elements[13] = 0;
        dst.elements[14] = 0;
        dst.elements[15] = 1;

        return dst;
    }

    /**
     * Multiply by a scaling matrix
     * @param {Matrix4} m matrix to multiply
     * @param {number} sx x scale.
     * @param {number} sy y scale.
     * @param {number} sz z scale.
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static scale(m: Matrix4, sx: number, sy: number, sz: number): Matrix4 {
        // This is the optimized version of
        // return multiply(m, scaling(sx, sy, sz));
        const dst = new Matrix4();

        dst.elements[0] = sx * m.elements[0 * 4 + 0];
        dst.elements[1] = sx * m.elements[0 * 4 + 1];
        dst.elements[2] = sx * m.elements[0 * 4 + 2];
        dst.elements[3] = sx * m.elements[0 * 4 + 3];
        dst.elements[4] = sy * m.elements[1 * 4 + 0];
        dst.elements[5] = sy * m.elements[1 * 4 + 1];
        dst.elements[6] = sy * m.elements[1 * 4 + 2];
        dst.elements[7] = sy * m.elements[1 * 4 + 3];
        dst.elements[8] = sz * m.elements[2 * 4 + 0];
        dst.elements[9] = sz * m.elements[2 * 4 + 1];
        dst.elements[10] = sz * m.elements[2 * 4 + 2];
        dst.elements[11] = sz * m.elements[2 * 4 + 3];

        if (!m.equals(dst)) {
            dst.elements[12] = m.elements[12];
            dst.elements[13] = m.elements[13];
            dst.elements[14] = m.elements[14];
            dst.elements[15] = m.elements[15];
        }

        return dst;
    }

    /**
     * creates a matrix from translation, quaternion, scale
     * @param {Number[]} translation [x, y, z] translation
     * @param {Number[]} quaternion [x, y, z, z] quaternion rotation
     * @param {Number[]} scale [x, y, z] scale
     * @return {Matrix4} dst or a new matrix if none provided
     */
    static compose(translation: Vector3, quaternion: Vector4, scale: Vector3): Matrix4 {
        const dst = new Matrix4();

        const x = quaternion[0];
        const y = quaternion[1];
        const z = quaternion[2];
        const w = quaternion[3];

        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;

        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;

        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        const sx = scale[0];
        const sy = scale[1];
        const sz = scale[2];

        dst.elements[0] = (1 - (yy + zz)) * sx;
        dst.elements[1] = (xy + wz) * sx;
        dst.elements[2] = (xz - wy) * sx;
        dst.elements[3] = 0;

        dst.elements[4] = (xy - wz) * sy;
        dst.elements[5] = (1 - (xx + zz)) * sy;
        dst.elements[6] = (yz + wx) * sy;
        dst.elements[7] = 0;

        dst.elements[8] = (xz + wy) * sz;
        dst.elements[9] = (yz - wx) * sz;
        dst.elements[10] = (1 - (xx + yy)) * sz;
        dst.elements[11] = 0;

        dst.elements[12] = translation[0];
        dst.elements[13] = translation[1];
        dst.elements[14] = translation[2];
        dst.elements[15] = 1;

        return dst;
    }

    static quatFromRotationMatrix(m: Matrix4) {
        const dst = [0, 0, 0, 0] as Vector4;
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        const m11 = m.elements[0];
        const m12 = m.elements[4];
        const m13 = m.elements[8];
        const m21 = m.elements[1];
        const m22 = m.elements[5];
        const m23 = m.elements[9];
        const m31 = m.elements[2];
        const m32 = m.elements[6];
        const m33 = m.elements[10];

        const trace = m11 + m22 + m33;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1);
            dst[3] = 0.25 / s;
            dst[0] = (m32 - m23) * s;
            dst[1] = (m13 - m31) * s;
            dst[2] = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
            dst[3] = (m32 - m23) / s;
            dst[0] = 0.25 * s;
            dst[1] = (m12 + m21) / s;
            dst[2] = (m13 + m31) / s;
        } else if (m22 > m33) {
            const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
            dst[3] = (m13 - m31) / s;
            dst[0] = (m12 + m21) / s;
            dst[1] = 0.25 * s;
            dst[2] = (m23 + m32) / s;
        } else {
            const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
            dst[3] = (m21 - m12) / s;
            dst[0] = (m13 + m31) / s;
            dst[1] = (m23 + m32) / s;
            dst[2] = 0.25 * s;
        }
        return dst;
    }

    static decompose(mat: Matrix4) {
        let sx = Matrix4.len(mat.elements.slice(0, 3) as Vector3);
        const sy = Matrix4.len(mat.elements.slice(4, 7) as Vector3);
        const sz = Matrix4.len(mat.elements.slice(8, 11) as Vector3);

        // if determinate is negative, we need to invert one scale
        const det = Matrix4.determinate(mat);
        if (det < 0) {
            sx = -sx;
        }

        const translation = [0, 0, 0];

        translation[0] = mat.elements[12];
        translation[1] = mat.elements[13];
        translation[2] = mat.elements[14];

        // scale the rotation part
        const matrix = mat.clone();

        const invSX = 1 / sx;
        const invSY = 1 / sy;
        const invSZ = 1 / sz;

        matrix.elements[0] *= invSX;
        matrix.elements[1] *= invSX;
        matrix.elements[2] *= invSX;

        matrix.elements[4] *= invSY;
        matrix.elements[5] *= invSY;
        matrix.elements[6] *= invSY;

        matrix.elements[8] *= invSZ;
        matrix.elements[9] *= invSZ;
        matrix.elements[10] *= invSZ;

        const quaternion = Matrix4.quatFromRotationMatrix(matrix);

        const scale = [0, 0, 0] as Vector3;

        scale[0] = sx;
        scale[1] = sy;
        scale[2] = sz;

        return [translation, quaternion, scale];
    }

    static determinate(m: Matrix4) {
        const m00 = m.elements[0 * 4 + 0];
        const m01 = m.elements[0 * 4 + 1];
        const m02 = m.elements[0 * 4 + 2];
        const m03 = m.elements[0 * 4 + 3];
        const m10 = m.elements[1 * 4 + 0];
        const m11 = m.elements[1 * 4 + 1];
        const m12 = m.elements[1 * 4 + 2];
        const m13 = m.elements[1 * 4 + 3];
        const m20 = m.elements[2 * 4 + 0];
        const m21 = m.elements[2 * 4 + 1];
        const m22 = m.elements[2 * 4 + 2];
        const m23 = m.elements[2 * 4 + 3];
        const m30 = m.elements[3 * 4 + 0];
        const m31 = m.elements[3 * 4 + 1];
        const m32 = m.elements[3 * 4 + 2];
        const m33 = m.elements[3 * 4 + 3];
        const tmp_0 = m22 * m33;
        const tmp_1 = m32 * m23;
        const tmp_2 = m12 * m33;
        const tmp_3 = m32 * m13;
        const tmp_4 = m12 * m23;
        const tmp_5 = m22 * m13;
        const tmp_6 = m02 * m33;
        const tmp_7 = m32 * m03;
        const tmp_8 = m02 * m23;
        const tmp_9 = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        return 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    }

    /**
     * Computes the inverse of a matrix.
     * @param {Matrix4} m matrix to compute inverse of
     * @param {Matrix4} [dst] optional matrix to store result
     * @return {Matrix4} dst or a new matrix if none provided
     * @memberOf module:webgl-3d-math
     */
    static inverse(m: Matrix4): Matrix4 {
        const dst = new Matrix4();
        const m00 = m.elements[0 * 4 + 0];
        const m01 = m.elements[0 * 4 + 1];
        const m02 = m.elements[0 * 4 + 2];
        const m03 = m.elements[0 * 4 + 3];
        const m10 = m.elements[1 * 4 + 0];
        const m11 = m.elements[1 * 4 + 1];
        const m12 = m.elements[1 * 4 + 2];
        const m13 = m.elements[1 * 4 + 3];
        const m20 = m.elements[2 * 4 + 0];
        const m21 = m.elements[2 * 4 + 1];
        const m22 = m.elements[2 * 4 + 2];
        const m23 = m.elements[2 * 4 + 3];
        const m30 = m.elements[3 * 4 + 0];
        const m31 = m.elements[3 * 4 + 1];
        const m32 = m.elements[3 * 4 + 2];
        const m33 = m.elements[3 * 4 + 3];
        const tmp_0 = m22 * m33;
        const tmp_1 = m32 * m23;
        const tmp_2 = m12 * m33;
        const tmp_3 = m32 * m13;
        const tmp_4 = m12 * m23;
        const tmp_5 = m22 * m13;
        const tmp_6 = m02 * m33;
        const tmp_7 = m32 * m03;
        const tmp_8 = m02 * m23;
        const tmp_9 = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;

        const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        dst.elements[0] = d * t0;
        dst.elements[1] = d * t1;
        dst.elements[2] = d * t2;
        dst.elements[3] = d * t3;
        dst.elements[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
        dst.elements[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
        dst.elements[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
        dst.elements[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
        dst.elements[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
        dst.elements[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
        dst.elements[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
        dst.elements[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
        dst.elements[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
        dst.elements[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
        dst.elements[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
        dst.elements[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

        return dst;
    }

    /**
     * Takes a  matrix and a vector with 4 entries, transforms that vector by
     * the matrix, and returns the result as a vector with 4 entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector4} v The point in homogenous coordinates.
     * @param {Vector4} dst optional vector4 to store result
     * @return {Vector4} dst or new Vector4 if not provided
     * @memberOf module:webgl-3d-math
     */
    static transformVector(m: Matrix4, v: Vector4): Vector4 {
        const dst = [0, 0, 0, 1] as Vector4;
        for (let i = 0; i < 4; ++i) {
            dst[i] = 0.0;
            for (let j = 0; j < 4; ++j) {
                dst[i] += v[j] * m.elements[j * 4 + i];
            }
        }
        return dst;
    }

    /**
     * Takes a 4-by-4 matrix and a vector with 3 entries,
     * interprets the vector as a point, transforms that point by the matrix, and
     * returns the result as a vector with 3 entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector3} v The point.
     * @param {Vector4} dst optional vector4 to store result
     * @return {Vector4} dst or new Vector4 if not provided
     * @memberOf module:webgl-3d-math
     */
    static transformPoint(m: Matrix4, v: Vector3): Vector4 {
        const dst = [0, 0, 0, 1] as Vector4;
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];
        const d = v0 * m.elements[0 * 4 + 3] + v1 * m.elements[1 * 4 + 3] + v2 * m.elements[2 * 4 + 3] + m.elements[3 * 4 + 3];

        dst[0] = (v0 * m.elements[0 * 4 + 0] + v1 * m.elements[1 * 4 + 0] + v2 * m.elements[2 * 4 + 0] + m.elements[3 * 4 + 0]) / d;
        dst[1] = (v0 * m.elements[0 * 4 + 1] + v1 * m.elements[1 * 4 + 1] + v2 * m.elements[2 * 4 + 1] + m.elements[3 * 4 + 1]) / d;
        dst[2] = (v0 * m.elements[0 * 4 + 2] + v1 * m.elements[1 * 4 + 2] + v2 * m.elements[2 * 4 + 2] + m.elements[3 * 4 + 2]) / d;

        return dst;
    }

    /**
     * Takes a 4-by-4 matrix and a vector with 3 entries, interprets the vector as a
     * direction, transforms that direction by the matrix, and returns the result;
     * assumes the transformation of 3-dimensional space represented by the matrix
     * is parallel-preserving, i.e. any combination of rotation, scaling and
     * translation, but not a perspective distortion. Returns a vector with 3
     * entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector3} v The direction.
     * @param {Vector4} dst optional vector4 to store result
     * @return {Vector4} dst or new Vector4 if not provided
     * @memberOf module:webgl-3d-math
     */
    static transformDirection(m: Matrix4, v: Vector3): Vector4 {
        const dst = [0, 0, 0, 1] as Vector4;

        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];

        dst[0] = v0 * m.elements[0 * 4 + 0] + v1 * m.elements[1 * 4 + 0] + v2 * m.elements[2 * 4 + 0];
        dst[1] = v0 * m.elements[0 * 4 + 1] + v1 * m.elements[1 * 4 + 1] + v2 * m.elements[2 * 4 + 1];
        dst[2] = v0 * m.elements[0 * 4 + 2] + v1 * m.elements[1 * 4 + 2] + v2 * m.elements[2 * 4 + 2];

        return dst;
    }

    /**
     * Takes a 4-by-4 matrix m and a vector v with 3 entries, interprets the vector
     * as a normal to a surface, and computes a vector which is normal upon
     * transforming that surface by the matrix. The effect of this static is the
     * same as transforming v (as a direction) by the inverse-transpose of m.  This
     * static assumes the transformation of 3-dimensional space represented by the
     * matrix is parallel-preserving, i.e. any combination of rotation, scaling and
     * translation, but not a perspective distortion.  Returns a vector with 3
     * entries.
     * @param {Matrix4} m The matrix.
     * @param {Vector3} v The normal.
     * @param {Vector3} [dst] The direction.
     * @return {Vector3} The transformed direction.
     * @memberOf module:webgl-3d-math
     */
    static transformNormal(m: Matrix4, v: Vector3): Vector3 {
        const dst = [0, 0, 0] as Vector3;
        const mi = Matrix4.inverse(m);
        const v0 = v[0];
        const v1 = v[1];
        const v2 = v[2];

        dst[0] = v0 * mi.elements[0 * 4 + 0] + v1 * mi.elements[0 * 4 + 1] + v2 * mi.elements[0 * 4 + 2];
        dst[1] = v0 * mi.elements[1 * 4 + 0] + v1 * mi.elements[1 * 4 + 1] + v2 * mi.elements[1 * 4 + 2];
        dst[2] = v0 * mi.elements[2 * 4 + 0] + v1 * mi.elements[2 * 4 + 1] + v2 * mi.elements[2 * 4 + 2];

        return dst;
    }
}

export {
    Matrix4, 
    Vector3, 
    Vector4
}
