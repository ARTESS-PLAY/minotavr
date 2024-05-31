import { CustomPipeline } from '../share/CustomPipeline';

const frag_old = `
precision mediump float;
uniform float     time;
uniform vec2      resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main( void ) {
	vec2 uv = outTexCoord;
	uv.y += (sin((uv.x + (time * 0.5)) * 10.0) * 0.1) + (sin((uv.x + (time * 0.2)) * 32.0) * 0.01);
	vec4 texColor = texture2D(uMainSampler, uv);
	gl_FragColor = texColor;
}`;

const frag2 = `
    precision mediump float;
    uniform sampler2D uMainSampler;
    varying vec2 outTexCoord;
    void main(void) {
        vec4 color = texture2D(uMainSampler, outTexCoord);
        float gray = dot(color.rgb, vec3(0.299, 0.187, 0.114));
        gl_FragColor = vec4(vec3(gray), 1.0);
    }`;

// const frag = `
// precision mediump float;

// uniform vec2 resolution;
// uniform vec2 center;
// uniform float radius;
// uniform float intensity;

// void main() {
//     vec2 uv = gl_FragCoord.xy / center * resolution.xy;
//     vec2 diff = uv - center;
//     float distance = length(diff);

//     if (distance < radius) {
//         float brightness = 1.0 - distance / radius;
//         brightness = pow(brightness, intensity);
//         gl_FragColor = vec4(1.0, 1.0, 1.0, brightness);
//     } else {
//         discard;
//     }
// }
// `;
const frag = `
    precision mediump float;
    uniform vec2  resolution;
    uniform float tx;
    uniform float ty;
    uniform float r;
    uniform sampler2D uMainSampler;
    varying vec2 outTexCoord;
    vec3 makeCircle(vec2 st,vec2 center, vec3 col){
        float d = distance(st,center / resolution);
        float pct = smoothstep(r,r+210.1,d);
        return vec3(1.0-pct)*col;
    }
    void main(void) {
        vec2 st = vec2(gl_FragCoord.x/resolution.x,gl_FragCoord.y/resolution.y);
        vec4 color = texture2D(uMainSampler, outTexCoord);
        gl_FragColor = color*vec4(makeCircle(st,vec2(tx,ty),vec3(1.0)),1.0);
    }`;

export class SimpleLightShader extends CustomPipeline {
    constructor(game: Phaser.Game) {
        super(game, frag);
    }
}
