export class CustomPipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
    protected scene: Phaser.Scene | null = null;

    constructor(game: Phaser.Game, fragShader: string) {
        super({
            game,
            fragShader,
        });
    }

    public setScene(scene: Phaser.Scene) {
        this.scene = scene;
    }
}
