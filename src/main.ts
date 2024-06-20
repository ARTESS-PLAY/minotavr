import Phaser from 'phaser';
import './assets/styles/main.css';
import { SCENES } from './scenes';

new Phaser.Game({
    width: 900,
    height: 600,
    title: 'Minotaur Labyrinth',
    url: '',
    disableContextMenu: true,
    scene: SCENES,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
});
