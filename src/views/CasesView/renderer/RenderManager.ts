/* eslint-disable */
import { Matrix3 } from "../math/m3";
import { Matrix4 } from "../math/m4";

type Vector2 = [number, number];
type Vector3 = [number, number, number];
type Vector4 = [number, number, number, number]

/**
 * Abstract Class 4 render tools management
 */
class RManager<T> {
    //** objetc dict : [key-name]: object */
    // eslint-disable-next-line
    public cMap: { [key: string]: T };
    public idMap: string[];
    public num: number;
    public glCtx: WebGL2RenderingContext;

    public constructor(gl: WebGL2RenderingContext) {
        this.cMap = {};
        this.idMap = [];
        this.num = -1;
        this.glCtx = gl;
    }

    protected CheckExist(name: string) {
        if (name in this.cMap) {
            return true;
        }
        return false;
    }

    protected CheckOutName(progId: string | number) {
        let progName = '';
        if (typeof (progId) === "number") {
            if (progId > this.num) {
                throw console.error('Program ID input exceeds maximum! Please double check!');
            }
            progName = this.idMap[progId];
        }
        else {
            if (!this.CheckExist(progId)) {
                throw console.error("Program Name doesn't exist. Please double Check!!");
            }
            progName = progId;
        }
        return progName;
    }

    public add(name: string, component: T) {
        if (this.CheckExist(name)) {
            throw console.error('Name already exist in content map, Please Change!');
        }
        this.cMap[name] = component;
        this.num += 1;
        this.idMap.push(name);
    }
}

/**
 * webgl2 program manager
 */
class ProgManager extends RManager<WebGLProgram> {
    /**
     * init webgl2 program manager
     * @param gl current render context
     */
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
    }

    public AddMulti(vsDic: { [key: string]: string }, fsDic: { [key: string]: string }, names: string[]) {
        for (const name of names) {
            const aProg = this.CreateProg(vsDic[name], fsDic[name]);
            this.add(name, aProg);
        }
    }

    private CreateShader(type: number, source: string) {
        const shader = this.glCtx.createShader(type) as WebGLShader;
        this.glCtx.shaderSource(shader, source);
        this.glCtx.compileShader(shader);
        const success = this.glCtx.getShaderParameter(shader, this.glCtx.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.log(source);
        console.log(this.glCtx.getShaderInfoLog(shader));
        this.glCtx.deleteShader(shader);
        return null;
    }

    private CreateProg(vertSource: string, fragSource: string) {
        const prog = this.glCtx.createProgram() as WebGLProgram;
        const vs = this.CreateShader(this.glCtx.VERTEX_SHADER, vertSource);
        const fs = this.CreateShader(this.glCtx.FRAGMENT_SHADER, fragSource);
        if (vs == null || fs == null) {
            throw console.error('Shader Create Failed! Please Check!');
        }
        this.glCtx.attachShader(prog, vs);
        this.glCtx.attachShader(prog, fs);
        this.glCtx.linkProgram(prog);
        const success = this.glCtx.getProgramParameter(prog, this.glCtx.LINK_STATUS);
        if (!success) {
            console.log(this.glCtx.getProgramInfoLog(prog));
            this.glCtx.deleteProgram(prog);
            throw console.error('Program Create Failed! Please Check!');
        }
        this.glCtx.deleteShader(vs);
        this.glCtx.deleteShader(fs);
        return prog;
    }

    public Use(progId: string | number) {
        const progName = this.CheckOutName(progId);
        this.glCtx.useProgram(this.cMap[progName]);
    }

    public SetInt(progId: string | number, intName: string, val: number) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniform1i(this.glCtx.getUniformLocation(prog, intName), val);
    }

    public SetInts(progId: string | number, intDic: { [key: string]: number }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in intDic) {
            this.glCtx.uniform1i(this.glCtx.getUniformLocation(prog, key), intDic[key]);
        }
    }

    public SetFloat(progId: string | number, fName: string, val: number) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniform1f(this.glCtx.getUniformLocation(prog, fName), val);
    }

    public SetFloats(progId: string | number, fDic: { [key: string]: number }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in fDic) {
            this.glCtx.uniform1f(this.glCtx.getUniformLocation(prog, key), fDic[key]);
        }
    }

    public SetVec2(progId: string | number, vecName: string, val: Vector2) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniform2fv(this.glCtx.getUniformLocation(prog, vecName), val);
    }

    public SetVec2s(progId: string | number, vecDic: { [key: string]: Vector2 }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in vecDic) {
            this.glCtx.uniform2fv(this.glCtx.getUniformLocation(prog, key), vecDic[key]);
        }
    }

    public SetVec3(progId: string | number, vecName: string, val: Vector3) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniform3fv(this.glCtx.getUniformLocation(prog, vecName), val);
    }

    public SetVec3s(progId: string | number, vecDic: { [key: string]: Vector3 }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in vecDic) {
            this.glCtx.uniform3fv(this.glCtx.getUniformLocation(prog, key), vecDic[key]);
        }
    }

    public SetVec4(progId: string | number, vecName: string, val: Vector4) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniform4fv(this.glCtx.getUniformLocation(prog, vecName), val);
    }

    public SetVec4s(progId: string | number, vecDic: { [key: string]: Vector4 }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in vecDic) {
            this.glCtx.uniform4fv(this.glCtx.getUniformLocation(prog, key), vecDic[key]);
        }
    }

    public SetMat3(progId: string | number, vecName: string, val: Matrix3) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniformMatrix3fv(this.glCtx.getUniformLocation(prog, vecName), false, val.toArray());
    }

    public SetMat3s(progId: string | number, vecDic: { [key: string]: Matrix3 }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in vecDic) {
            this.glCtx.uniformMatrix3fv(this.glCtx.getUniformLocation(prog, key), false, vecDic[key].toArray());
        }
    }

    public SetMat4(progId: string | number, vecName: string, val: Matrix4) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        this.glCtx.uniformMatrix4fv(this.glCtx.getUniformLocation(prog, vecName), false, val.toArray());
    }

    public SetMat4s(progId: string | number, vecDic: { [key: string]: Matrix4 }) {
        const progName = this.CheckOutName(progId);
        const prog = this.cMap[progName];
        for (const key in vecDic) {
            this.glCtx.uniformMatrix4fv(this.glCtx.getUniformLocation(prog, key), false, vecDic[key].toArray());
        }
    }

}

