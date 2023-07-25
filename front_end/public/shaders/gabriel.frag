#version 300 es

precision highp float;

in vec2  flowUV;

uniform sampler2D originDeathListTexture;
uniform sampler2D flowTexture;
uniform sampler2D particleTexture;

uniform vec2 flowRes;
uniform vec2 flowMin;
uniform vec2 flowMax;
uniform float randomSeed;
uniform float speedFactor;
uniform float dropRate;
uniform float dropRateBump;
uniform float rebirthCountdown;

out float FragColor;

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

void main() {
    vec4 posColor = texture(particleTexture, flowUV);
    vec2 particlePos = vec2(posColor.r + posColor.b / 255.0, posColor.g + posColor.a / 255.0);

    vec2 velocity = mix(flowMin, flowMax, lookup_speed(particlePos).rg);
    float speed_t = length(velocity) / length(flowMax);

    // take EPSG:4236 distortion into account for calculating where the particle moved
    float distortion = cos(radians(particlePos.y * 180.0 - 90.0));
    vec2 offset = vec2(velocity.x / distortion, velocity.y) * 0.0001 * speedFactor;

    particlePos = clamp(particlePos + offset,  vec2(0.0), vec2(1.0));

    // a random seed to use for the particle drop
    vec2 seed = (particlePos + flowUV) * randomSeed;

    // drop rate is a chance a particle will restart at random position, to avoid degeneration
    float drop_rate = dropRate + speed_t * dropRateBump;
    float drop = step(1.0 - drop_rate, rand(seed));
    // new step to check if show

    float countdown = texture(originDeathListTexture, flowUV).r * 255.0;

    if (countdown <= rebirthCountdown) // prepare to rebirth
        FragColor = mod(countdown - 1.0 + 255.0, 255.0) / 255.0;
    else // enable to die
        FragColor = mix(0.5, rebirthCountdown / 255.0, drop);
    // FragColor = 1.0;
}