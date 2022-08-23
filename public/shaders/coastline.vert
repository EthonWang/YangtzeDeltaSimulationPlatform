#version 300 es

precision highp float;

layout (location = 0) in vec2 aPos;

void main()
{
    vec2 pos = aPos * 2.0 - 1.0;
    gl_Position = vec4(pos, 0.0f, 1.0f);
}