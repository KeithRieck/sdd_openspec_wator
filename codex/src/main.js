import { BootScene } from "./scenes/BootScene.js";
import { SimulationScene } from "./scenes/SimulationScene.js";

const config = {
  type: Phaser.AUTO,
  parent: document.body,
  backgroundColor: "#042432",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight
  },
  scene: [BootScene, SimulationScene]
};

new Phaser.Game(config);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
