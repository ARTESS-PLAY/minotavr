import { Labyrinth } from '../../scenes/Labyrinth/Labyrinth';
import { getCanvasPoint } from '../../utils/camera';
import { CustomPipeline } from '../share/CustomPipeline';

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
    private worldHeight: string | number;

    constructor(game: Phaser.Game) {
        super(game, frag);
        this.worldHeight = this.game.config.height;
    }

    // Включение пайплайна
    public init(scene: Labyrinth, object: any) {
        this.set1f('tx', 0);
        this.set1f('ty', 0);
        this.set1f('r', 1);
        this.set2f('resolution', 1.4, 1.4);

        this.setScene(scene);

        // Устанавливаем свет на слои
        if (Array.isArray(object)) {
            object.map((el) => {
                if (el) el.setPipeline(this);
            });
        } else {
            object.setPipeline(this);
        }
    }

    public update() {
        const scene = this.scene as Labyrinth;
        if (!scene?.player) return;

        const playerCurve = scene.player as unknown as Phaser.GameObjects.Curve;
        const { x, y } = getCanvasPoint(scene, scene.cameras.main, playerCurve);

        this.set1f('tx', x);
        this.set1f('ty', Number(this.worldHeight) - y);
    }
}