/**
 * Render Texture manager
 */
class TexManager extends RManager<WebGLTexture> {
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
    }

    private CreateTex(textWidth: number, texHeight: number, texData: Array<number>, internalFormat: number, colorFormat: number, type: number) {
        const texture = this.glCtx.createTexture();
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, texture);

        this.glCtx.pixelStorei(this.glCtx.UNPACK_ALIGNMENT, 1);

        this.glCtx.texImage2D(this.glCtx.TEXTURE_2D, 0, internalFormat, textWidth, texHeight, 0, colorFormat, type, new Uint8Array(texData));
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MIN_FILTER, this.glCtx.NEAREST);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MAG_FILTER, this.glCtx.NEAREST);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_WRAP_S, this.glCtx.CLAMP_TO_EDGE);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_WRAP_T, this.glCtx.CLAMP_TO_EDGE);
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, null);
        return texture;
    }

    private CreateEmptyTex(texWidth: number, texHeight: number, internalFormat: number, colorFormat: number, type: number) {
        const tex = this.glCtx.createTexture();
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, tex);
        this.glCtx.pixelStorei(this.glCtx.UNPACK_ALIGNMENT, 1);
        this.glCtx.texImage2D(this.glCtx.TEXTURE_2D, 0, internalFormat, texWidth, texHeight, 0, colorFormat, type, null);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MIN_FILTER, this.glCtx.NEAREST);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MAG_FILTER, this.glCtx.NEAREST);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_WRAP_S, this.glCtx.CLAMP_TO_EDGE);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_WRAP_T, this.glCtx.CLAMP_TO_EDGE);
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, null);
        return tex;
    }

    public AddDataTex(names: string[], width: number, height: number, data: Array<number>, internalFormat: number, colorFormat: number, type: number) {
        for (const name of names) {
            const tex = this.CreateTex(width, height, data, internalFormat, colorFormat, type) as WebGLTexture;
            this.add(name, tex);
        }
    }

    public AddEmptyTex(names: string[], texWidth: number, texHeight: number, internalFormat: number, colorFormat: number, type: number) {
        for (const name of names) {
            const tex = this.CreateEmptyTex(texWidth, texHeight, internalFormat, colorFormat, type) as WebGLTexture;
            this.add(name, tex);
        }
    }

    private CreateImgTex(img: HTMLImageElement) {
        const texture = this.glCtx.createTexture();

        // this.glCtx.activeTexture(this.glCtx.TEXTURE0 + texIndex);
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, texture);
        this.glCtx.pixelStorei(this.glCtx.UNPACK_FLIP_Y_WEBGL, true);
        this.glCtx.texImage2D(this.glCtx.TEXTURE_2D, 0, this.glCtx.RGBA8, this.glCtx.RGBA, this.glCtx.UNSIGNED_BYTE, img);
        this.glCtx.pixelStorei(this.glCtx.UNPACK_FLIP_Y_WEBGL, false);
        // this.glCtx.generateMipmap(this.glCtx.TEXTURE_2D);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_WRAP_S, this.glCtx.CLAMP_TO_EDGE);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_WRAP_T, this.glCtx.CLAMP_TO_EDGE);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MIN_FILTER, this.glCtx.NEAREST);
        this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MAG_FILTER, this.glCtx.NEAREST);
        console.log('texture image ready');
        return texture;
    }

    public AddImageTex(img: HTMLImageElement, name: string) {
        if (this.CheckExist(name)) {
            throw console.error("Texture name already existed! Please double check!");
        }
        const tex = this.CreateImgTex(img) as WebGLTexture;
        this.add(name, tex);
    }

    public BindTex(texId: string | number) {
        const texName = this.CheckOutName(texId);
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, this.cMap[texName]);
    }

    public UnbindTex() {
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, null);
    }

    public ActiveBindTex(tex: string | number, texId: number) {
        const texName = this.CheckOutName(tex);
        this.glCtx.activeTexture(this.glCtx.TEXTURE0 + texId);
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, this.cMap[texName]);
    }

    public SwapTex(idA: string | number, idB: string | number) {
        const nameA = this.CheckOutName(idA);
        const nameB = this.CheckOutName(idB);

        const temp = this.cMap[nameA];
        this.cMap[nameA] = this.cMap[nameB];
        this.cMap[nameB] = temp;
    }

    public GetTex(texId: string | number) {
        const texName = this.CheckOutName(texId);
        return this.cMap[texName];
    }

}

