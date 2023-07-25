#version 300 es

precision highp float;

in vec2 TexCoord;

uniform sampler2D texture1;
uniform float opacity;

out vec4 FragColor;

void main()
{
    vec4 color = texture(texture1, TexCoord);
    // a hack to guarantee opacity fade out even with a value close to 1.0
    FragColor = vec4(floor(255.0 * color * opacity) / 255.0);
//    FragColor = vec4(color.rgb, 1.0);
//    FragColor = vec4(color.r, color.r, color.r, 1.0);
//    FragColor = vec4(color.rgb, 1.0);
}