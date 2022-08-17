#version 300 es

precision highp float;

in vec2  texCoords;

uniform sampler2D originParticlePoolTexture;
uniform sampler2D lastNewBlockTexture;

uniform vec2 poolBlockNum;
uniform float ribbonParticleNum;

out vec4 FragColor;

// float blockWidth = 1.0 / ribbonParticleNum;
vec2 map_to_01_from(vec2 uv)
{
    float u = (uv.x - (ribbonParticleNum - 1.0) / ribbonParticleNum) * ribbonParticleNum;

    return vec2(u, uv.y);
}


void main() {

    FragColor = mix(
                    texture(originParticlePoolTexture, vec2(texCoords.x + 1.0 / ribbonParticleNum, texCoords.y)),
                    texture(lastNewBlockTexture, map_to_01_from(texCoords)),
                    step((ribbonParticleNum - 1.0) / ribbonParticleNum, texCoords.x));
                    // * blockWidth

}


