import { CONFIG } from '../config.js';

/** Phaser-native live population statistics panel. */
export class StatsPanel {
  /** Create a text panel inside the supplied Phaser scene. */
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.background = scene.add.graphics();
    this.text = scene.add.text(0, 0, '', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      color: '#e6f4ff',
      lineSpacing: 9,
    });
    this.container.add([this.background, this.text]);
  }

  /** Render current stats and position the panel. */
  render(bounds, stats) {
    this.container.setPosition(bounds.x, bounds.y);
    this.background.clear();
    this.background.fillStyle(CONFIG.colors.panel, 0.94);
    this.background.fillRoundedRect(0, 0, bounds.width, bounds.height, 12);
    this.background.lineStyle(1, CONFIG.colors.panelBorder, 1);
    this.background.strokeRoundedRect(0, 0, bounds.width, bounds.height, 12);
    this.text.setPosition(16, 16);
    this.text.setWordWrapWidth(Math.max(80, bounds.width - 32));
    this.text.setText([
      `CHRONON\n${stats.chronon}`,
      `FISH\n${stats.fish}`,
      `SHARKS\n${stats.sharks}`,
      `STATUS\n${stats.status}`,
    ].join('\n\n'));
  }
}
