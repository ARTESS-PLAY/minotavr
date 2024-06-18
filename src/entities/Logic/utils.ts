/*
 * Функция применяет миксины к классу
 *
 * Пример:
 *
 * class Sprite {
 *   x = 0;
 *   y = 0;
 * }
 *
 * interface Sprite extends Jumpable, Duckable {}
 * applyMixins(Sprite, [Jumpable, Duckable]);
 */

function applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
            );
        });
    });
}
