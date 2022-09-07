import { CustomLayer } from './cusLayer';
import GUtils from "../renderer/gUtil";
import { ProgManager, TexManager, FrameManager } from '../renderer/RenderManager';
import mapboxgl from 'mapbox-gl';
import Matrix4, { Vector4 } from '../math/m4';

const quadVertices = [
    -1.0, -1.0, 0.0, 0.0, 
    1.0, -1.0, 1.0, 0.0, 
    -1.0, 1.0, 0.0, 1.0, 
    -1.0, 1.0, 0.0, 1.0, 
    1.0, -1.0, 1.0, 0.0, 
    1.0, 1.0, 1.0, 1.0
];

const vsURL = [
    '/YangtzeVGLab/shaders/screen_new.vert', '/YangtzeVGLab/shaders/coastline.vert', '/YangtzeVGLab/shaders/gabriel.vert', '/YangtzeVGLab/shaders/newSimulation.vert', 
    '/YangtzeVGLab/shaders/particlePoolUpdate.vert', '/YangtzeVGLab/shaders/ribbonParticle_instancedLineStrips.vert', '/YangtzeVGLab/shaders/debug.vert'
];
const fsURL = [
    '/YangtzeVGLab/shaders/screen.frag', '/YangtzeVGLab/shaders/coastline.frag', '/YangtzeVGLab/shaders/gabriel.frag', '/YangtzeVGLab/shaders/newSimulation.frag', 
    '/YangtzeVGLab/shaders/particlePoolUpdate.frag', '/YangtzeVGLab/shaders/ribbonParticle_instancedLineStrips_new.frag', '/YangtzeVGLab/shaders/debug.frag'
];

const shaderNames = ['screen', 'coastline', 'gabriel', 'simulation', 'particlePoolUpdate', 'ribbonParticleLineStrips', 'debug'];
const shaders = {screen: 0, coastline: 1, gabriel: 2, simulation: 3, particlePoolUpdate: 4, ribbonParticleLineStrips: 5, debug: 6};

const textures = {bgT1: 0, bgT2: 1, rpT5: 2, dlT1: 3, dlT2: 4, rppT1: 5, rppT2: 6, flowTex: 7};

const frames = {msaa: 0, frame: 1};


class FlowLayer extends CustomLayer {

    public pixelRate: number;
    public speedFactor = 1.15;
    public dropRate = 0.003;
    public dropRateBump = 0.01; 
    public lineNum = 6;
    public fadeOpacity = 0.7;
    public mainOpacity = 0.85;
    public particleReslution = Math.floor(2048.0 / this.lineNum);
    public bbox: [number, number, number, number]; 
    private progManager: ProgManager | null = null;
    private texManager: TexManager | null = null;
    private fbManager: FrameManager | null = null;
    private gUtil: GUtils | null = null;
    private screenVAO: WebGLVertexArrayObject | null = null;
    private map: mapboxgl.Map | null = null;
    private frameSize = [0, 0];


    constructor(
        id: string, renderingMode: '2d' | '3d',
        public flowTextureURL: string, 
        public frameMultiplier: number, 
        bbox: [number, number, number, number]
    ) {
        super(id, renderingMode);
        this.pixelRate = window.devicePixelRatio; 
        this.bbox = this.TransMercator(bbox);
        console.log('Flow layer being created...');
    }

