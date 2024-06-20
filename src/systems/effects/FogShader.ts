import { Labyrinth } from '../../scenes/Labyrinth/Labyrinth';
import { CustomPipeline } from '../share/CustomPipeline';

const frag = `
    precision mediump float;

uniform sampler2D texture; // текстура игрового мира
uniform vec2 resolution; // разрешение экрана

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    
    // Используем текстуру игрового мира для создания эффекта тумана
    vec4 color = texture2D(texture, uv);
    
    // Добавляем эффект тумана к цвету
    float fogAmount = 1.0; // Измените этот параметр, чтобы регулировать интенсивность тумана
    vec3 fogColor = vec3(0.8, 0.8, 0.8); // Цвет тумана (серый)
    
    color.rgb = mix(color.rgb, fogColor, fogAmount);
    
    gl_FragColor = color;
}

`;

export class FogShader extends CustomPipeline {
    constructor(game: Phaser.Game) {
        super(game, frag);
    }

    // Включение пайплайна
    public init(scene: Labyrinth) {
        this.setScene(scene);

        const layers = (this.scene as Labyrinth).layers;
        this.set2f('resolution', 0.0, 0.4);

        layers.map((layer) => {
            if (layer) layer.setPipeline(this);
        });
    }

    public update() {}
}
