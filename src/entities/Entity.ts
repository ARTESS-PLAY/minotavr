import { Component } from './Logic/Component';

/**
 * Класс нужен для удобной работы с сущностями
 */

export class Entity extends Phaser.Physics.Arcade.Sprite {
    private components: { [key: string]: Component } = {};

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type?: string) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    public getComponent(key: string) {
        const component = this.components[key];

        if (!component) return false;

        return component;
    }

    protected addComponent(component: Component) {
        const isExist = this.getComponent(component.getKey());

        if (isExist) return;

        this.components[component.getKey()] = component;
    }
}
