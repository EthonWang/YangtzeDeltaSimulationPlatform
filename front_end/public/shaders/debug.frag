#version 300 es

precision highp float;

in vec2 TexCoord;

uniform sampler2D texture1;

uniform float components;

out vec4 FragColor;

void main()
{
    vec4 color = texture(texture1, TexCoord);

    FragColor = mix(vec4(vec3(color.r), 1.0), color, step(3.0, components));
}