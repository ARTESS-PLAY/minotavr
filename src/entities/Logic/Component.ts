export class Component {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    public getKey() {
        return this.key;
    }
}
