import { SimpleLightShader } from '../../systems/lighting/SimpleLightShader';
import { Labyrinth } from './Labyrinth';

const pipelines = [SimpleLightShader];

/**
 * Класс отвечает за работу пайплайнов в сцене лабиринта
 */

export class LabyrinthPipelines {
    private scene: Labyrinth;
    private pipelines: InstanceType<(typeof pipelines)[number]>[];
    constructor(scene: Labyrinth) {
        this.scene = scene;
        this.pipelines = [];
    }

    public enablePipilines() {
        //работа с пайплайнами
        pipelines.forEach((pipeline) => {
            const currentPipline = (
                this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
            ).pipelines.add(
                pipeline.name,
                new pipeline(this.scene.game),
            ) as unknown as InstanceType<typeof pipeline>;

            currentPipline?.init(this.scene);

            this.pipelines.push(currentPipline);
        });
    }

    public updatePipelines() {
        this.pipelines.forEach((pipeline) => {
            pipeline.update();
        });
    }
}
