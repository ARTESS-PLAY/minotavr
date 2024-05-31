export function getCanvasPoint(
    scene: Phaser.Scene,
    camera: Phaser.Cameras.Scene2D.Camera,
    obj: Phaser.GameObjects.Curve,
) {
    // obj is our game object
    var mat = obj.getWorldTransformMatrix();

    // Get world position;
    var x = mat.getX(0, 0);
    var y = mat.getY(0, 0);

    // Convert world position into canvas pixel space
    var cam = scene.cameras.main;
    var displayScale = cam.scaleManager.displayScale;

    //@ts-ignore
    mat = cam.matrix;
    let tx = mat.getX(x - camera.scrollX, y - camera.scrollY);
    let ty = mat.getY(x - camera.scrollX, y - camera.scrollY);
    x = Math.round(tx);
    y = Math.round(ty);

    return { x, y };
}
