#version 300 es

precision highp float;

in vec2 flowUV;

uniform sampler2D deathListTexture;
uniform sampler2D flowTexture;
uniform sampler2D particleTexture;

uniform vec2 poolBlockNum;
uniform vec2 flowRes;
uniform vec2 flowMin;
uniform vec2 flowMax;
uniform float randomSeed;
uniform float speedFactor;
uniform float dropRate;
uniform float dropRateBump;
uniform float rebirthCountdown;

out vec4 FragColor;

// pseudo-random generator
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

// flow speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
vec2 lookup_speed(const vec2 uv) {
    //     return texture(flowTexture, uv).rg; // lower-res hardware filtering

    vec2 px = 1.0 / flowRes;
    vec2 vc = (floor(uv * flowRes)) * px;
    vec2 f = fract(uv * flowRes);

    vec2 tl = texture(flowTexture, vc).rg;
    vec2 tr = texture(flowTexture, vc + vec2(px.x, 0)).rg;
    vec2 bl = texture(flowTexture, vc + vec2(0, px.y)).rg;
    vec2 br = texture(flowTexture, vc + px).rg;
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}

// float blockWidth = 1.0 / rebirthCountdown;
vec2 map_to_01_from(vec2 uv)
{
    // float u = (uv.x - (rebirthCountdown - 1.0) * blockWidth)
    float u = (uv.x - (rebirthCountdown - 1.0) / rebirthCountdown) * rebirthCountdown;

    return vec2(u, uv.y);
}

vec2 map_to_blockUV_from(vec2 uv)
{
    // float lastBlockBaseU = (rebirthCountdown - 1.0) * blockWidth)
    float lastBlockBaseU = (rebirthCountdown - 1.0) / rebirthCountdown;

    return vec2(lastBlockBaseU + uv.x / rebirthCountdown, uv.y);
}

vec2 map_to_head_blockUV_from(vec2 uv)
{
    return uv / poolBlockNum;
}



void main() {
    vec4 posColor = texture(particleTexture, map_to_blockUV_from(flowUV));

    // vec2 particlePos = vec2(posColor.r + posColor.b / 255.0, posColor.g + posColor.a / 255.0);
    vec2 particlePos = vec2(posColor.r + posColor.b / 255.0, posColor.g + posColor.a / 255.0);

    vec2 velocity = mix(flowMin, flowMax, lookup_speed(particlePos).rg);
    // velocity = mix(flowMin, flowMax, vec2(.3,.3));
    float speed_t = length(velocity) / length(flowMax);

    // take EPSG:4236 distortion into account for calculating where the particle moved
    float distortion = cos(radians(particlePos.y * 180.0 - 90.0));
    // vec2 offset = vec2(velocity.x / distortion, velocity.y) * 0.0001 * speedFactor;
    vec2 offset = vec2(velocity.x , velocity.y) * 0.0001 * speedFactor;

    // a random seed to use for the particle drop
    vec2 seed = (particlePos + flowUV) * randomSeed;

    vec2 randomPos = vec2(rand(seed + 1.3), rand(seed + 2.1));

    // update particle position
    float countdown = texture(deathListTexture, flowUV).r * 255.0;
    if (countdown == rebirthCountdown) // rebirth
        particlePos = randomPos;
    else if (countdown < rebirthCountdown) // prepare to show
        particlePos = particlePos;
    else // simulation
        particlePos = clamp(particlePos + offset,  vec2(0.0), vec2(1.0));

    FragColor = vec4(floor(particlePos * 255.0) / 255.0, fract(particlePos * 255.0));
}