/**
 * Render FrameBuffer manager
 */
class FrameManager extends RManager<WebGLFramebuffer> {
    constructor(gl: WebGL2RenderingContext) {
        super(gl);
    }

    private CreateFB() {
        const fb = this.glCtx.createFramebuffer();
        this.glCtx.bindFramebuffer(this.glCtx.FRAMEBUFFER, fb);
        if (fb == null) {
            throw new Error("FrameBuffer generate failed!")
        }
        return fb;
    }

    public AddFb(name: string) {
        if (this.CheckExist(name)) {
            throw console.error("FrameBuffer name already existed! Please double check!");
        }
        const fb = this.CreateFB();
        this.add(name, fb);
    }

    private CreateFbWithTex(texture: WebGLTexture | null, attachIndex: number) {
        const fb = this.glCtx.createFramebuffer();
        this.glCtx.bindFramebuffer(this.glCtx.FRAMEBUFFER, fb);
        const attachPt = this.glCtx.COLOR_ATTACHMENT0 + attachIndex;
        this.glCtx.framebufferTexture2D(this.glCtx.FRAMEBUFFER, attachPt, this.glCtx.TEXTURE_2D, texture, 0);
        if (fb == null) {
            throw new Error("FrameBuffer generate failed!")
        }
        return fb;
    }

    public AddFbWithTex(texture: WebGLTexture | null, attachIndex: number, name: string) {
        if (this.CheckExist(name)) {
            throw console.error("FrameBuffer name already existed! Please double check!");
        }
        const fb = this.CreateFbWithTex(texture, attachIndex);
        this.add(name, fb);
    }

    private CreateFbMSAA(attachId: number, sampleNum: number, internalFormat: number, width: number, height: number) {
        const renderFb = this.glCtx.createFramebuffer();
        const colorRb = this.glCtx.createRenderbuffer();
        this.glCtx.bindRenderbuffer(this.glCtx.RENDERBUFFER, colorRb);
        this.glCtx.renderbufferStorageMultisample(this.glCtx.RENDERBUFFER, sampleNum, internalFormat, width, height);

        this.glCtx.bindFramebuffer(this.glCtx.FRAMEBUFFER, renderFb);
        this.glCtx.framebufferRenderbuffer(this.glCtx.FRAMEBUFFER, this.glCtx.COLOR_ATTACHMENT0 + attachId, this.glCtx.RENDERBUFFER, colorRb);
        // this.AttachDepthRb(width, height);
        this.glCtx.bindFramebuffer(this.glCtx.FRAMEBUFFER, null);

        if (renderFb == null) {
            throw new Error("FrameBuffer generate failed!")
        }
        return renderFb;
    }

    public AddFbMSAA(attachId: number, sampleNum: number, internalFormat: number, size: [number, number], name: string) {
        if (this.CheckExist(name)) {
            throw console.error("FrameBuffer name already existed! Please double check!");
        }
        const fb = this.CreateFbMSAA(attachId, sampleNum, internalFormat, size[0], size[1]);
        this.add(name, fb);
    }

    private BindFb(fb: WebGLFramebuffer | null, tex: WebGLTexture | null = null, attachId = 0) {
        this.glCtx.bindFramebuffer(this.glCtx.FRAMEBUFFER, fb);
        if (tex != null) {
            this.glCtx.framebufferTexture2D(this.glCtx.FRAMEBUFFER, this.glCtx.COLOR_ATTACHMENT0 + attachId, this.glCtx.TEXTURE_2D, tex, 0);
        }
    }

    public BindFrame(frameId: string | number, tex: WebGLTexture | null = null, attachId = 0) {
        const fbName = this.CheckOutName(frameId);
        const fb = this.cMap[fbName];
        this.BindFb(fb, tex, attachId);
    }

    public BindReadFb(frameId: string | number) {
        const fbName = this.CheckOutName(frameId);
        this.glCtx.bindFramebuffer(this.glCtx.READ_FRAMEBUFFER, this.cMap[fbName]);
    }

    public BindDrawFb(frameId: string | number) {
        const fbName = this.CheckOutName(frameId);
        this.glCtx.bindFramebuffer(this.glCtx.DRAW_FRAMEBUFFER, this.cMap[fbName]);
    }

    public BindNull() {
        this.glCtx.bindFramebuffer(this.glCtx.FRAMEBUFFER, null);
    }
}

export {
    ProgManager,
    TexManager,
    FrameManager
}