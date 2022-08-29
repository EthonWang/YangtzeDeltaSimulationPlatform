import GUtils from "./gUtil";
import { ProgManager, TexManager } from './RenderManager';

type FlowParams = {
    pixelRate: number, 
    speedFactor: number, 
    dropRate: number, 
    fadeOpacity: number, 
    mainOpacity: number, 
    dropRateBump: number, 
    lineNum: number, 
    canvasEle: HTMLCanvasElement, 
    flowTexURL: string
}

// quad data
const quadVertices = [
    -1.0, -1.0, 0.0, 0.0,
    1.0, -1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0, 1.0,
    -1.0, 1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 0.0,
    1.0, 1.0, 1.0, 1.0
];

// TODO:文件夹如果需要更改到其他位置，需要修改此URL
// shader source request url
/* eslint-disable */
const vsURL = [
    '/shaders/screen.vert', '/shaders/coastline.vert', '/shaders/gabriel.vert', '/shaders/newSimulation.vert', 
    '/shaders/particlePoolUpdate.vert', '/shaders/ribbonParticle_instancedLineStrips.vert', '/shaders/debug.vert'
];
const fsURL = [
    '/shaders/screen.frag', '/shaders/coastline.frag', '/shaders/gabriel.frag', '/shaders/newSimulation.frag', 
    '/shaders/particlePoolUpdate.frag', '/shaders/ribbonParticle_instancedLineStrips_new.frag', '/shaders/debug.frag'
];

const shaderNames = ['screen', 'coastline', 'gabriel', 'simulation', 'particlePoolUpdate', 'ribbonParticleLineStrips', 'debug'];
const shaders = {screen: 0, coastline: 1, gabriel: 2, simulation: 3, particlePoolUpdate: 4, ribbonParticleLineStrips: 5, debug: 6};

const textures = {bgT1: 0, bgT2: 1, rpT5: 2, dlT1: 3, dlT2: 4, rppT1: 5, rppT2: 6, flowTex: 7};

