/**
 * Шейдер делает красивые удары сердца как шейдер
 */

import { CustomPipeline } from '../share/CustomPipeline';

const frag = `
                #ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec3 pulseColor;
uniform float pulseSpeed;
uniform float pulseIntensity;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float distance = length(uv - 0.5) * 2.0;
    float pulse = sin(distance * 10.0 - time * pulseSpeed) * pulseIntensity;
    vec3 color = mix(vec3(0.0), pulseColor, pulse);
    gl_FragColor = vec4(color, 1.0);
}`;

export class HeartBreakShader extends CustomPipeline {
    constructor(game: Phaser.Game) {
        super(game, frag);
    }

    init() {
        this.set1f('time', 0.0);
        this.set1f('pulseSpeed', 5.0);
        this.set1f('pulseIntensity', 0.5);
        this.set3fv('pulseColor', [1.0, 0.0, 0.0]);
    }
}
