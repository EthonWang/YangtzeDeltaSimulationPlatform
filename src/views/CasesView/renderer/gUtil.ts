import axios from "axios";
import { FeatureCollection, LineString } from "geojson";

type Vector4 = [number, number, number, number];

export default class gUtils {
    public constructor(public glContext: WebGL2RenderingContext) {
    }

    public BindVAO(vao: WebGLVertexArrayObject | null) {
        this.glContext.bindVertexArray(vao);
    }

    public CreateArrBuffer() {
        const arr_buffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, arr_buffer);
    }

    public CreateBufferF32(data: number[]) {
        const buffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, buffer);
        // console.log(new Float32Array(data))
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Float32Array(data), this.glContext.STATIC_DRAW);
        // this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, null);
    }

    public CreateBufferUi8(data: number[]) {
        const buffer = this.glContext.createBuffer();
        this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, buffer);
        this.glContext.bufferData(this.glContext.ARRAY_BUFFER, new Uint8Array(data), this.glContext.STATIC_DRAW);
        // this.glContext.bindBuffer(this.glContext.ARRAY_BUFFER, null);
    }

    public SetAttrib(vao: WebGLVertexArrayObject | null, attrib_layout: number, data: number[], size: number, type: number, normalize: boolean, stride: number, offset: number) {
        if(vao == null) {
            vao = this.glContext.createVertexArray();
        }

        this.glContext.bindVertexArray(vao);

        this.glContext.enableVertexAttribArray(attrib_layout);

        this.CreateBufferF32(data);

        this.glContext.vertexAttribPointer(attrib_layout, size, type, normalize, stride * 4, offset * 4);
        // this.glContext.bindVertexArray(null);
        return vao;
    }

    static LoadImage(url: string) {
        const image = new Image();
        image.onload = () => {
            console.log('loaded: ', url);
        }
        image.src = url;
        return image;
    }

    static loadImage(url: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.src = url;
            image.onload = () => {
                resolve(image);
            }
            image.onerror = e => {
                reject(e);
            }
        })
    }

    static LoadImages(urls: string[]) {
        const imageList: HTMLImageElement[] = [];
        for(const url of urls) {
            imageList.push(gUtils.LoadImage(url));
        }
        return imageList;
    }

    public CreateTextureFromImage(image: HTMLImageElement) {
        const texture = this.glContext.createTexture();

        // this.glContext.activeTexture(this.glContext.TEXTURE0 + texIndex);
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, texture);
        
        this.glContext.texImage2D(this.glContext.TEXTURE_2D, 0, this.glContext.RGBA8, this.glContext.RGBA, this.glContext.UNSIGNED_BYTE, image);
        // this.glContext.generateMipmap(this.glContext.TEXTURE_2D);
        
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.NEAREST);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.NEAREST);
        console.log('texture image ready');
        return texture;
    }

    public CreateTexturesFromImages(images: HTMLImageElement[]) {
        console.log('create texture');
        const textures: (WebGLTexture | null)[] = [];
        for(const image of images) {
            textures.push(this.CreateTextureFromImage(image));
        }
        return textures;
    }

    public async LoadTexture(imageURL: string) {
        const texture = this.glContext.createTexture();

        // this.glContext.activeTexture(this.glContext.TEXTURE0 + texIndex);
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = this.glContext.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.glContext.RGBA;
        const srcType = this.glContext.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 255, 255, 255]);  // opaque blue
        this.glContext.texImage2D(this.glContext.TEXTURE_2D, level, internalFormat,
                        width, height, border, srcFormat, srcType, pixel);
        
        const image = new Image();
        image.src = imageURL;
        
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, texture);
        this.glContext.pixelStorei(this.glContext.UNPACK_ALIGNMENT, 1);
        this.glContext.texImage2D(this.glContext.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.LINEAR);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.LINEAR);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
        // this.glContext.generateMipmap(this.glContext.TEXTURE_2D);
        console.log('texture image ready');

        return texture;
    }

    public CreateEmptyTexture(texWidth: number, texHeight: number, internalFormat: number, colorFormat: number, type: number) {
        const tex = this.glContext.createTexture();
        // this.glContext.activeTexture(this.glContext.TEXTURE0 + texIndex);
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, tex);
        this.glContext.pixelStorei(this.glContext.UNPACK_ALIGNMENT, 1);
        this.glContext.texImage2D(this.glContext.TEXTURE_2D, 0, internalFormat, texWidth, texHeight, 0, colorFormat, type, null);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.NEAREST);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.NEAREST);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
        return tex;
    }

    public CreateTexture(textWidth: number, texHeight: number, texData: Array<number> , internalFormat: number, colorFormat:number, type: number, readone = true) {
        const texture = this.glContext.createTexture();
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, texture);

        if(readone) {
            this.glContext.pixelStorei(this.glContext.UNPACK_ALIGNMENT, 1);
        }
        else {
            this.glContext.pixelStorei(this.glContext.UNPACK_ALIGNMENT, 4);
        }

        this.glContext.texImage2D(this.glContext.TEXTURE_2D, 0, internalFormat, textWidth, texHeight, 0, colorFormat, type, new Uint8Array(texData));
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MIN_FILTER, this.glContext.NEAREST);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_MAG_FILTER, this.glContext.NEAREST);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_S, this.glContext.CLAMP_TO_EDGE);
        this.glContext.texParameteri(this.glContext.TEXTURE_2D, this.glContext.TEXTURE_WRAP_T, this.glContext.CLAMP_TO_EDGE);
        return texture;
    }

    public CreateMSAARenderBuffer(sampleNum: number, internalFormat: number, width: number, height: number) {
        const rb = this.glContext.createRenderbuffer();
        this.glContext.bindRenderbuffer(this.glContext.RENDERBUFFER, rb);
        this.glContext.renderbufferStorageMultisample(this.glContext.RENDERBUFFER, sampleNum, internalFormat, width, height);
        return rb;
    }

    public CreateFb4MSAA(emptyTex: WebGLTexture | null, attachId: number, sampleNum: number, internalFormat: number, width: number, height: number) {
        const renderFb = this.glContext.createFramebuffer();
        const colorFb = this.glContext.createFramebuffer();

        const colorRb = this.glContext.createRenderbuffer();
        this.glContext.bindRenderbuffer(this.glContext.RENDERBUFFER, colorRb);
        this.glContext.renderbufferStorageMultisample(this.glContext.RENDERBUFFER, sampleNum, internalFormat, width, height);

        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, renderFb);
        this.glContext.framebufferRenderbuffer(this.glContext.FRAMEBUFFER, this.glContext.COLOR_ATTACHMENT0 + attachId, this.glContext.RENDERBUFFER, colorRb);
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, null);

        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, colorFb);
        this.glContext.framebufferTexture2D(this.glContext.FRAMEBUFFER, this.glContext.COLOR_ATTACHMENT0 + attachId, this.glContext.TEXTURE_2D, emptyTex, 0);
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, null);

        return [renderFb, colorFb];
    }

    public CreateFbMSAA(attachId: number, sampleNum: number, internalFormat: number, width: number, height: number) {
        const renderFb = this.glContext.createFramebuffer();
        const colorRb = this.glContext.createRenderbuffer();
        this.glContext.bindRenderbuffer(this.glContext.RENDERBUFFER, colorRb);
        this.glContext.renderbufferStorageMultisample(this.glContext.RENDERBUFFER, sampleNum, internalFormat, width, height);

        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, renderFb);
        this.glContext.framebufferRenderbuffer(this.glContext.FRAMEBUFFER, this.glContext.COLOR_ATTACHMENT0 + attachId, this.glContext.RENDERBUFFER, colorRb);
        // this.AttachDepthRb(width, height);
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, null);

        return renderFb;
    }

    
    public BindReadFb(fb: WebGLFramebuffer | null) {
        this.glContext.bindFramebuffer(this.glContext.READ_FRAMEBUFFER, fb);
    }

    public BindDRAWFb(fb: WebGLFramebuffer | null) {
        this.glContext.bindFramebuffer(this.glContext.DRAW_FRAMEBUFFER, fb);
    }

    public AttachDepthRb(width: number, height: number) {
        const rbo = this.glContext.createRenderbuffer();
        this.glContext.bindRenderbuffer(this.glContext.RENDERBUFFER, rbo);
        this.glContext.renderbufferStorage(this.glContext.RENDERBUFFER, this.glContext.DEPTH24_STENCIL8, width, height);
        this.glContext.bindRenderbuffer(this.glContext.RENDERBUFFER, null);
        this.glContext.framebufferRenderbuffer(this.glContext.FRAMEBUFFER, this.glContext.DEPTH_STENCIL_ATTACHMENT, this.glContext.RENDERBUFFER, rbo);
    }

    public CreateFbWithTexDepth(tex: WebGLTexture | null, attachId: number, width: number, height: number) {
        const fb = this.CreateFb();
        this.glContext.framebufferTexture2D(this.glContext.FRAMEBUFFER, this.glContext.COLOR_ATTACHMENT0 + attachId, this.glContext.TEXTURE_2D, tex, 0);
        this.AttachDepthRb(width, height);
        this.glContext.bindRenderbuffer(this.glContext.RENDERBUFFER, null);
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, null);
        return fb;
    }

    public ActiveTexture(texId: number) {
        this.glContext.activeTexture(this.glContext.TEXTURE0 + texId);
    }

    public BindTex(tex: WebGLTexture | null) {
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, tex);
    }

    public ActiveBindTexture(texId: number, tex: WebGLTexture | null) {
        this.glContext.activeTexture(this.glContext.TEXTURE0 + texId);
        this.glContext.bindTexture(this.glContext.TEXTURE_2D, tex);
    }

    public CreateFb() {
        const fb = this.glContext.createFramebuffer();
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, fb);
        return fb;
    }

    public CreateFbWithTex(texture: WebGLTexture | null, attachIndex: number) {
        const fb = this.glContext.createFramebuffer();
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, fb);
        const attachPt = this.glContext.COLOR_ATTACHMENT0 + attachIndex;
        this.glContext.framebufferTexture2D(this.glContext.FRAMEBUFFER, attachPt, this.glContext.TEXTURE_2D, texture, 0);
        return fb;
    }

    public BindFb(fb: WebGLFramebuffer | null, tex: WebGLTexture | null = null, attachId = 0) {
        this.glContext.bindFramebuffer(this.glContext.FRAMEBUFFER, fb);
        if(tex !== null) {
            this.glContext.framebufferTexture2D(this.glContext.FRAMEBUFFER, this.glContext.COLOR_ATTACHMENT0 + attachId, this.glContext.TEXTURE_2D, tex, 0);
        }
    }

    public ResizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier = 1) {
        const width  = canvas.clientWidth  * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width ||  canvas.height !== height) {
          canvas.width  = width;
          canvas.height = height;
          this.glContext.enable(this.glContext.DEPTH_TEST);
          this.glContext.enable(this.glContext.CULL_FACE);
          return true;
        }
        this.glContext.enable(this.glContext.DEPTH_TEST);
        this.glContext.enable(this.glContext.CULL_FACE);
        return false;
    }

    public SetViewport(offsetX: number, offsetY: number, width: number, height: number) {
        this.glContext.viewport(offsetX, offsetY, width, height);
        return width / height;
    }

    public SetCanvasViewport(offsetX: number, offsetY: number) {
        this.glContext.viewport(offsetX, offsetY, this.glContext.canvas.width, this.glContext.canvas.height);
        return this.glContext.canvas.width / this.glContext.canvas.height;
    }

    public Clear(initColor: Vector4) {
        this.glContext.clearColor(...initColor);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
    }

    public EnableDepth() {
        this.glContext.enable(this.glContext.DEPTH_TEST);
    }

    public DisableDepth() {
        this.glContext.disable(this.glContext.DEPTH_TEST);
    }

    public EnableBlend() {
        this.glContext.enable(this.glContext.BLEND);
        this.glContext.blendFunc(this.glContext.SRC_ALPHA, this.glContext.ONE_MINUS_SRC_ALPHA);
    }

    public DisableBlend() {
        this.glContext.disable(this.glContext.BLEND);
    }

    public InitContext(canvas: HTMLCanvasElement, multiplier = 1) {
        this.ResizeCanvasToDisplaySize(canvas, multiplier);
        this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
        this.glContext.enable(this.glContext.DEPTH_TEST);
        this.glContext.enable(this.glContext.CULL_FACE);
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
    }

    public DrawArrays(primitiveType: number, offset: number, count: number) {
        this.glContext.drawArrays(primitiveType, offset, count);
    }

    public DrawArrayInstanced(mode: number, first: number, count: number, instanceCount: number) {
        this.glContext.drawArraysInstanced(mode, first, count, instanceCount);
    }

    static GenerateAiosGet(urlList: string[]) {
        const list= [];
        for(const aURL of urlList) {
          list.push(axios.get(aURL));
        }
        return list;
    }
    
    static AxiosGetAll(urls: string[], shaderNames: string[]) {
        const vsSrc = axios.all(gUtils.GenerateAiosGet(urls))
                    .then(axios.spread((...res) => {
                      const srcDict: {[key: string]: string} = {};
                      let i = 0;
                      for(const item of res) {
                        srcDict[shaderNames[i]] = item.data as string;
                        // console.log(item.data);
                        i++;
                      }
                      return srcDict;
                    }));
        return vsSrc;
    }

    public static AxiosGetData<T>(url: string) {
        const resData = axios.get<T>(url)
                            .then((res) => {
                                return res.data; 
                            });
        return resData;
    }
    
    public static AssembleGeoPos(linesCollection: FeatureCollection<LineString>) {
        const lineData: number[] = [];
        const features = linesCollection.features;
        for(const feature of features) {
            const geom = feature.geometry;
            const coords = geom.coordinates;
            for(let i = 0; i < coords.length - 1; i++) {
                lineData.push((coords[i][0] + 180.0)/360.0);
                lineData.push((coords[i][1]+ 90.0)/180.0);
                lineData.push((coords[i+1][0] + 180.0)/360.0);
                lineData.push((coords[i+1][1]+ 90.0)/180.0);
            }
        }
        return lineData;
    }

    public static MaxRibbonLineLength_with_BlockResolution_(resolution: number, maxNum = 2048.0)
    {
        return Math.floor(maxNum / resolution);
    }
    public static MaxBlockResolution_with_RibbonLineLength_(length: number, maxNum = 2048.0)
    {
        return Math.floor(maxNum / length);
    }
}