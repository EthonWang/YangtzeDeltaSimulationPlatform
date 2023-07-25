#version 300 es

layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aTexCoord;

uniform vec2 viewport;
uniform vec2 image;

out vec2 TexCoord;

void main()
{
    vec2 scale = image / viewport;
    gl_Position = vec4(scale * aPos / max(scale.x, scale.y), 0.0f, 1.0f);

    TexCoord = aTexCoord;
}