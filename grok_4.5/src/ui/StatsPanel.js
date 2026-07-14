import { COLORS, LAYOUT } from '../config.js';

/**
 * Left-side stats: Chronon, Fish, Sharks, Status.
 * Spec: simulation-ui R3.
 */
export class StatsPanel {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.background = scene.add.graphics();
    this.container.add(this.background);

    const style = {
      fontFamily: LAYOUT.fontFamily,
      fontSize: `${LAYOUT.bodyFontSize}px`,
      color: '#e8f1ff'
    };
    const titleStyle = {
      ...style,
      fontSize: `${LAYOUT.titleFontSize}px`,
      fontStyle: 'bold'
    };

    this.title = scene.add.text(0, 0, 'Stats', titleStyle);
    this.chrononText = scene.add.text(0, 0, 'Chronon: 0', style);
    this.fishText = scene.add.text(0, 0, 'Fish: 0', { ...style, color: '#3dcc6d' });
    this.sharkText = scene.add.text(0, 0, 'Sharks: 0', { ...style, color: '#3d8bfd' });
    this.statusText = scene.add.text(0, 0, 'Status: Running', style);

    this.container.add([
      this.title,
      this.chrononText,
      this.fishText,
      this.sharkText,
      this.statusText
    ]);

    this.bounds = { x: 0, y: 0, width: 160, height: 200 };
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  setBounds(x, y, width, height) {
    this.bounds = { x, y, width, height };
    this.container.setPosition(x, y);

    this.background.clear();
    this.background.fillStyle(COLORS.panel, 1);
    this.background.lineStyle(1, COLORS.panelBorder, 1);
    this.background.fillRoundedRect(0, 0, width, height, 8);
    this.background.strokeRoundedRect(0, 0, width, height, 8);

    const pad = 12;
    let ty = pad;
    this.title.setPosition(pad, ty);
    ty += 28;
    this.chrononText.setPosition(pad, ty);
    ty += 24;
    this.fishText.setPosition(pad, ty);
    ty += 24;
    this.sharkText.setPosition(pad, ty);
    ty += 24;
    this.statusText.setPosition(pad, ty);
    this.statusText.setWordWrapWidth(width - pad * 2);
  }

  /**
   * @param {{chronon:number, fish:number, sharks:number, status:string}} stats
   */
  update(stats) {
    this.chrononText.setText(`Chronon: ${stats.chronon}`);
    this.fishText.setText(`Fish: ${stats.fish}`);
    this.sharkText.setText(`Sharks: ${stats.sharks}`);
    this.statusText.setText(`Status: ${stats.status}`);
  }

  /** Release display objects. */
  destroy() {
    this.container.destroy(true);
  }
}
