#version 300 es

precision highp float;

layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aTexCoord;

uniform vec2 viewport;
uniform vec2 image;
uniform mat4 u_matrix;
uniform vec4 bbox;

out vec2 TexCoord;

vec2 ReCoordinate(vec2 pos) {
    vec4 minPos = vec4(u_matrix * vec4(bbox.xy, 0.0, 1.0));
    minPos = minPos / minPos.w;
    vec4 maxPos = vec4(u_matrix * vec4(bbox.zw, 0.0, 1.0));
    maxPos = maxPos / maxPos.w;
    vec2 res;
    float minX = min(minPos.x, maxPos.x);
    float maxX = max(minPos.x, maxPos.x);
    float minY = min(minPos.y, maxPos.y);
    float maxY = max(minPos.y, maxPos.y);
    res.x = minX + (maxX - minX) * ((pos.x + 1.0) / 2.0);
    res.y = minY + (maxY - minY) * ((pos.y + 1.0) / 2.0);
    return res;
}

void main()
{
    vec2 scale = image / viewport;
    // gl_Position = vec4(scale * aPos / max(scale.x, scale.y), 0.0f, 1.0f);

    vec2 pos = ReCoordinate(aPos);

    gl_Position = vec4(pos, 0.0f, 1.0f);

    TexCoord = aTexCoord;
}