    async onAdd(map: mapboxgl.Map, gl: WebGL2RenderingContext) {
        console.log("Custom flow field layer is being added...");
        this.map = map;
        const gUtil = new GUtils(gl);
        // flow texture
        const flowImg = await GUtils.loadImage(this.flowTextureURL);
        this.frameSize = [flowImg.width * this.frameMultiplier, flowImg.height * this.frameMultiplier]
        // shader sources dict
        const vsSrcDict = await GUtils.AxiosGetAll(vsURL, shaderNames);
        const fsSrcDict = await GUtils.AxiosGetAll(fsURL, shaderNames);

        const fbManager = new FrameManager(gl);

        const texManager = new TexManager(gl);
        // init programs
        const progManager = new ProgManager(gl);

        progManager.AddMulti(vsSrcDict, fsSrcDict, shaderNames);

        // set unifs
        progManager.Use(shaders.screen);
        progManager.SetInt(shaders.screen, 'texture1', 0);

        progManager.Use(shaders.gabriel);
        progManager.SetInts('gabriel', {"originDeathListTexture": 0, "flowTexture": 1, "particleTexture": 2});

        progManager.Use(shaders.simulation);
        progManager.SetInts(shaders.simulation, {"deathListTexture": 0, "flowTexture": 1, "particleTexture": 2});

        progManager.Use(shaders.particlePoolUpdate);
        progManager.SetInts(shaders.particlePoolUpdate, {"originParticlePoolTexture": 0, "lastNewBlockTexture": 1});

        progManager.Use(shaders.ribbonParticleLineStrips);
        progManager.SetInts(shaders.ribbonParticleLineStrips, {"particlePoolTexture": 0, "deathListTexture": 1, "flowTexture": 2});

        const screenVAO = gUtil.SetAttrib(null, 0, quadVertices, 2, gl.FLOAT, false, 4, 0);
        gUtil.SetAttrib(screenVAO, 1, quadVertices, 2, gl.FLOAT, false, 4, 2);
        gl.bindVertexArray(null);

        this.particleReslution = Math.floor(2048.0 / this.lineNum);

        const bgTexData = Array<number>(this.frameSize[0] * this.frameSize[1] * 4).fill(1.0);
        texManager.AddDataTex(['bgT1', 'bgT2'], this.frameSize[0], this.frameSize[1], bgTexData, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);

        const randomArray = Array.from({length: this.particleReslution * this.particleReslution * 4}, () => (Math.floor(Math.random() * 255)));
        texManager.AddDataTex(['rpT5'], this.particleReslution, this.particleReslution, randomArray, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);

        const allAliveList = Array<number>(this.particleReslution * this.particleReslution).fill(0);
        texManager.AddDataTex(['dlT1', 'dlT2'], this.particleReslution, this.particleReslution, allAliveList, gl.R8, gl.RED, gl.UNSIGNED_BYTE);

        texManager.AddEmptyTex(['rppT1', 'rppT2'], this.particleReslution * this.lineNum, this.particleReslution, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
        texManager.BindTex(textures.rppT1);
        for(let i = 0; i < this.lineNum; ++i) {
            gl.texSubImage2D(gl.TEXTURE_2D, 0, this.particleReslution * i, 0, this.particleReslution, this.particleReslution, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(randomArray));
        }
        texManager.BindTex(textures.rppT2);
        for(let i = 0; i < this.lineNum; ++i) {
            gl.texSubImage2D(gl.TEXTURE_2D, 0, this.particleReslution * i, 0, this.particleReslution, this.particleReslution, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(randomArray));
        }

        texManager.AddImageTex(flowImg, 'flowTex');

        const sampleNum = 4;
        fbManager.AddFbMSAA(0, sampleNum, gl.RGBA8, [this.frameSize[0], this.frameSize[1]], 'msaa');
        fbManager.AddFbWithTex(texManager.GetTex(textures.bgT1), 0, 'frame');

        this.progManager = progManager;
        this.texManager = texManager;
        this.fbManager = fbManager;
        this.screenVAO = screenVAO;
        this.gUtil = gUtil;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        map.triggerRepaint();
    }

    private TransMercator(bbox: [number, number, number, number]) {
        const min = mapboxgl.MercatorCoordinate.fromLngLat({lng: bbox[0], lat: bbox[1]});
        const max = mapboxgl.MercatorCoordinate.fromLngLat({lng: bbox[2], lat: bbox[3]});
        const res = [min.x, min.y, max.x, max.y] as Vector4;
        console.log(res); 
        return res;
    }

    render(gl: WebGL2RenderingContext, u_matrix: Array<number>): void {
        if((this.progManager == null) || (this.texManager == null)) {
            return;
        }
        if((this.fbManager == null) || (this.screenVAO == null)) {
            return;
        }
        if((this.map == null) || (this.gUtil == null)) {
            return;
        }

        const pass1 = 1;
        if(pass1) {
            // pass1 update death list
            this.gUtil.SetViewport(0, 0, this.particleReslution, this.particleReslution);
            this.fbManager.BindFrame(frames.frame, this.texManager.GetTex(textures.dlT1));
            this.gUtil.Clear([0.0, 0.0, 0.0, 1.0]);
            this.gUtil.DisableDepth();
            this.gUtil.DisableBlend();
            // gl.disable(gl.BLEND);

            this.progManager.Use('gabriel');
            this.texManager.ActiveBindTex(textures.dlT2, 0);
            this.texManager.ActiveBindTex(textures.flowTex, 1);
            this.texManager.ActiveBindTex(textures.rpT5, 2);
            this.gUtil.BindVAO(this.screenVAO);
            
            this.progManager.SetVec2s(
                'gabriel', 
                {
                    "flowRes": [this.frameSize[0] / this.frameMultiplier, this.frameSize[1] / this.frameMultiplier], 
                    "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42]
                }
            );

            this.progManager.SetFloats(
                'gabriel', 
                {
                    "randomSeed": Math.random(), "speedFactor": this.speedFactor, 
                    "dropRate": this.dropRate, "dropRateBump": this.dropRateBump, "rebirthCountdown": this.lineNum
                }
            );

            this.gUtil.DrawArrays(gl.TRIANGLES, 0, 6);
            // swap
            this.texManager.SwapTex(textures.dlT1, textures.dlT2);

            // debug(dlTexture2);
        }

        const pass2 = 1;
        if(pass2) {
            // pass 2 simulate particle -> particle positions
            this.gUtil.SetViewport(0, 0, this.particleReslution, this.particleReslution);
            this.fbManager.BindFrame(frames.frame, this.texManager.GetTex(textures.rpT5));
            this.gUtil.Clear([0.0, 0.0, 0.0, 1.0]);

            this.progManager.Use('simulation');
            this.texManager.ActiveBindTex(textures.dlT2, 0);
            this.texManager.ActiveBindTex(textures.flowTex, 1);
            this.texManager.ActiveBindTex(textures.rppT2, 2);
            this.gUtil.BindVAO(this.screenVAO);

            this.progManager.SetVec2s(
                'simulation', 
                {
                    "flowRes": [this.frameSize[0] / this.frameMultiplier, this.frameSize[1] / this.frameMultiplier], 
                    "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42]
                }
            );
            this.progManager.SetFloats(
                'simulation', 
                {
                    "randomSeed": Math.random(), "speedFactor": this.speedFactor, 
                    "dropRate": this.dropRate, "dropRateBump": this.dropRateBump, "rebirthCountdown": this.lineNum
                }
            );

            this.gUtil.DrawArrays(gl.TRIANGLES, 0, 6);

            // debug(rpTexture5);
        }

        const pass3 = 1;
        if(pass3) {
            // pass 3 update particle pool
            this.gUtil.SetViewport(0, 0, this.particleReslution * this.lineNum, this.particleReslution);
            this.fbManager.BindFrame(frames.frame, this.texManager.GetTex(textures.rppT1));
            this.gUtil.Clear([0.0, 0.0, 0.0, 1.0]);

            this.progManager.Use('particlePoolUpdate');
            this.texManager.ActiveBindTex(textures.rppT2, 0);
            this.texManager.ActiveBindTex(textures.rpT5, 1);
            this.gUtil.BindVAO(this.screenVAO);

            this.progManager.SetFloat('particlePoolUpdate', "ribbonParticleNum", this.lineNum);

            this.gUtil.DrawArrays(gl.TRIANGLES, 0, 6);
            // swap
            this.texManager.SwapTex(textures.rppT1, textures.rppT2);

            // debug(rppTexture2);
        }

        const pass4 = 1;
        if(pass4) {
            // pass 4 off-screen texture
            this.gUtil.SetViewport(0, 0, this.frameSize[0], this.frameSize[1]);
            this.fbManager.BindFrame(frames.frame, this.texManager.GetTex(textures.bgT1));
            this.fbManager.BindFrame(frames.msaa);
            this.gUtil.Clear([0.0, 0.0, 0.0, 1.0]);
            gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
            this.gUtil.EnableDepth();

            // this.progManager.Use('screen');
            // this.texManager.ActiveBindTex(textures.bgT2, 0);
            // this.gUtil.BindVAO(this.screenVAO);
            // this.progManager.SetFloat('screen', 'opacity', this.fadeOpacity);
            // this.gUtil.DrawArrays(gl.TRIANGLES, 0, 6);

            this.progManager.Use('ribbonParticleLineStrips');
            this.texManager.ActiveBindTex(textures.rppT2, 0);
            this.texManager.ActiveBindTex(textures.dlT2, 1);
            this.texManager.ActiveBindTex(textures.flowTex, 2);

            this.progManager.SetVec2s(
                'ribbonParticleLineStrips', 
                {
                    "image": [this.particleReslution, this.particleReslution], "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42], 
                    "flowRes": [this.frameSize[0] / this.frameMultiplier, this.frameSize[1] / this.frameMultiplier]
                }
            )
            this.progManager.SetFloat('ribbonParticleLineStrips', "ribbonParticleNum", this.lineNum);
 
            this.gUtil.DrawArrayInstanced(gl.LINE_STRIP, 0, Math.floor(this.lineNum), this.particleReslution * this.particleReslution);

            this.fbManager.BindReadFb(frames.msaa);
            this.fbManager.BindDrawFb(frames.frame);
            gl.blitFramebuffer(
                0, 0, this.frameSize[0], this.frameSize[1],
                0, 0, this.frameSize[0], this.frameSize[1],
                gl.COLOR_BUFFER_BIT, gl.NEAREST
            );

            this.texManager.SwapTex(textures.bgT1, textures.bgT2);

            // debug(textures.bgT2);
        }

        const pass5 = 1;
        if(pass5) {
            // pass 5 render to screen
            // this.gUtil.SetViewport(0, 0, this.frameSize[0], this.frameSize[1]);
            this.gUtil.SetViewport(0, 0, this.map.getCanvas().width, this.map.getCanvas().height);
            this.fbManager.BindNull();
            // this.gUtil.Clear([0.0, 0.0, 0.0, 0.0]);
            this.gUtil.EnableBlend();
            this.gUtil.DisableDepth();

            this.progManager.Use('screen');
            this.texManager.ActiveBindTex(textures.bgT2, 0);
            this.gUtil.BindVAO(this.screenVAO);

            const mat = new Matrix4().fromArray(u_matrix);
            this.progManager.SetFloat('screen', "opacity", this.mainOpacity);
            this.progManager.SetVec4('screen', "bbox", this.bbox);
            this.progManager.SetMat4('screen', "u_matrix", mat);
            this.gUtil.DrawArrays(gl.TRIANGLES, 0, 6);
            this.gUtil.DisableBlend();
        }

        const noMSAA = 0;
        if(noMSAA) {
            this.gUtil.SetViewport(0, 0, this.frameSize[0], this.frameSize[1]);
            this.fbManager.BindNull();
            this.gUtil.EnableBlend();
            this.gUtil.DisableDepth();
            this.progManager.Use('ribbonParticleLineStrips');
            this.texManager.ActiveBindTex(textures.rppT2, 0);
            this.texManager.ActiveBindTex(textures.dlT2, 1);
            this.texManager.ActiveBindTex(textures.flowTex, 2);

            this.progManager.SetVec2s(
                'ribbonParticleLineStrips', 
                {
                    "image": [this.particleReslution, this.particleReslution], "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42], 
                    "flowRes": [this.frameSize[0] / this.frameMultiplier, this.frameSize[1] / this.frameMultiplier]
                }
            )
            this.progManager.SetFloat('ribbonParticleLineStrips', "ribbonParticleNum", this.lineNum);

            this.gUtil.DrawArrayInstanced(gl.LINE_STRIP, 0, Math.floor(this.lineNum), this.particleReslution * this.particleReslution);

            this.texManager.SwapTex(textures.bgT1, textures.bgT2);

            this.gUtil.DisableBlend();
        }

        gl.bindVertexArray(null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        // console.log(this.map);
        (this.map as mapboxgl.Map).triggerRepaint();
    }

}

export {
    FlowLayer
}
