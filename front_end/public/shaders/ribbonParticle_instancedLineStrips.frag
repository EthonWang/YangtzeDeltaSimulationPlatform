#version 300 es

precision highp float;

in vec2  flowUV;

uniform sampler2D flowTexture;
uniform vec2 flowRes;
uniform vec2 flowMin;
uniform vec2 flowMax;

out vec4 FragColor;

int rampColors[8] = int[](
0x3288bd,
0x66c2a5,
0xabdda4,
0xe6f598,
0xfee08b,
0xfdae61,
0xf46d43,
0xd53e4f
);

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

vec3 colorFromInt(int color)
{
    float b = float(color & 0xFF) / 255.0;
    float g = float((color >> 8) & 0xFF) / 255.0;
    float r = float((color >> 16) & 0xFF) / 255.0;

    return vec3(r, g, b);
}

vec3 velocityColor(float speed)
{
    float bottomIndex = floor(speed * 10.0);
    float topIndex = mix(bottomIndex + 1.0, 7.0, step(6.0, bottomIndex));
    float interval = mix(1.0, 4.0, step(6.0, bottomIndex));

    vec3 slowColor = colorFromInt(rampColors[int(bottomIndex)]);
    vec3 fastColor = colorFromInt(rampColors[int(topIndex)]);

    return mix(slowColor, fastColor, (speed * 10.0 - float(bottomIndex)) / interval);
}

void main() {
    vec2 velocity = mix(flowMin, flowMax, lookup_speed(flowUV).rg);
    float speed_t = length(velocity) / length(flowMax);

    FragColor = vec4(velocityColor(speed_t), 1.0);
    
    // FragColor = vec4(lookup_speed(flowUV), 0.0, 1.0);
    // FragColor = vec4(vec3(151.0, 202.0, 203.0) / 255.0, 1.0);
}
