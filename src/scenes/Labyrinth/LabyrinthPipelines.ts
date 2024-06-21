// import { FogShader } from '../../systems/effects/FogShader';
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

    /**
     * Подключает все нужные пайпланый
     */
    public enablePipilines() {
        //работа с пайплайнами

        // Устанавливаем свет на слои
        const layers = (this.scene as Labyrinth).layers;

        let currentPipline = (
            this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
        ).pipelines.add(
            `light-layers`,
            new SimpleLightShader(this.scene.game),
        ) as unknown as SimpleLightShader;

        currentPipline?.init(this.scene, layers);
        this.pipelines.push(currentPipline);

        // Устанавливаем свет на слои
        const minotavr = (this.scene as Labyrinth).minotavr;

        currentPipline = (this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add(
            `light-minotaur`,
            new SimpleLightShader(this.scene.game),
        ) as unknown as SimpleLightShader;

        currentPipline?.init(this.scene, minotavr);
        this.pipelines.push(currentPipline);

        // Для работы с призраками
        currentPipline = (this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add(
            `gost-light`,
            new SimpleLightShader(this.scene.game),
        ) as unknown as SimpleLightShader;
        this.pipelines.push(currentPipline);
    }

    // /**
    //  * Подключает все нужные пайпланый
    //  */
    // public enablePipilinesOLD() {
    //     //работа с пайплайнами
    //     pipelines.forEach((pipeline) => {
    //         const currentPipline = (
    //             this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    //         ).pipelines.add(
    //             pipeline.name,
    //             new pipeline(this.scene.game),
    //         ) as unknown as InstanceType<typeof pipeline>;

    //         const currentPipline = (
    //             this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    //         ).pipelines.add(
    //             pipeline.name,
    //             new pipeline(this.scene.game),
    //         ) as unknown as InstanceType<typeof pipeline>;

    //         currentPipline?.init(this.scene);
    //         currentPipline?.initForEnimy();

    //         this.pipelines.push(currentPipline);
    //     });

    // }

    /**
     * Обновляет все нужные пайплайны
     */
    public updatePipelines() {
        this.pipelines.forEach((pipeline) => {
            pipeline.update();
        });
    }

    /**
     * Удаляет все пайплайны
     */
    public shutdownPipelines() {
        const rerender = this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer;

        this.pipelines.forEach((pipeline) => {
            rerender.pipelines.remove(pipeline.name);
        });
    }
}