async function FlowRender(flowParams: FlowParams) {
    console.log("Rendering the flow...");

    const gl = flowParams.canvasEle.getContext("webgl2") as WebGL2RenderingContext;
    const canvasWidth = flowParams.canvasEle.clientWidth;
    const canvasHeight = flowParams.canvasEle.clientHeight;

    const gUtil = new GUtils(gl);
    // flow texture
    const flowImg = await GUtils.loadImage(flowParams.flowTexURL);
    // shader sources dict
    const vsSrcDict = await GUtils.AxiosGetAll(vsURL, shaderNames);
    const fsSrcDict = await GUtils.AxiosGetAll(fsURL, shaderNames);

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

    const particleResolution = GUtils.MaxBlockResolution_with_RibbonLineLength_(flowParams.lineNum, 2048);

    // background -- store the final result to render to screen
    const bgTexData = Array<number>(canvasWidth * canvasHeight * flowParams.pixelRate * flowParams.pixelRate * 4).fill(1.0);
    texManager.AddDataTex(['bgT1', 'bgT2'], canvasWidth * flowParams.pixelRate, canvasHeight * flowParams.pixelRate, bgTexData, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);

    const randomArray = Array.from({length: particleResolution * particleResolution * 4}, () => (Math.floor(Math.random() * 255)));
    texManager.AddDataTex(['rpT5'], particleResolution, particleResolution, randomArray, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);

    const allAliveList = Array<number>(particleResolution * particleResolution).fill(0);
    texManager.AddDataTex(['dlT1', 'dlT2'], particleResolution, particleResolution, allAliveList, gl.R8, gl.RED, gl.UNSIGNED_BYTE);

    texManager.AddEmptyTex(['rppT1', 'rppT2'], particleResolution * flowParams.lineNum, particleResolution, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
    texManager.BindTex(textures.rppT1);
    for(let i = 0; i < flowParams.lineNum; ++i) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, particleResolution * i, 0, particleResolution, particleResolution, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(randomArray));
    }
    texManager.BindTex(textures.rppT2);
    for(let i = 0; i < flowParams.lineNum; ++i) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, particleResolution * i, 0, particleResolution, particleResolution, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(randomArray));
    }

    texManager.AddImageTex(flowImg, 'flowTex');

    const sampleNum = 4;
    const fbMSAA = gUtil.CreateFbMSAA(0, sampleNum, gl.RGBA8, canvasWidth * flowParams.pixelRate, canvasHeight * flowParams.pixelRate);
    const frameBuffer = gUtil.CreateFbWithTex(texManager.GetTex(textures.bgT1), 0);

    requestAnimationFrame(Loop);

    let then = 0;
    function Loop(time: number) {
        // convert to seconds
        time *= 0.001;
        // Subtract the previous time from the current time
        const deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;

        const pass1 = 1;
        if(pass1) {
            // pass1 update death list
            gUtil.SetViewport(0, 0, particleResolution, particleResolution);
            gUtil.BindFb(frameBuffer, texManager.GetTex(textures.dlT1));
            gUtil.Clear([0.0, 0.0, 0.0, 1.0]);
            gUtil.DisableDepth();

            progManager.Use('gabriel');
            texManager.ActiveBindTex(textures.dlT2, 0);
            texManager.ActiveBindTex(textures.flowTex, 1);
            texManager.ActiveBindTex(textures.rpT5, 2);
            gUtil.BindVAO(screenVAO);

            progManager.SetVec2s(
                'gabriel', 
                {"flowRes": [283, 163], "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42]}
            );
            progManager.SetFloats(
                'gabriel', 
                {
                    "randomSeed": Math.random(), "speedFactor": flowParams.speedFactor, 
                    "dropRate": flowParams.dropRate, "dropRateBump": flowParams.dropRateBump, "rebirthCountdown": flowParams.lineNum
                }
            );

            gUtil.DrawArrays(gl.TRIANGLES, 0, 6);
            // swap
            texManager.SwapTex(textures.dlT1, textures.dlT2);

            // debug(dlTexture2);
        }
        
        const pass2 = 1;
        if(pass2) {
            // pass 2 simulate particle -> particle positions
            gUtil.SetViewport(0, 0, particleResolution, particleResolution);
            gUtil.BindFb(frameBuffer, texManager.GetTex(textures.rpT5));
            gUtil.Clear([0.0, 0.0, 0.0, 1.0]);

            progManager.Use('simulation');
            texManager.ActiveBindTex(textures.dlT2, 0);
            texManager.ActiveBindTex(textures.flowTex, 1);
            texManager.ActiveBindTex(textures.rppT2, 2);
            gUtil.BindVAO(screenVAO);

            progManager.SetVec2s(
                'simulation', 
                {"flowRes": [283, 163], "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42]}
            );
            progManager.SetFloats(
                'simulation', 
                {
                    "randomSeed": Math.random(), "speedFactor": flowParams.speedFactor, 
                    "dropRate": flowParams.dropRate, "dropRateBump": flowParams.dropRateBump, "rebirthCountdown": flowParams.lineNum
                }
            );

            gUtil.DrawArrays(gl.TRIANGLES, 0, 6);

            // debug(rpTexture5);
        }

        const pass3 = 1;
        if(pass3) {
            // pass 3 update particle pool
            gUtil.SetViewport(0, 0, particleResolution * flowParams.lineNum, particleResolution);
            gUtil.BindFb(frameBuffer, texManager.GetTex(textures.rppT1));
            gUtil.Clear([0.0, 0.0, 0.0, 1.0]);

            progManager.Use('particlePoolUpdate');
            texManager.ActiveBindTex(textures.rppT2, 0);
            texManager.ActiveBindTex(textures.rpT5, 1);
            gUtil.BindVAO(screenVAO);

            progManager.SetFloat('particlePoolUpdate', "ribbonParticleNum", flowParams.lineNum);

            gUtil.DrawArrays(gl.TRIANGLES, 0, 6);
            // swap
            texManager.SwapTex(textures.rppT1, textures.rppT2);

            // debug(rppTexture2);
        }
        
        const pass4 = 1;
        if(pass4) {
            // pass 4 off-screen texture
            gUtil.SetViewport(0, 0, canvasWidth * flowParams.pixelRate, canvasHeight * flowParams.pixelRate);
            gUtil.BindFb(frameBuffer, texManager.GetTex(textures.bgT1));
            gUtil.BindFb(fbMSAA);
            gUtil.Clear([0.0, 0.0, 0.0, 1.0]);
            gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 0.0]);
            gUtil.EnableDepth();

            progManager.Use('screen');
            texManager.ActiveBindTex(textures.bgT2, 0);
            gUtil.BindVAO(screenVAO);
            progManager.SetFloat('screen', 'opacity', flowParams.fadeOpacity);
            gUtil.DrawArrays(gl.TRIANGLES, 0, 6);

            progManager.Use('ribbonParticleLineStrips');
            texManager.ActiveBindTex(textures.rppT2, 0);
            texManager.ActiveBindTex(textures.dlT2, 1);
            texManager.ActiveBindTex(textures.flowTex, 2);

            progManager.SetVec2s(
                'ribbonParticleLineStrips', 
                {"image": [particleResolution, particleResolution], "flowMin": [-21.32, -21.57], "flowMax": [26.8, 21.42], "flowRes": [283, 163]}
            )
            progManager.SetFloat('ribbonParticleLineStrips', "ribbonParticleNum", flowParams.lineNum);

            gUtil.DrawArrayInstanced(gl.LINE_STRIP, 0, Math.floor(flowParams.lineNum), particleResolution * particleResolution);

            gUtil.BindReadFb(fbMSAA);
            gUtil.BindDRAWFb(frameBuffer);
            gl.blitFramebuffer(
                0, 0, canvasWidth * flowParams.pixelRate, canvasHeight * flowParams.pixelRate,
                0, 0, canvasWidth * flowParams.pixelRate, canvasHeight * flowParams.pixelRate,
                gl.COLOR_BUFFER_BIT, gl.NEAREST
            );

            texManager.SwapTex(textures.bgT1, textures.bgT2);

            // debug(textures.bgT2);
        }
        
        const pass5 = 1;
        if(pass5) {
            // pass 5 render to screen
            gUtil.SetViewport(0, 0, canvasWidth * flowParams.pixelRate, canvasHeight * flowParams.pixelRate);
            gUtil.BindFb(null);
            gUtil.Clear([0.0, 0.0, 0.0, 0.0]);
            gUtil.EnableBlend();
            gUtil.DisableDepth();

            progManager.Use('screen');
            texManager.ActiveBindTex(textures.bgT2, 0);
            gUtil.BindVAO(screenVAO);

            progManager.SetFloat('screen', "opacity", flowParams.mainOpacity);
            gUtil.DrawArrays(gl.TRIANGLES, 0, 6);
            gUtil.DisableBlend();
        }

        requestAnimationFrame(Loop);
    }

}

export {
    FlowRender, 
    FlowParams
}