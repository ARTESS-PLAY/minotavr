export class CustomPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
    constructor(game: Phaser.Game, fragShader: string) {
        super({
            game,
            fragShader,
        });
    }
}
