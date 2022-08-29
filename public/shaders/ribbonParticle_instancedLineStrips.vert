#version 300 es

precision highp float;

uniform sampler2D particlePoolTexture;
uniform sampler2D deathListTexture;

uniform vec2 poolBlockNum;
uniform vec2 image;
uniform float ribbonParticleNum;

out vec2  flowUV;

void main()
{
    float blockWidth = 1.0 / ribbonParticleNum; 
    float index = float(gl_InstanceID);
    float u = fract((index + 0.5) / image.x);
    float v = floor((index + 0.5) / image.x) / image.y;

    int currentRibbonIndex = int(gl_VertexID) % int(ribbonParticleNum);

    // * blockWidth
    vec2 currentBlockBaseUV = vec2(float(currentRibbonIndex) / ribbonParticleNum, 0.0);

    // * blockWidth
    vec4 currentPosColor = texture(particlePoolTexture, vec2(u / ribbonParticleNum, v) + currentBlockBaseUV);

    vec2 particlePos = vec2(currentPosColor.r + currentPosColor.b / 255.0, currentPosColor.g + currentPosColor.a / 255.0);
    flowUV = particlePos;
    particlePos = particlePos * 2.0 - 1.0;

    float visibility = mix(10000.0f, -0.1f, step(ribbonParticleNum + 0.5, texture(deathListTexture, vec2(u, v)).r * 255.0));

    gl_Position = vec4(particlePos, visibility, 1.0f);
}