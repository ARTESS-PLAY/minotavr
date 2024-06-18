import { Entity } from '../Entity';

/**
 * Удобная оболочка для работы с компанентами
 */
export class Component {
    /**
     * Ключ по которому будет получаться компонет
     */
    private key: string;

    /**
     * Ссылка на сам объект, к которому добавляется компонент
     */
    protected entity: Entity;

    constructor(key: string, entity: Entity) {
        this.key = key;
        this.entity = entity;
    }

    public getKey() {
        return this.key;
    }
}
